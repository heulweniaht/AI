import axiosInstance from './axiosInstance';
import {
    Appointment, BookAppointmentRequest,
    CancelAppointmentRequest, CompleteAppointmentRequest
} from '@/types/appointment.types';
import { PagedResponse } from '@/types/common.types';

export const appointmentApi = {
    //Bệnh nhân đặt lịch mới
    bookAppointment: async (
        data: BookAppointmentRequest
    ): Promise<any> => {
        const res = await axiosInstance.post(
            '/appointments', data
        )
        return res.data?.data || res.data || res;
    },

    //Lấy danh sách lịch khám của tôi
    getMyAppointments: async (params: {
        page?: number
        size?: number
        status?: string
    } = {}): Promise<PagedResponse<Appointment>> => {
        const res = await axiosInstance.get<PagedResponse<Appointment>>(
            '/appointments', { params: { page: 0, size: 10, ...params } }
        )
        return res.data;
    },

    //Lấy chi tiết 1 lịch khám
    getAppointmentById: async (id: number): Promise<Appointment> => {
        const res = await axiosInstance.get<Appointment>(
            `/appointments/${id}`
        )
        return res.data;
    },

    //Hủy lịch
    cancelAppointment: async (
        id: number,
        data: CancelAppointmentRequest
    ): Promise<Appointment> => {
        const res = await axiosInstance.patch<Appointment>(
            `/appointments/${id}/cancel`, data
        )
        return res.data;
    },

    //Hoàn thành lịch khám (Chỉ dành cho bác sĩ)
    completeAppointment: async (
        id: number,
        data: CompleteAppointmentRequest
    ): Promise<Appointment> => {
        const res = await axiosInstance.patch<Appointment>(
            `/appointments/${id}/complete`, data
        )
        return res.data;
    }
}