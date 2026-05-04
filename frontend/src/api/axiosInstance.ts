import axios, {
    AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse
} from 'axios'
import { useAuthStore } from '@/store/authStore'
import type { ApiError } from '@/types/common.types'

const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10_000,
    withCredentials: true, // Cực kỳ quan trọng để gửi kèm Cookie (Refresh Token)[cite: 1]
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
})

let isRefreshing = false
let failedQueue: Array<{
    resolve: (token: string) => void
    reject: (error: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach(promise => {
        if (error) promise.reject(error)
        else promise.resolve(token!)
    })
    failedQueue = []
}

// 1. REQUEST INTERCEPTOR: Tự động gắn Token trước khi gửi đi[cite: 1]
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Lấy token từ Zustand Store (ta sẽ tạo ở phần sau)[cite: 1]
        const { accessToken } = useAuthStore.getState()

        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// 2. RESPONSE INTERCEPTOR: Bắt lỗi 401 và tự động Refresh[cite: 1]
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            originalRequest.headers['Authorization'] = `Bearer ${token}`
                            resolve(axiosInstance(originalRequest))
                        },
                        reject,
                    })
                })
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                const { data } = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
                    {},
                    { withCredentials: true } // Phải có để gửi HttpOnly Cookie chứa refresh token lên[cite: 1]
                )

                const newAccessToken: string = data.data.accessToken
                useAuthStore.getState().setAccessToken(newAccessToken)
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`

                processQueue(null, newAccessToken)
                return axiosInstance(originalRequest)

            } catch (refreshError) {
                processQueue(refreshError, null)
                useAuthStore.getState().logout()
                window.location.href = '/login'
                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }

        if (error.response?.status === 403) window.location.href = '/unauthorized'

        return Promise.reject(error)
    }
)

export default axiosInstance