import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const API_URL = (import.meta.env.VITE_API_URL || "").trim();

interface CustomInternalRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface PendingQueueItem {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}

const axiosInstance = axios.create({
  baseURL: API_URL || undefined,
  withCredentials: true,
  timeout: 20000,
});

let isRefreshing = false;
let failedQueue: PendingQueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("userToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (
      response.data &&
      response.data.success === true &&
      Object.prototype.hasOwnProperty.call(response.data, "data")
    ) {
      let finalData = response.data.data;
      if (response.data.meta) {
        finalData = {
          data: response.data.data,
          results: response.data.data,
          meta: response.data.meta,
          ...response.data.meta,
        };
      }

      return {
        ...response,
        data: finalData,
      };
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomInternalRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isAuthEndpoint =
      originalRequest.url?.includes("/login") ||
      originalRequest.url?.includes("/register");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers && token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axiosInstance.post<{ accessToken: string }>(
          `/api/users/refresh-token`,
          {}
        );

        const newAccessToken = data.accessToken;
        localStorage.setItem("userToken", newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        processQueue(null, newAccessToken);
        isRefreshing = false;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        localStorage.removeItem("userToken");
        localStorage.removeItem("userInfo");
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
