import User from "../../models/User";
import { paginate, PaginatedResult } from "../../common/utils/pagination";

export class UserRepository {
  async findByEmail(email: string) {
    return User.findOne({ email });
  }

  async findById(id: string) {
    return User.findById(id);
  }

  async create(userData: any) {
    return User.create(userData);
  }

  async findPaginated(query: any, page: number, limit: number, sort: any): Promise<PaginatedResult<any>> {
    return paginate(User as any, query, { page, limit, sort });
  }

  async countByRole(role: string): Promise<number> {
    return User.countDocuments({ role });
  }

  async delete(id: string) {
    return User.findByIdAndDelete(id);
  }
}

