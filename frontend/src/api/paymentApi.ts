import type { ApiResponse } from "@/types/common.types";
import axiosInstance from "./axiosInstance";

export const paymentApi = {
    // Tạo URL thanh toán
    createPaymentUrl: async (data: {
        appointmentId: number,
        method?: string,
        amount: number
    }): Promise<{ paymentUrl?: string; message: string }> => {
        const res = await axiosInstance.post('/payments', data);
        return res.data?.data || res.data || res;
    },

    //Lấy lịch sử giao dịch của tôi
    getMyPayments: async (params: {}) => {
        const res = await axiosInstance.get('/payments', { params })
        return res.data.data
    },
}