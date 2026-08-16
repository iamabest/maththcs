---
name: misconception-diagnostics
description: Kỹ thuật Chẩn đoán và Can thiệp Sư phạm đối với Quan niệm Sai lầm (Misconceptions) phổ biến trong môn Toán THCS. Danh mục các lỗi nhận thức điển hình Lớp 6 đến Lớp 9 và phác đồ điều chỉnh bằng mô phỏng tương tác 3D.
---

# Misconception Diagnostics: Chẩn Đoán & Chữa Lỗi Nhận Thức Toán THCS

> Kỹ năng chuyên biệt dành cho Agent phân tích hành vi học tập của học sinh, nhận diện nguyên nhân gốc rễ của câu trả lời sai và cung cấp phác đồ can thiệp bằng mô phỏng 3D.

---

## 1. Danh Mục Quan Niệm Sai Lầm Điển Hình (THCS)

### 1. Phân môn Số & Đại số
| Mã Lỗi | Quan Niệm Sai Lầm | Nguyên Nhân Gốc Rễ | Phác Đồ Can Thiệp 3D |
| :--- | :--- | :--- | :--- |
| `ERR_NEG_NUM` | *"Số âm có giá trị tuyệt đối lớn hơn thì lớn hơn"* (Ví dụ: nghĩ rằng $-5 > -2$). | Học sinh áp dụng quy tắc so sánh số tự nhiên ($5 > 2$) sang số nguyên âm. | Mở mô phỏng trục số 3D (`NumberLine3D`): Kéo hai điểm $-5$ và $-2$, quan sát điểm nào nằm bên phải điểm nào. |
| `ERR_SLOPE_SIGN` | *"Hệ số $a < 0$ thì đồ thị nằm hoàn toàn ở nửa dưới trục hoành"*. | Nhầm lẫn giữa dấu của hệ số góc $a$ và giá trị tung độ $y$. | Mở mô phỏng hàm số bậc nhất (`LinearFunction`): Đặt $a = -1, b = 4$, quan sát đồ thị vẫn đi qua vùng $y > 0$. |
| `ERR_INTERCEPT` | *"Tung độ gốc $b$ là điểm cắt với trục hoành $Ox$"*. | Nhầm lẫn giữa trục tung $Oy$ và trục hoành $Ox$. | Mô phỏng đánh dấu điểm màu đỏ $(0, b)$ trên trục $Oy$ và điểm màu xanh $(-b/a, 0)$ trên trục $Ox$. |

---

### 2. Phân môn Hình học & Đo lường
| Mã Lỗi | Quan Niệm Sai Lầm | Nguyên Nhân Gốc Rễ | Phác Đồ Can Thiệp 3D |
| :--- | :--- | :--- | :--- |
| `ERR_INSCRIBED_VERTEX` | *"Khi đỉnh $M$ di chuyển trên cung thì góc nội tiếp $\angle AMB$ thay đổi"*. | Nhận thức trực quan ngây thơ (thấy dây $MA, MB$ dài ngắn thay đổi nên nghĩ góc đổi). | Mở mô phỏng `InscribedAngle`: Kéo điểm $M$ chạy dọc cung tròn, telemetry chỉ rõ $\angle AMB$ luôn cố định bằng $\frac{1}{2}\angle AOB$. |
| `ERR_PRISM_AREA` | *"Diện tích toàn phần hình hộp chữ nhật chỉ gồm 4 mặt xung quanh"*. | Nhầm lẫn giữa diện tích xung quanh ($S_{xq}$) và diện tích toàn phần ($S_{tp}$). | Mở mô phỏng `RectangularPrism`: Bật chế độ đếm 6 mặt (2 mặt đáy + 4 mặt bên) với màu sắc phân biệt. |
| `ERR_PARALLEL_ANGLES` | *"Hai góc ở vị trí so le trong thì luôn bằng nhau (ngay cả khi 2 đường thẳng không song song)"*. | Học sinh ghi nhớ máy móc tính chất mà bỏ qua điều kiện tiên quyết $d_1 \parallel d_2$. | Mô phỏng `ParallelLines`: Minh họa điều kiện tiên quyết khi 2 đường thẳng song song và tác dụng của cát tuyến. |

---

## 2. Quy Trình Chẩn Đoán & Phản Hồi Khi Học Sinh Làm Sai

Khi học sinh chọn phương án sai trong Quiz hoặc nhập số liệu sai:

```
[BƯỚC 1: NHẬN DIỆN MÃ LỖI]
         ↓
[BƯỚC 2: PHÂN TÍCH NGUYÊN NHÂN TƯ DUY (Không phê bình)]
         ↓
[BƯỚC 3: ĐƯA RA CÂU HỎI PHẢN CHỨNG / TÌNH HUỐNG XUNG ĐỘT NHẬN THỨC]
         ↓
[BƯỚC 4: HƯỚNG DẪN MỞ LẠI MÔ PHỎNG 3D ĐỂ TỰ KIỂM TRA]
```

### Mẫu câu phản hồi can thiệp:
> *"Có vẻ như em đang nhầm lẫn giữa [Khái niệm A] và [Khái niệm B]. Em hãy mở lại mô phỏng [Tên mô phỏng] và thử điều chỉnh [Tham số X] để quan sát xem điều gì thực sự xảy ra nhé!"*
