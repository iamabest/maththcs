# Math3D — Hệ thống Mô phỏng 3D Toán học THCS

> Đề tài: **Nghiên cứu xây dựng hệ thống học liệu số tích hợp mô phỏng tương tác 3D trong dạy học Toán THCS theo định hướng phát triển năng lực và chuyển đổi số.**

## 🌟 Tính năng MVP

1. **3 Mô phỏng 3D tương tác**:
   - **Lớp 6**: Số nguyên trên trục số 3D (vị trí, so sánh, số đối, khoảng cách).
   - **Lớp 8**: Hình hộp chữ nhật 3D (kích thước, diện tích xung quanh, toàn phần, thể tích, nhãn đỉnh & cạnh).
   - **Lớp 9**: Góc nội tiếp đường tròn (quan hệ góc nội tiếp và cung bị chắn, góc ở tâm, góc chắn nửa đường tròn).
2. **3 Bài học chuẩn sư phạm**:
   - Tiến trình hoạt động: Khởi động → Mô phỏng → Khám phá → Luyện tập → Vận dụng.
3. **Bộ câu hỏi trắc nghiệm & điền số**:
   - Chấm điểm tự động, giải thích chi tiết, gán nhãn độ khó & năng lực toán học.
4. **Lưu trữ tiến độ**:
   - Offline-first bằng `localStorage` (kiến trúc sẵn sàng tích hợp Supabase).
5. **Dashboard học sinh**:
   - Tỉ lệ hoàn thành, biểu đồ cột điểm số theo bài, phân tích năng lực theo chuẩn chương trình GDPT.

## 🚀 Cài đặt và chạy trên máy cục bộ

### 1. Yêu cầu
- Node.js >= 18.0.0
- npm >= 9.0.0

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Chạy môi trường phát triển (Dev Server)
```bash
npm run dev
```
Mở trình duyệt tại đường dẫn: `http://localhost:5173`

### 4. Kiểm tra TypeScript & Build Production
```bash
npm run build
```

## 🛠 Công nghệ sử dụng
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS v4
- **3D Graphics**: Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`)
- **Toán học & Định tuyến**: MathJS, React Router v7
- **Lưu trữ**: LocalStorage Adapter (sẵn sàng kết nối Supabase PostgreSQL)
