// Bọc ngoài mọi response từ Spring Boot
export interface ApiResponse<T> {
    success: boolean
    status: number
    message: string
    data: T
    timestamp: string
    path?: string
}

// Phân trang từ Spring Boot (Page<T>)
export interface PagedResponse<T> {
    content: T[]
    page: number
    size: number
    totalElements: number
    totalPages: number
    last: boolean
}

export interface ApiError {
    status: number
    error: string
    message: string
    timestamp: string
    path?: string
    errors?: Record<string, string>
}

export interface PaginationParams {
    page?: number
    size?: number
    sort?: string
}