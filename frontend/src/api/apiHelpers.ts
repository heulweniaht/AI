import type { AxiosError } from 'axios'
import type { ApiError } from '@/types/common.types'

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    const axiosErr = error as AxiosError<ApiError>
    return axiosErr.response?.data?.message
      ?? axiosErr.message
      ?? 'Đã xảy ra lỗi. Vui lòng thử lại.'
  }
  return 'Đã xảy ra lỗi không xác định.'
}