import axiosInstance from './axiosInstance'
import type {
    LoginRequest, RegisterRequest, VerifyOtpRequest,
    AuthResponse, User
} from '@/types/auth.types'
import type { ApiResponse } from '@/types/common.types'

export const authApi = {
    // Đăng nhập
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const res = await axiosInstance.post<ApiResponse<AuthResponse>>(
            '/auth/login', data
        )
        return res.data.data
    },

    // Đăng ký
    register: async (data: RegisterRequest): Promise<{ message: string }> => {
        const res = await axiosInstance.post<ApiResponse<{ message: string }>>(
            '/auth/register', data
        )
        return res.data.data
    },

    // Xác thực OTP
    verifyOtp: async (data: VerifyOtpRequest): Promise<{ message: string }> => {
        const res = await axiosInstance.post<ApiResponse<{ message: string }>>(
            '/auth/verify-otp', data
        )
        return res.data.data
    },

    // Đăng xuất
    logout: async (): Promise<void> => {
        await axiosInstance.post('/auth/logout')
    },

    // Lấy thông tin tài khoản đang đăng nhập
    getMe: async (): Promise<User> => {
        const res = await axiosInstance.get<ApiResponse<User>>('/auth/me')
        return res.data.data
    },
}