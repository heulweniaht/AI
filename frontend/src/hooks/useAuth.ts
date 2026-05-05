import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '@/api/authApi';
import { useAuthStore } from '@/store/authStore';
import type { LoginRequest } from '@/types/auth.types';
import { getErrorMessage } from '@/api/apiHelpers';

// 1. Quản lý "Chìa khóa" bộ nhớ đệm (Cache Keys) cho React Query
export const authKeys = {
    me: ['auth', 'me'] as const,
};

// ============================================================================
// HOOK 1: LẤY THÔNG TIN USER HIỆN TẠI (GET /auth/me)
// ============================================================================
export const useMe = () => {
    const { isLoggedIn } = useAuthStore();

    return useQuery({
        queryKey: authKeys.me,
        queryFn: authApi.getMe,
        // Chỉ gọi API này khi người dùng đã có trạng thái isLoggedIn = true trong Zustand
        enabled: isLoggedIn,
        // Thông tin user ít thay đổi, giữ cache 10 phút để đỡ gọi API nhiều lần
        staleTime: 10 * 60 * 1000,
    });
};

// ============================================================================
// HOOK 2: XỬ LÝ ĐĂNG NHẬP (POST /auth/login)
// ============================================================================
export const useLogin = () => {
    const navigate = useNavigate();
    const { setAuth, setAccessToken } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: LoginRequest) => authApi.login(data),

        // Khi backend trả về kết quả thành công (HTTP 200)
        onSuccess: async (authResponse) => {
            try {
                // 1. Cất Access Token vào Zustand ngay lập tức (để Axios Interceptor có thể lấy dùng)
                setAccessToken(authResponse.accessToken);

                // 2. Gọi API lấy thông tin Profile đầy đủ của User bằng token vừa nhận
                const user = await authApi.getMe();

                // 3. Cập nhật trạng thái Đăng nhập chính thức vào Zustand Store (để AuthGuard mở cửa)
                setAuth(authResponse.accessToken, user);

                // 4. Xóa cache cũ của thông tin User (nếu có)
                queryClient.invalidateQueries({ queryKey: authKeys.me });

                // 5. Hiển thị thông báo chào mừng
                toast.success(`Xin chào, ${user.fullName}!`);

                // 6. Điều hướng người dùng về đúng trang chủ của họ dựa vào Quyền (Role)
                // Lưu ý: Chuẩn hóa role bằng toUpperCase() để đảm bảo so sánh chính xác
                const userRole = user.role.toUpperCase();

                if (userRole === 'ADMIN') {
                    navigate('/admin/dashboard');
                } else if (userRole === 'DOCTOR') {
                    navigate('/doctor/dashboard');
                } else {
                    // Mặc định là PATIENT
                    navigate('/patient/dashboard');
                }

            } catch (error) {
                toast.error("Không lấy được thông tin người dùng. Vui lòng đăng nhập lại.");
            }
        },

        // Khi backend báo lỗi (Sai pass, tài khoản không tồn tại, v.v.)
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });
};

// ============================================================================
// HOOK 3: XỬ LÝ ĐĂNG XUẤT (POST /auth/logout)
// ============================================================================
export const useLogout = () => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authApi.logout,

        // onSettled: Luôn chạy đoạn code này bất kể việc gọi API logout thành công hay lỗi mạng
        onSettled: () => {
            // 1. Xóa sạch token và dữ liệu user trong Zustand / Session Storage
            logout();

            // 2. Dọn sạch rác (cache) của React Query cho an toàn
            queryClient.clear();

            // 3. Đuổi về trang đăng nhập
            navigate('/login');
            toast.success('Đã đăng xuất an toàn.');
        },
    });
};

// ============================================================================
// HOOK 4: XỬ LÝ ĐĂNG KÝ (POST /auth/register)
// ============================================================================
export const useRegister = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (data: any) => authApi.register(data),

        onSuccess: async () => {
            // 1. Hiển thị thông báo thành công
            toast.success("Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.");

            // 2. Chuyển hướng về trang Đăng nhập
            navigate('/login');
        },

        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });
};

// ============================================================================
// HOOK 5: CẬP NHẬT HỒ SƠ NGƯỜI DÙNG (PUT /users/profile)
// ============================================================================
export const useUpdateProfile = () => {
    // Lấy hàm updateUser từ store
    const { updateUser } = useAuthStore();

    return useMutation({
        mutationFn: async (data: any) => {
            const { default: axiosInstance } = await import('@/api/axiosInstance');
            const response = await axiosInstance.put('/users/profile', data);
            return response.data;
        },
        onSuccess: (data) => {
            toast.success('Đã lưu các thay đổi hồ sơ y tế thành công!');

            // Chỉ cập nhật cục data mới vào User state, giữ nguyên token cũ
            if (data && data.data) {
                updateUser(data.data);
            }
        },
        onError: () => {
            toast.error('Có lỗi xảy ra khi cập nhật hồ sơ. Vui lòng thử lại.');
        },
    });
};