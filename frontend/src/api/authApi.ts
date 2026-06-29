import { useAuthStore } from '@/store/authStore';
import axiosInstance from './axiosInstance';
import {
    LoginRequest, RegisterRequest, VerifyOtpRequest,
    AuthResponse, User
} from '@/types/auth.types';

export const authApi = {
    // Đăng nhập
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        // Đổi kiểu Generic và return trực tiếp res.data
        const res = await axiosInstance.post<AuthResponse>(
            '/auth/login', data
        )
        return res.data;
    },

    // Đăng ký
    register: async (data: RegisterRequest): Promise<string> => {
        const res = await axiosInstance.post<string>(
            '/auth/register', data
        )
        return res.data;
    },

    // Xác thực OTP
    verifyOtp: async (data: VerifyOtpRequest): Promise<string> => {
        const res = await axiosInstance.post<string>(
            '/auth/verify-otp', data
        )
        return res.data;
    },

    // // Đăng xuất
    // logout: async (): Promise<void> => {
    //     await axiosInstance.post('/auth/logout');
    // },

    // Lấy thông tin tài khoản đang đăng nhập
    getMe: async (): Promise<User> => {
        const res = await axiosInstance.get<User>('/auth/me');
        return res.data;
    },

    // Quên mật khẩu — gửi mật khẩu mới về email
    forgotPassword: async (email: string): Promise<string> => {
        const res = await axiosInstance.post<string>(
            `/auth/forgot-password?email=${encodeURIComponent(email)}`
        );
        return res.data;
    },

    // Đăng xuất — blacklist token hiện tại
    logout: async (): Promise<void> => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
            await axiosInstance.post('/auth/logout', null, {
                headers: { Authorization: `Bearer ${token}` }
            });
        }
    },
}