export type AppointmentStatus =
    | 'PENDING'
    | 'CONFIRMED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'NO_SHOW'

export interface Attachment {
    name: string
    url: string
    fileType: string
}

export interface Appointment {
    id: number
    patientId: number
    patientName: string
    doctorId: number
    doctorName: string
    specialtyName: string
    scheduleId: number
    status: AppointmentStatus
    reason: string
    symptoms?: string[]
    attachments?: Attachment[]
    doctorNotes?: string
    cancellationReason?: string
    appointmentTime: string
    completedAt?: string
    createdAt: string
}

export interface BookAppointmentRequest {
    doctorId: number
    scheduleId: number
    reason: string
    symptoms: string[]
    attachments: Attachment[]
    paymentMethod: 'CASH' | 'VNPAY' | 'BANK_TRANSFER' | 'CREDIT_CARD'
}

export interface CancelAppointmentRequest {
    reason: string
}

export interface CompleteAppointmentRequest {
    notes: string
}