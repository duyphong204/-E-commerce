import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Tạo axios instance
const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// Biến để tránh refresh token nhiều lần đồng thời
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

//Tự động gắn access token vào header
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("userToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Tự động refresh token khi 401
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const isAuthEndpoint = originalRequest.url?.includes('/login') ||
            originalRequest.url?.includes('/register');

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
            // Nếu đang refresh, đợi trong queue
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Gọi API refresh token (refresh token ở cookie, tự động gửi)
                const { data } = await axiosInstance.post(
                    `/api/users/refresh-token`,
                    {}
                );

                const newAccessToken = data.accessToken;

                // Lưu access token mới
                localStorage.setItem("userToken", newAccessToken);

                // Update header cho request hiện tại
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                // Process queue
                processQueue(null, newAccessToken);

                isRefreshing = false;

                // Retry request ban đầu
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Refresh token thất bại -> Logout
                processQueue(refreshError, null);
                isRefreshing = false;

                // Xóa token và redirect về login
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
