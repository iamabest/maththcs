# 11 — AI EXECUTION RULES

## Code
- Đọc cấu trúc hiện tại trước.
- Không ghi đè nếu không cần.
- Giữ API ổn định.
- Không xóa tính năng đang hoạt động.
- Tách component.
- Dùng TypeScript.
- Không commit secret.

## Simulation
Trước khi code phải xác định:
1. mục tiêu toán học;
2. biến;
3. công thức;
4. tương tác;
5. expected behavior;
6. misconception.

Sau code phải test trường hợp biên, hình học, reset và mobile.

## Học liệu
Mỗi hoạt động phải có dự đoán → thao tác → quan sát → giải thích → kiểm chứng → vận dụng.

## Nghiên cứu
Không bịa tài liệu tham khảo, số liệu, p-value hay kết quả khảo sát. Phân biệt kết quả kỳ vọng với kết quả thực tế.

## Khi lỗi
Trình bày nguyên nhân, file, vùng code, cách sửa và test sau sửa.

## Quy trình
Không tạo 100 mô phỏng cùng lúc.

MVP:
1. nền tảng;
2. 3 mô phỏng;
3. 3 bài học;
4. quiz;
5. analytics;
6. pilot;
7. mở rộng.

## Lệnh
`TIẾP TỤC PHASE X`: đọc phase tương ứng và triển khai đúng phạm vi.
`KIỂM TRA`: audit theo checklist.
`FIX`: sửa lỗi, giữ nguyên kiến trúc nếu không cần đổi.
