import apiClient from '@/shared/api/api-client';
import { Account, CreateAccountInput, UpdateAccountInput } from '../schemas/account.schema';

export async function createAccount(input: CreateAccountInput): Promise<Account> {
  const { data } = await apiClient.post<{ newUser: Account }>('/api/admin/users', input);
  return data.newUser;
}

export async function updateAccount({ id, ...input }: UpdateAccountInput): Promise<Account> {
  const { data } = await apiClient.put<Account>(`/api/admin/users/${id}`, input);
  return data;
}

export async function deleteAccount(id: string): Promise<string> {
  await apiClient.delete(`/api/admin/users/${id}`);
  return id;
}
