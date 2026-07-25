import axios from 'axios';

export function getErrorMessage(error: unknown, defaultMessage = "Có lỗi xảy ra, vui lòng thử lại"): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      defaultMessage
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return defaultMessage;
}
