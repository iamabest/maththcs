# 02 — SYSTEM ARCHITECTURE

## Kiến trúc
```text
Browser
  |
React + TypeScript + Vite
  |
  +-- Simulation Engine
  |     +-- Three.js
  |     +-- React Three Fiber
  |     +-- Drei
  |
  +-- Learning Engine
  |     +-- Lesson
  |     +-- Activity
  |     +-- Quiz
  |
  +-- Analytics
  |
Supabase
  +-- PostgreSQL
  +-- Auth
  +-- Storage
  +-- Edge Functions khi cần
```

## Frontend modules
AppShell, Authentication, Dashboard, Curriculum, Lesson, Simulation, Quiz, Assignment, Progress, TeacherDashboard, StudentDashboard, ResearchExport.

## Simulation architecture
Mỗi mô phỏng độc lập:
```text
simulation/<simulation-id>/
  index.tsx
  config.ts
  model.ts
  controls.ts
  questions.ts
  metadata.ts
```

Không tạo một component khổng lồ chứa tất cả mô phỏng.

## Data flow
Đăng nhập → chọn lớp/chủ đề → mở bài → tải mô phỏng → tương tác → ghi event tối thiểu → làm bài → lưu kết quả → dashboard.

## Hiệu năng
Lazy loading, code splitting, GLTF/GLB, Draco, giới hạn object, không render không cần thiết, không gửi analytics theo từng frame.

## Accessibility
Keyboard navigation, contrast tốt, không phụ thuộc màu sắc, text thay thế, responsive.

## Bảo mật
RLS; không đưa service-role key vào frontend; validation; không lưu mật khẩu riêng; chỉ lưu PII tối thiểu.

## Nghiệm thu
`npm run build` thành công; không có lỗi runtime nghiêm trọng; simulation chạy desktop/mobile; RLS được kiểm tra.
