import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { doctorApi } from '@/api/doctorApi';
import type { DoctorSearchFilter } from '@/types/doctor.types';
import type { PaginationParams } from '@/types/common.types';
import { appointmentApi } from '@/api/appointmentApi';

export const doctorKeys = {
    all: ['doctors'] as const,
    lists: () => [...doctorKeys.all, 'list'] as const,
    list: (filter: DoctorSearchFilter, page: PaginationParams) =>
        [...doctorKeys.lists(), filter, page] as const,
    details: () => [...doctorKeys.all, 'detail'] as const,
    detail: (id: number) => [...doctorKeys.details(), id] as const,
    schedules: (doctorId: number, date: string) =>
        [...doctorKeys.all, 'schedules', doctorId, date] as const,
    specialties: ['specialties'] as const,
};

// LẤY DANH SÁCH BÁC SĨ (CÓ FILTER VÀ PAGINATION)

export const useDoctors = (
    filter: DoctorSearchFilter = {},
    pagination: PaginationParams = { page: 0, size: 12 }
) => {
    return useQuery({
        queryKey: doctorKeys.list(filter, pagination),
        queryFn: () => doctorApi.searchDoctors(filter, pagination),
        staleTime: 5 * 60 * 1000, // Dữ liệu bác sĩ sống trong 5 phút
    });
};

// LẤY DANH SÁCH CHUYÊN KHOA (CHO THANH FILTER)
export const useSpecialties = () => {
    return useQuery({
        queryKey: doctorKeys.specialties,
        queryFn: doctorApi.getSpecialties,
        staleTime: 60 * 60 * 1000,
    });
};

export const useDoctorDetail = (id: number) => {
    return useQuery({
        queryKey: doctorKeys.detail(id),
        queryFn: () => doctorApi.getDoctorById(id),
        enabled: !!id, // Chỉ chạy gọi API nếu id tồn tại
    });
};

export const useDoctorSchedules = (doctorId: number, date: string) => {
    return useQuery({
        queryKey: doctorKeys.schedules(doctorId, date),
        queryFn: () => doctorApi.getAvailableSchedules(doctorId, date),
        enabled: !!doctorId && !!date,
    });
};

// Dành riêng bác sĩ
// 1. Xem danh sách các ca khám (có lọc)
export const useDoctorAppointments = (params: any = {}) => {
    return useQuery({
        queryKey: ['doctor-appointments', params],
        queryFn: () => appointmentApi.getMyAppointments(params),
        staleTime: 60 * 1000,
    });
};

// 2. Lấy bảng lịch làm việc
export const useDoctorScheduleManagement = (params: { startDate: string; endDate: string }) => {
    return useQuery({
        queryKey: ['doctor_schedule_manage', params],
        queryFn: async () => {
            const { default: axiosInstance } = await import('@/api/axiosInstance');
            const res = await axiosInstance.get('doctor/schedules', { params });
            return res.data.data;
        },
        enabled: !!params.startDate && !!params.endDate,
    });
};

// 3. Tạo lịch/cập nhật lịch
export const useCreateBulkSchedules = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const { default: axiosInstance } = await import('@/api/axiosInstance');
            const res = await axiosInstance.post('doctor/schedules/bulk', data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['doctor_schedule_manage'] })
            queryClient.invalidateQueries({ queryKey: doctorKeys.all });
        },
    });
};