import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { appointmentApi } from '@/api/appointmentApi'
import { useBookingStore } from '@/store/bookingStore'
import type { BookAppointmentRequest } from '@/types/appointment.types'
import { getErrorMessage } from '@/api/apiHelpers'

// Định nghĩa các "Chìa khóa" (Key)
export const appointmentKeys = {
    all: ['appointments'] as const,
    lists: (params?: object) => [...appointmentKeys.all, 'list', params] as const,
    detail: (id: number) => [...appointmentKeys.all, 'detail', id] as const,
}

// Lấy danh sách lịch
export const useAppointments = (params: any = {}) => {
    return useQuery({
        queryKey: appointmentKeys.lists(params),
        queryFn: () => appointmentApi.getMyAppointments(params),
        staleTime: 60 * 1000, // 1 phút
    })
}

// Gửi lệnh đặt lịch
export const useBookAppointment = () => {
    const queryClient = useQueryClient()
    const { nextStep } = useBookingStore()

    return useMutation({
        mutationFn: (data: BookAppointmentRequest) =>
            appointmentApi.bookAppointment(data),

        onSuccess: (appointment) => {
            // 1. Khi đặt lịch thành công, báo cho React Query phải xóa Cache cũ đi để tải lại danh sách mới
            queryClient.invalidateQueries({ queryKey: appointmentKeys.all })

            // 2. Chuyển sang bước tiếp theo trong Wizard 
            nextStep()
            toast.success('Đặt lịch thành công!')
        },

        onError: (error) => {
            // 3. Xử lý lỗi
            toast.error(getErrorMessage(error))
        }
    })

}



