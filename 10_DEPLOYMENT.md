# 10 — FREE DEPLOYMENT

## Mục tiêu
Triển khai 0 đồng cho mục đích cá nhân/nghiên cứu trong giới hạn free tier hiện hành.

## GitHub
Tạo repository, commit source, không commit `.env`, dùng `.env.example`.

## Supabase
Tạo project miễn phí nếu gói hiện tại cho phép; thiết lập PostgreSQL, Auth, Storage, RLS.

Không đưa service-role key vào frontend.

## Vercel
Import repository → `npm run build` → output `dist` → khai báo environment variables.

## Environment
```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Kiểm tra
Login; lesson; simulation; quiz; save result; dashboard; mobile; refresh route; RLS.

## Domain
Dùng domain miễn phí do nền tảng cung cấp, không cần mua domain.

## Lưu ý
Free tier có thể thay đổi. Khi cần xác nhận quota/giới hạn hiện hành, AI phải kiểm tra tài liệu chính thức.

## Backup
Database export định kỳ; source Git; học liệu versioned; dataset nghiên cứu lưu riêng.

Không đưa dữ liệu thật vào trước khi kiểm tra quyền truy cập và RLS.
