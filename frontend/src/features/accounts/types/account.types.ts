import { Account } from '../schemas/account.schema';

export interface AccountsResponse {
  results: Account[];
  page: number;
  totalPages: number;
  totalItems: number;
  statistics: {
    adminCount: number;
    customerCount: number;
  };
}

export interface FetchAccountsParams {
  page?: number;
  limit?: number;
  term?: string;
}
