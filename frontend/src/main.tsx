import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast' // Thư viện hiển thị thông báo góc màn hình
import App from './App'
import './index.css'

// Cấu hình mặc định cho React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // Dữ liệu được coi là "tươi" trong 5 phút (không gọi lại API)
      gcTime: 10 * 60 * 1000,  // Giữ rác (cache) trong 10 phút trước khi xóa
      retry: 1,               // Nếu lỗi mạng, thử gọi lại 1 lần
      refetchOnWindowFocus: false,         // Tắt tính năng tự gọi lại API khi bấm qua tab khác rồi quay lại
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        {/* Nơi cấu hình hiển thị các thông báo thành công/thất bại */}
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)