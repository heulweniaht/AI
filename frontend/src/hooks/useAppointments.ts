import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { appointmentApi } from '@/api/appointmentApi';
import type { BookAppointmentRequest } from '@/types/appointment.types';
import { getErrorMessage } from '@/api/apiHelpers';
import { useBookingStore } from '@/store/bookingStore';

export const appointmentKeys = {
    all: ['appointments'] as const,
    lists: (params?: object) => [...appointmentKeys.all, 'list', params] as const,
    detail: (id: number) => [...appointmentKeys.all, 'detail', id] as const,
};

export const useMyAppointments = (params: any = {}) => {
    return useQuery({
        queryKey: appointmentKeys.lists(params),
        queryFn: () => appointmentApi.getMyAppointments(params),
        staleTime: 60 * 1000,
    });
};

export const useBookAppointment = () => {
    const queryClient = useQueryClient();
    const { nextStep } = useBookingStore();

    return useMutation({
        mutationFn: (data: BookAppointmentRequest) =>
            appointmentApi.bookAppointment(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
            nextStep();
            toast.success('Đặt lịch thành công!');
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });
};

// dành cho Bác sĩ: Cập nhật kết luận và hoàn tất ca khám

export const useUpdateAppointmentNotes = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, notes }: { id: number; notes: string }) => {
            const { default: axiosInstance } = await import('@/api/axiosInstance');

            const res = await axiosInstance.put(`/appointments/${id}/status`, {
                status: 'COMPLETED',
                notes: notes
            });
        },
        onSuccess: () => {
            // Load lại danh sách lịch khám của bác sĩ
            queryClient.invalidateQueries({ queryKey: ['doctor_appointments'] });
            toast.success('Đã cập nhật bệnh án và hoàn tất ca khám!');
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });
}