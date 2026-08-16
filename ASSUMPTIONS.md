# ASSUMPTIONS.md

Tài liệu ghi nhận các giả định được sử dụng trong quá trình phát triển khi thông tin chưa đầy đủ.

## Kiến trúc & Công nghệ

| # | Giả định | Lý do |
|---|---|---|
| A1 | MVP sử dụng `localStorage` thay vì Supabase | Để demo nhanh mà không cần setup backend. Interface `StorageAdapter` sẵn sàng swap sang Supabase. |
| A2 | Tailwind CSS v4 (latest) | Người dùng yêu cầu bản mới nhất. |
| A3 | Không dùng GLTF/GLB cho 3 mô phỏng MVP | Hình học đơn giản (trục số, hình hộp, đường tròn) dùng Three.js geometry primitives là đủ. |
| A4 | Static data trong `src/data/` thay vì CMS/DB | MVP chỉ có 3 bài học, không cần hệ thống quản lý nội dung. |
| A5 | Chưa có authentication trong MVP | Sẽ tích hợp Supabase Auth ở phase sau. |

## Nội dung giáo dục

| # | Giả định | Lý do |
|---|---|---|
| B1 | Cấu trúc bài học theo 5 bước: Khởi động → Mô phỏng → Khám phá → Luyện tập → Vận dụng | Phù hợp với quy trình dạy học theo phương pháp khám phá có hướng dẫn (Guided Discovery). |
| B2 | Mỗi quiz gồm 6 câu hỏi trộn 3 mức độ khó và nhiều loại (MC, T/F, fill-number) | Đủ để đánh giá cơ bản mà không quá dài cho học sinh THCS. |
| B3 | Tolerance cho câu điền số = 0 (trừ khi bài toán có kết quả thập phân) | Toán THCS thường yêu cầu đáp án chính xác. |
| B4 | Năng lực toán học theo 6 mã: MAT_REASONING, MAT_PROBLEM_SOLVING, MAT_MODELING, MAT_COMMUNICATION, MAT_TOOLS, DIGITAL_COMPETENCE | Dựa trên Chương trình GDPT 2018 môn Toán. |

## Mô phỏng 3D

| # | Giả định | Lý do |
|---|---|---|
| C1 | Trục số hiển thị phạm vi -10 đến 10 | Đủ cho nội dung số nguyên lớp 6, không quá phức tạp về mặt trực quan. |
| C2 | Hình hộp chữ nhật có kích thước tối đa 8 cm mỗi cạnh | Giữ hình nằm gọn trong viewport Camera. |
| C3 | Góc nội tiếp nằm trong mặt phẳng XY (z=0) trong cảnh 3D | Đường tròn là khái niệm 2D, dùng 3D scene cho phép xoay/nghiêng quan sát. |
| C4 | Margin 15° khi di chuyển điểm M gần A hoặc B | Tránh góc suy biến khi M trùng hoặc gần trùng A, B. |

## Nghiên cứu

| # | Giả định | Lý do |
|---|---|---|
| D1 | Chưa có dữ liệu thực nghiệm, tất cả số liệu trong hệ thống là dữ liệu demo | Tuân thủ nguyên tắc không bịa dữ liệu nghiên cứu (00_MASTER_PROMPT, 11_AI_EXECUTION_RULES). |
| D2 | Thang đo khảo sát chưa được kiểm định độ tin cậy | Cần pilot test và phân tích Cronbach's alpha trước khi sử dụng chính thức. |

---

*Cập nhật lần cuối: MVP v0.1.0*
