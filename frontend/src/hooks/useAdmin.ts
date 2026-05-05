import axiosInstance from "@/api/axiosInstance"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";

// 1. Lấy danh sách bác sĩ chờ duyệt
export const usePendingDoctors = () => {
    return useQuery({
        queryKey: ['admin', 'pending-doctors'],
        queryFn: async () => {
            const response = await axiosInstance.get('/admin/doctors/pending');
            //Check sau
            return response.data.data;
        },
    });
};


// 2. Phê duyệt bác sĩ/ Từ chối bác sĩ
export const useApproveDoctor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, status }: { id: number, status: 'APPROVED' | 'REJECTED' }) => {
            const response = await axiosInstance.put(`/admin/doctors/${id}/approve`, { status });
            return response.data.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'pending-doctors'] });

            if (variables.status === 'APPROVED') {
                toast.success('Phê duyệt bác sĩ thành công!');
            } else {
                toast.error('Từ chối bác sĩ thành công!');
            }
        },
        onError: () => {
            toast.error('Có lỗi xảy ra!');
        }
    })
}

// 3. Lấy dữ liệu thống kê dashboard admin
export const useAdminStats = () => {
    return useQuery({
        queryKey: ['admin', 'stats'],
        queryFn: async () => {
            const response = await axiosInstance.get('/admin/stats');
            return response.data.data;
        },
        staleTime: 5 * 60 * 1000,
    });
};

// 4. Lấy danh sách người dùng
export const useAdminUsers = (params: { keyword?: string; role?: string; page?: number; size?: number }) => {
    return useQuery({
        queryKey: ['admin', 'users', params],
        queryFn: async () => {
            const response = await axiosInstance.get('/admin/users', { params });
            return response.data.data;
        },
        staleTime: 60 * 1000,
    });
};

// 5. Khóa/Mở khóa tài khoản
export const useToggleUserStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, isLocked }: { id: number, isLocked: boolean }) => {
            const response = await axiosInstance.put(`/admin/users/${id}/status`, { isLocked });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
            toast.success('Đã cập nhật trạng thái tài khoản thành công!');
        },
        onError: () => {
            toast.error('Có lỗi xảy ra khi cập nhật trạng thái.');
        }
    });
};