import { Request, Response } from "express";
import { UserService } from "./user.service";
import { catchAsync } from "../../common/utils/catchAsync";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../../common/utils/jwt";
import { UnauthorizedException } from "../../common/exceptions/HttpException";
import { AuthenticatedRequest } from "../../common/middlewares/auth.middleware";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  login = catchAsync(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await this.userService.login(req.body);
    
    this.setRefreshTokenCookie(res, refreshToken);

    return res.json({
      message: "Đăng nhập thành công",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  });

  register = catchAsync(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await this.userService.register(req.body);

    this.setRefreshTokenCookie(res, refreshToken);

    return res.status(201).json({
      message: "Đăng ký thành công",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  });

  getProfile = catchAsync(async (req: Request, res: Response) => {
    // Assuming you have an auth middleware that sets req.user
    const userId = (req as any).user?.id || (req as any).user?._id; 
    const user = await this.userService.getProfile(userId);
    
    return res.json({ user });
  });

  refreshToken = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException("No refresh token");
    }

    try {
      const decoded: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string);
      const newAccessToken = generateAccessToken(decoded.id || decoded._id);
      const newRefreshToken = generateRefreshToken(decoded.id || decoded._id);

      this.setRefreshTokenCookie(res, newRefreshToken);

      return res.json({ accessToken: newAccessToken });
    } catch (err) {
      res.clearCookie("refreshToken");
      throw new UnauthorizedException("Invalid refresh token");
    }
  });

  logout = catchAsync(async (req: Request, res: Response) => {
    res.clearCookie("refreshToken");
    return res.json({ message: "Đăng xuất thành công" });
  });

  // Admin Methods
  getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const data = await this.userService.getAllUsers(page, limit);
    return res.json(data);
  });

  searchUser = catchAsync(async (req: Request, res: Response) => {
    const term = (req.query.term as string) || "";
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const data = await this.userService.searchUser(term, page, limit);
    return res.json(data);
  });

  createUser = catchAsync(async (req: Request, res: Response) => {
    const result = await this.userService.createUser(req.body);
    return res.status(201).json(result);
  });

  updateUser = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const id = req.params.id as string;
    const requesterId = (req.user._id || req.user.id).toString();
    const result = await this.userService.updateUser(id, requesterId, req.body);
    return res.json(result);
  });

  deleteUser = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const id = req.params.id as string;
    const requesterId = (req.user._id || req.user.id).toString();
    const result = await this.userService.deleteUser(id, requesterId);
    return res.json(result);
  });

  private setRefreshTokenCookie(res: Response, token: string) {
    res.cookie("refreshToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}

