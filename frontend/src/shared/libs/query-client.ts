import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      retry: (failureCount, error) => {
        if (axios.isAxiosError(error) && error.response) {
          const status = error.response.status;
          return status >= 500 && failureCount < 1;
        }
        return false;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
