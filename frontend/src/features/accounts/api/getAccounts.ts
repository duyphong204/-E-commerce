import apiClient from '@/shared/api/api-client';
import { AccountsResponse, FetchAccountsParams } from '../types/account.types';

export async function getAccounts(params: FetchAccountsParams = {}, signal?: AbortSignal): Promise<AccountsResponse> {
  const endpoint = params.term
    ? '/api/admin/users/search'
    : '/api/admin/users';

  const { data } = await apiClient.get<AccountsResponse>(endpoint, {
    params: {
      term: params.term,
      page: params.page || 1,
      limit: params.limit || 10,
    },
    signal,
  });

  return data;
}
