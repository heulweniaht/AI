import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User, UserRole } from '@/types/auth.types'

interface AuthState {
  accessToken: string | null
  user: User | null
  isLoggedIn: boolean

  // Các hành động (Actions)
  setAuth: (token: string, user: User) => void
  setAccessToken: (token: string) => void
  updateUser: (user: Partial<User>) => void
  logout: () => void
  hasRole: (role: UserRole | UserRole[]) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      isLoggedIn: false,

      // Gọi sau khi login thành công
      setAuth: (token, user) => set({
        accessToken: token,
        user,
        isLoggedIn: true,
      }),

      // Gọi sau khi làm mới (refresh) token
      setAccessToken: (token) => set({ accessToken: token }),

      // Cập nhật một phần thông tin User
      updateUser: (updatedUser) => set((state) => ({
        user: state.user ? { ...state.user, ...updatedUser } : null,
      })),

      // Đăng xuất: Reset tất cả về null
      logout: () => set({
        accessToken: null,
        user: null,
        isLoggedIn: false,
      }),

      // Tiện ích kiểm tra quyền hạn (Role)
      hasRole: (role) => {
        const { user } = get()
        if (!user) return false
        if (Array.isArray(role)) return role.includes(user.role)
        return user.role === role
      },
    }),
    {
      name: 'auth-storage', // Tên key lưu trong trình duyệt
      storage: createJSONStorage(() => sessionStorage), // Dùng Session Storage
      // Tuyệt đối KHÔNG lưu accessToken xuống ổ cứng, chỉ lưu thông tin User để render giao diện
      partialize: (state) => ({ user: state.user, isLoggedIn: state.isLoggedIn }),
    }
  )
)