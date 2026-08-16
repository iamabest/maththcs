---
name: simulation-pedagogy-design
description: Quy chuẩn Sư phạm và Kỹ thuật Thiết kế Mô phỏng Toán học 3D Tương tác. Hướng dẫn thiết lập biến số, ràng buộc toán học, chu trình nhận thức 6 bước và thiết kế bẫy nhận thức trong không gian Three.js / React Three Fiber.
---

# Simulation Pedagogy Design: Thiết Kế Mô Phỏng Toán Học 3D

> Kỹ năng cốt lõi dành cho Agent phát triển mô hình 3D tương tác toán học trên nền tảng Three.js và React Three Fiber. Đảm bảo mô phỏng không chỉ là hình ảnh 3D minh họa đơn thuần mà là **công cụ tạo sinh nhận thức** (Cognitive Generative Tool).

---

## 1. Chu Trình Nhận Thức 6 Bước (6-Step Pedagogical Cycle)

Mọi mô phỏng toán học phải được thiết kế xoay quanh chu trình 6 bước bắt buộc:

```
[1. DỰ ĐOÁN] ──> [2. THAO TÁC] ──> [3. QUAN SÁT] ──> [4. GIẢI THÍCH] ──> [5. KIỂM CHỨNG] ──> [6. VẬN DỤNG]
```

1. **Dự đoán (Predict)**: Đặt câu hỏi trước khi chạm vào slider (ví dụ: *"Nếu tăng chiều cao gấp đôi, thể tích hình hộp tăng bao nhiêu lần?"*).
2. **Thao tác (Manipulate)**: Học sinh kéo thanh trượt tham số hoặc xoay camera 3D trong Viewport.
3. **Quan sát (Observe)**: Khung 3D biến đổi hình học đồng thời bảng Telemetry (`.sim-info`) cập nhật số đo tức thời.
4. **Giải thích (Explain)**: Học sinh đối chiếu kết quả quan sát với dự đoán ban đầu để phát hiện mâu thuẫn nhận thức.
5. **Kiểm chứng (Verify)**: Kiểm tra lại với trường hợp giới hạn hoặc trường hợp đặc biệt (ví dụ: góc $180^\circ$, hệ số $a = 0$).
6. **Vận dụng (Apply)**: Giải quyết câu hỏi toán học cụ thể bằng việc tái hiện bài toán trên mô hình 3D.

---

## 2. Checklist Đặc Tả Kỹ Thuật & Sư Phạm Trước Khi Viết Code

Trước khi viết bất kỳ file mô phỏng nào trong `src/features/simulations/`, Agent bắt buộc phải xác định 6 thông số sau:

| Thông số | Yêu cầu bắt buộc | Ví dụ mẫu (Góc nội tiếp) |
| :--- | :--- | :--- |
| **1. Mục tiêu toán học** | Khái niệm hoặc định lý cần truyền tải rõ ràng. | Quan hệ: $\angle AMB = \frac{1}{2}\angle AOB$. |
| **2. Danh sách biến số** | Khoảng giá trị `min`, `max`, `step`, giá trị mặc định `default`. | `centralAngleDeg` (30..260, step 10), `mPos` (0..1). |
| **3. Ràng buộc toán học** | Công thức liên hệ hình học chính xác tuyệt đối. | $r = 4$, $M \in \overparen{AB}_{\text{lớn}}$, $\angle AMB = \text{angle}/2$. |
| **4. Các điểm tương tác** | Slider điều khiển, nút đặt trường hợp đặc biệt, toggle hiện/ẩn. | Nút "Nửa đường tròn (180°)", Toggle hiện góc ở tâm. |
| **5. Bẫy quan niệm sai lầm** | Tình huống học sinh hay ngộ nhận để mô phỏng làm rõ. | Ngộ nhận: đỉnh M di chuyển thì góc AMB đổi. |
| **6. Thiết kế Telemetry** | Bảng số liệu đo lường thời gian thực hiển thị dưới canvas. | Hiển thị đồng thời: Cung AB, Góc AOB, Góc AMB. |

---

## 3. Quy Chuẩn Kỹ Thuật Render Three.js / React Three Fiber

1. **Trọng tâm thị giác (Visual Focal Point)**:
   - Màu sắc hình học: Sử dụng Mathematical Cobalt (`#3b82f6`), Emerald (`#10b981`), Amber (`#f59e0b`), Rose (`#f43f5e`).
   - Đường cạnh & Lưới: Sử dụng `Line` từ `@react-three/drei` với `lineWidth` rõ ràng, phối hợp `gridHelper` đặt ở đáy không gian.
2. **Không dùng emoji trang trí trong code**:
   - Tất cả nhãn nút, tiêu đề insight phải dùng ngôn ngữ khoa học thuần túy (`QUAN SÁT & RÚT RA QUY LUẬT`, `CÔNG THỨC ÁP DỤNG`).
3. **Hiệu năng & Trải nghiệm di động**:
   - Camera: Thiết lập `fov` phù hợp (45–50), có góc nghiêng isometric nhẹ để thấy chiều sâu 3D.
   - Luôn hỗ trợ Touch Control (kéo slider mượt mà trên màn hình cảm ứng).
   - Nút Reset: Luôn cung cấp nút quay về trạng thái chuẩn ban đầu.
