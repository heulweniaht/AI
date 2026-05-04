import { create } from 'zustand'
import type { DoctorProfile, DoctorSchedule } from '@/types/doctor.types'
import type { Attachment } from '@/types/appointment.types'

interface BookingState {
    selectedDoctor: DoctorProfile | null
    selectedSlot: DoctorSchedule | null
    reason: string
    symptoms: string[]
    attachments: Attachment[]
    paymentMethod: string
    currentStep: 1 | 2 | 3 | 4
    isSubmitting: boolean

    setDoctor: (doctor: DoctorProfile) => void
    setSlot: (slot: DoctorSchedule) => void
    setFormData: (data: { reason: string; symptoms: string[]; attachments: Attachment[] }) => void
    setPaymentMethod: (method: string) => void
    nextStep: () => void
    prevStep: () => void
    reset: () => void
}

const INITIAL_STATE = {
    selectedDoctor: null,
    selectedSlot: null,
    reason: '',
    symptoms: [],
    attachments: [],
    paymentMethod: 'CASH',
    currentStep: 1 as const,
    isSubmitting: false,
}

export const useBookingStore = create<BookingState>()((set, get) => ({
    ...INITIAL_STATE,

    setDoctor: (doctor) => set({ selectedDoctor: doctor }),
    setSlot: (slot) => set({ selectedSlot: slot }),
    setFormData: (data) => set(data),
    setPaymentMethod: (method) => set({ paymentMethod: method }),

    nextStep: () => set((state) => ({
        currentStep: Math.min(state.currentStep + 1, 4) as 1 | 2 | 3 | 4
    })),
    prevStep: () => set((state) => ({
        currentStep: Math.max(state.currentStep - 1, 1) as 1 | 2 | 3 | 4
    })),

    // Gọi hàm này khi người dùng hủy luồng hoặc hoàn tất đặt lịch
    reset: () => set(INITIAL_STATE),
}))