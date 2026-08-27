import axios from 'axios';

export function getErrorMessage(error: unknown, defaultMessage = "Có lỗi xảy ra, vui lòng thử lại"): string {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;
    if (responseData) {
      if (Array.isArray(responseData.errors) && responseData.errors.length > 0) {
        return responseData.errors.map((err: any) => typeof err === 'string' ? err : err.message || err.msg).filter(Boolean).join("\n");
      }
      return (
        responseData.message ||
        responseData.error ||
        error.message ||
        defaultMessage
      );
    }
    return error.message || defaultMessage;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return defaultMessage;
}
