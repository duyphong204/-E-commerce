import { UserRepository } from "./user.repository";
import { RegisterInput, LoginInput, AdminCreateUserInput, AdminUpdateUserInput } from "./user.schema";
import { BadRequestException, UnauthorizedException, NotFoundException } from "../../common/exceptions/HttpException";
import { generateAccessToken, generateRefreshToken } from "../../common/utils/jwt";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(data: RegisterInput) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new BadRequestException("Email đã được đăng ký");
    }

    const newUser = await this.userRepository.create(data);

    const accessToken = generateAccessToken((newUser as any)._id.toString());
    const refreshToken = generateRefreshToken((newUser as any)._id.toString());

    return { user: newUser, accessToken, refreshToken };
  }

  async login(data: LoginInput) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedException("Email hoặc mật khẩu không đúng.");
    }

    const isMatch = await (user as any).matchPassword(data.password);
    if (!isMatch) {
      throw new UnauthorizedException("Email hoặc mật khẩu không đúng.");
    }

    const accessToken = generateAccessToken((user as any)._id.toString());
    const refreshToken = generateRefreshToken((user as any)._id.toString());

    return { user, accessToken, refreshToken };
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException("Không tìm thấy người dùng");
    }
    return user;
  }

  // Admin Methods
  async getAllUsers(page: number, limit: number) {
    const data = await this.userRepository.findPaginated({}, page, limit, { createdAt: -1 });
    
    data.results = data.results.map((u: any) => {
      const { password, ...rest } = u.toObject();
      return rest;
    });

    const adminCount = await this.userRepository.countByRole("admin");
    const customerCount = await this.userRepository.countByRole("customer");

    return {
      ...data,
      statistics: { adminCount, customerCount },
    };
  }

  async searchUser(term: string, page: number, limit: number) {
    const trimmed = term.trim();
    if (!trimmed) {
      return { results: [], page: 1, totalPages: 1, totalItems: 0 };
    }

    const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escapeRegex(trimmed), "i");
    const query = { $or: [{ name: regex }, { email: regex }] };

    const data = await this.userRepository.findPaginated(query, page, limit, { createdAt: -1 });
    
    data.results = data.results.map((u: any) => {
      const { password, ...rest } = u.toObject();
      return rest;
    });

    const adminCount = await this.userRepository.countByRole("admin");
    const customerCount = await this.userRepository.countByRole("customer");

    return {
      ...data,
      statistics: { adminCount, customerCount },
    };
  }

  async createUser(data: AdminCreateUserInput) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new BadRequestException("Người dùng đã tồn tại");
    }

    const newUser = await this.userRepository.create(data);
    const { password, ...userWithoutPassword } = newUser.toObject();

    return { message: "Tạo người dùng thành công", newUser: userWithoutPassword };
  }

  async updateUser(id: string, requesterId: string, data: AdminUpdateUserInput) {
    const user = await this.userRepository.findById(id) as any;
    if (!user) {
      throw new NotFoundException("Không tìm thấy người dùng");
    }

    // Requester cannot change their own role
    if (requesterId === user._id.toString() && data.role && data.role !== user.role) {
      throw new BadRequestException("Không thể thay đổi quyền của chính mình");
    }

    // Cannot demote last admin
    if (user.role === "admin" && data.role === "customer") {
      const adminCount = await this.userRepository.countByRole("admin");
      if (adminCount <= 1) {
        throw new BadRequestException("Không thể hạ cấp admin cuối cùng trong hệ thống");
      }
    }

    if (data.name) user.name = data.name;
    if (data.email) user.email = data.email;
    if (data.role) user.role = data.role;
    if (data.password) user.password = data.password;

    const updatedUser = await user.save();
    const { password, ...rest } = updatedUser.toObject();
    return rest;
  }

  async deleteUser(id: string, requesterId: string) {
    const user = await this.userRepository.findById(id) as any;
    if (!user) {
      throw new NotFoundException("Không tìm thấy người dùng");
    }

    // Cannot delete self
    if (requesterId === user._id.toString()) {
      throw new BadRequestException("Không thể xóa tài khoản của chính mình");
    }

    // Cannot delete last admin
    if (user.role === "admin") {
      const adminCount = await this.userRepository.countByRole("admin");
      if (adminCount <= 1) {
        throw new BadRequestException("Không thể xóa admin cuối cùng trong hệ thống");
      }
    }

    await user.deleteOne();
    return { message: "Xóa người dùng thành công" };
  }
}

