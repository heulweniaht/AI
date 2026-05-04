export type DoctorStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED'

export interface Specialty {
    id: number
    name: string
    iconUrl: string
    description: string
    isActive: boolean
}

export interface DoctorProfile {
    id: number
    userId: number
    specialtyId: number
    specialtyName: string
    fullName: string
    bio: string
    experienceYears: number
    clinicName: string
    clinicAddress: string
    clinicCity: string
    consultationFee: number
    gender: 'MALE' | 'FEMALE'
    ratingAvg: number
    totalReviews: number
    totalAppointments: number
    avatarUrl?: string
    status: DoctorStatus
}

export interface DoctorSchedule {
    id: number
    doctorId: number
    scheduleDate: string
    startTime: string
    endTime: string
    isAvailable: boolean
    isBooked: boolean

}

export interface DoctorSearchFilter {
    specialtyId?: number
    city?: string
    gender?: 'MALE' | 'FEMALE'
    minRating?: number
    maxPrice?: number
    keyword?: string
    sort?: string
}

export interface Review {
    id: number
    appointmentId: number
    patientId: number
    patientName: string
    doctorId: number
    rating: number
    comment: string
    isAnonymous: boolean
    createdAt: string
}
