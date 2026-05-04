import { create } from 'zustand'

interface NotificationItem {
    id: number
    type: string
    title: string
    message: string
    isRead: boolean
    createdAt: string
}

interface NotificationState {
    notifications: NotificationItem[]
    unreadCount: number

    setNotifications: (items: NotificationItem[]) => void
    addNotification: (item: NotificationItem) => void
    markAsRead: (id: number) => void
    markAllAsRead: () => void
}

export const useNotificationStore = create<NotificationState>()((set) => ({
    notifications: [],
    unreadCount: 0,

    // Set lại toàn bộ danh sách (khi fetch API lần đầu)
    setNotifications: (items) => set({
        notifications: items,
        unreadCount: items.filter(n => !n.isRead).length,
    }),

    // Thêm một thông báo mới (ví dụ khi nhận qua WebSocket/SSE)
    addNotification: (item) => set((state) => ({
        notifications: [item, ...state.notifications],
        unreadCount: state.unreadCount + (item.isRead ? 0 : 1),
    })),

    // Đánh dấu 1 thông báo đã đọc
    markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n =>
            n.id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
    })),

    // Đánh dấu tất cả đã đọc
    markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, isRead: true })),
        unreadCount: 0,
    })),
}))