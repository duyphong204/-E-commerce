import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAccounts } from './getAccounts';
import { createAccount, updateAccount, deleteAccount } from './accountMutations';
import { FetchAccountsParams } from '../types/account.types';

export function useAccounts(params: FetchAccountsParams = {}) {
  return useQuery({
    queryKey: ['accounts', params.term || '', params.page || 1, params.limit || 10],
    queryFn: ({ signal }) => getAccounts(params, signal),
  });
}

export function useAccountMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  return {
    createAccount: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateAccount: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteAccount: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
