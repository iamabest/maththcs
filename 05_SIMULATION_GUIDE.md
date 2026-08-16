# 05 — 3D SIMULATION DEVELOPMENT GUIDE

## Nguyên tắc
Mỗi mô phỏng phải phục vụ một mục tiêu toán học cụ thể. 3D không dùng chỉ để trang trí.

## Cấu trúc
```text
Simulation
├── Learning objective
├── Mathematical model
├── 3D scene
├── Parameters
├── Interaction
├── Observation
├── Guided questions
└── Assessment
```

## Quy trình
1. Chọn kiến thức.
2. Xác định misconception.
3. Xác định biến.
4. Xây dựng mô hình toán.
5. Chuyển sang 3D.
6. Thêm tương tác.
7. Viết câu hỏi.
8. Kiểm thử toán học.
9. Kiểm thử UX.
10. Đưa vào bài học.

## Metadata mẫu
```json
{
  "slug": "angle-inscribed-circle",
  "grade": 9,
  "topic": "Đường tròn",
  "title": "Góc nội tiếp",
  "objectives": ["Nhận biết quan hệ giữa góc nội tiếp và cung bị chắn"],
  "variables": [{"name": "arc", "min": 20, "max": 340}],
  "competencies": ["Tư duy và lập luận toán học", "Sử dụng công cụ và phương tiện học toán"]
}
```

## Mô phỏng ưu tiên
### Lớp 6
Trục số nguyên; phân số; ước và bội; số nguyên tố.

### Lớp 7
Góc; đường thẳng song song; tam giác; quan hệ cạnh-góc.

### Lớp 8
Hình hộp chữ nhật; lăng trụ; diện tích/thể tích; Pythagore trực quan.

### Lớp 9
Đường tròn; góc nội tiếp; tiếp tuyến; hệ thức lượng; hàm số và đồ thị.

## Tiêu chuẩn
Đúng toán học; reset; tham số hợp lệ; nhãn/đơn vị; ổn định; có chế độ 2D dự phòng khi thiết bị yếu.

## Không được
Không tạo animation không có ý nghĩa học tập; không che dữ liệu; không thay đổi quy tắc toán học vì hiệu ứng.
