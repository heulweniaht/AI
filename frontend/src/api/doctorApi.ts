import axiosInstance from './axiosInstance';
import {
    DoctorProfile, DoctorSchedule, DoctorSearchFilter,
    Review, Specialty
} from '@/types/doctor.types';
import { PaginationParams, PagedResponse } from '@/types/common.types';

export const doctorApi = {
    // Tìm kiếm bác sĩ
    searchDoctors: async (
        filter: DoctorSearchFilter,
        pagination: PaginationParams = { page: 0, size: 12 }
    ): Promise<PagedResponse<DoctorProfile>> => {
        const params = { ...filter, ...pagination };
        const res = await axiosInstance.get<PagedResponse<DoctorProfile>>(
            '/doctors', { params }
        );
        return res.data; // Sửa .data.data thành .data
    },

    // Lấy chi tiết 1 bác sĩ
    getDoctorById: async (id: number): Promise<DoctorProfile> => {
        const res = await axiosInstance.get<DoctorProfile>(`/doctors/${id}`);
        return res.data;
    },

    // Lấy lịch khám trống theo ngày
    getAvailableSchedules: async (
        doctorId: number,
        date: string
    ): Promise<DoctorSchedule[]> => {
        const res = await axiosInstance.get<DoctorSchedule[]>(
            `/doctors/${doctorId}/schedules`, { params: { date } }
        );
        return res.data;
    },

    // Thêm đánh giá
    addReview: async (
        doctorId: number,
        data: { rating: number; comment: string; isAnonymous: boolean }
    ): Promise<Review> => {
        const res = await axiosInstance.post<Review>(
            `/doctors/${doctorId}/reviews`, data
        );
        return res.data;
    },

    // Lấy danh sách chuyên khoa
    getSpecialties: async (): Promise<Specialty[]> => {
        const res = await axiosInstance.get<Specialty[]>('/specialties');
        return res.data;
    },

    updateFullProfile: async (id: number, data: any): Promise<string> => {
        const res = await axiosInstance.put<string>(`/doctors/${id}/profile`, data);
        return res.data;
    },

};