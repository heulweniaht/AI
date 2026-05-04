import { Appointment, BookAppointmentRequest, CancelAppointmentRequest, CompleteAppointmentRequest } from "@/types/appointment.types";
import axiosInstance from "./axiosInstance";
import { ApiResponse, PagedResponse } from "@/types/common.types";

export const appointmentApi = {
    //Bệnh nhân đặt lịch mới
    bookAppointment: async (
        data: BookAppointmentRequest
    ): Promise<Appointment> => {
        const res = await axiosInstance.post<ApiResponse<Appointment>>(
            '/appointments', data
        )
        return res.data.data
    },

    //Lấy danh sách lịch khám của tôi
    getMyAppointments: async (params: {
        page?: number
        size?: number
        status?: string
    } = {}): Promise<PagedResponse<Appointment>> => {
        const res = await axiosInstance.get<ApiResponse<PagedResponse<Appointment>>>(
            '/appointments', { params: { page: 0, size: 10, ...params } }
        )
        return res.data.data
    },

    //Lấy chi tiết 1 lịch khám
    getAppointmentById: async (id: number): Promise<Appointment> => {
        const res = await axiosInstance.get<ApiResponse<Appointment>>(
            `/appointments/${id}`
        )
        return res.data.data
    },

    //Hủy lịch
    cancelAppointment: async (
        id: number,
        data: CancelAppointmentRequest
    ): Promise<Appointment> => {
        const res = await axiosInstance.patch<ApiResponse<Appointment>>(
            `/appointments/${id}/cancel`, data
        )
        return res.data.data
    },

    //Hoàn thành lịch khám (Chỉ dành cho bác sĩ)
    completeAppointment: async (
        id: number,
        data: CompleteAppointmentRequest
    ): Promise<Appointment> => {
        const res = await axiosInstance.patch<ApiResponse<Appointment>>(
            `/appointments/${id}/complete`, data
        )
        return res.data.data
    }
}