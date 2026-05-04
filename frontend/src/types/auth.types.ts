export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN'
export type UserStatus = 'ACTIVE' | 'PENDING_VERIFY' | 'BANNED'

export interface User {
    id: number
    email: string
    phone?: string
    fullName: string
    role: UserRole
    status: UserStatus
    avatarUrl?: string
    lastLoginAt?: string
    createdAt: string
}

export interface AuthResponse {
    accessToken: string
    tokenType: string
    expiresIn: number
    userId: number
    role: UserRole
}

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    email: string
    password: string
    fullName: string
    phone?: string
    role: 'PATIENT' | 'DOCTOR'
}

export interface VerifyOtpRequest {
    email: string
    otp: string
}