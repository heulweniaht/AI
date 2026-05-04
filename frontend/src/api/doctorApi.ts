import axiosInstance from './axiosInstance'
import type {
    DoctorProfile, DoctorSchedule, DoctorSearchFilter,
    Review, Specialty
} from '@/types/doctor.types'
import type { ApiResponse, PagedResponse, PaginationParams } from '@/types/common.types'

export const doctorApi = {
    // Tìm kiếm bác sĩ (có phân trang và lọc)
    searchDoctors: async (
        filter: DoctorSearchFilter,
        pagination: PaginationParams = { page: 0, size: 12 }
    ): Promise<PagedResponse<DoctorProfile>> => {
        const params = { ...filter, ...pagination }
        const res = await axiosInstance.get<ApiResponse<PagedResponse<DoctorProfile>>>(
            '/doctors', { params }
        )
        return res.data.data
    },

    // Lấy chi tiết 1 bác sĩ
    getDoctorById: async (id: number): Promise<DoctorProfile> => {
        const res = await axiosInstance.get<ApiResponse<DoctorProfile>>(
            `/doctors/${id}`
        )
        return res.data.data
    },

    // Lấy lịch khám trống theo ngày
    getAvailableSchedules: async (
        doctorId: number,
        date: string
    ): Promise<DoctorSchedule[]> => {
        const res = await axiosInstance.get<ApiResponse<DoctorSchedule[]>>(
            `/doctors/${doctorId}/schedules`, { params: { date } }
        )
        return res.data.data
    },

    // Thêm đánh giá
    addReview: async (
        doctorId: number,
        data: { rating: number; comment: string; isAnonymous: boolean }
    ): Promise<Review> => {
        const res = await axiosInstance.post<ApiResponse<Review>>(
            `/doctors/${doctorId}/reviews`, data
        )
        return res.data.data
    },

    // Lấy danh sách chuyên khoa
    getSpecialties: async (): Promise<Specialty[]> => {
        const res = await axiosInstance.get<ApiResponse<Specialty[]>>('/specialties')
        return res.data.data
    },
}