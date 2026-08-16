---
name: math-assessment-rubric
description: Quy chuẩn Biên soạn Câu hỏi Khảo thí & Đánh giá Năng lực Toán THCS. Hướng dẫn thiết kế ma trận 4 mức độ nhận thức (Biết, Hiểu, Vận dụng, Vận dụng cao), các dạng câu hỏi trắc nghiệm (Nhiều lựa chọn, Đúng/Sai, Điền số) và kỹ thuật phân tích câu nhiễu (distractor analysis).
---

# Math Assessment Rubric: Khảo Thí & Đánh Giá Năng Lực Toán THCS

> Kỹ năng chuyên biệt dành cho Agent biên soạn câu hỏi kiểm tra, tạo đề thi phân hóa và thiết lập rubric đánh giá năng lực toán học chuẩn GDPT 2018.

---

## 1. Khung 4 Mức Độ Nhận Thức (Cognitive Levels)

Mọi bộ đề kiểm tra (Pre-test, Post-test, Quizzes) phải phân bổ tỷ lệ câu hỏi cân đối:

| Mức Độ | Tỷ Lệ Đề Xuất | Mục Tiêu Khảo Thí | Hành Động Tiêu Biểu |
| :--- | :--- | :--- | :--- |
| **1. Nhận biết (Remember)** | 30% | Nhớ lại định nghĩa, công thức, nhận diện hình dạng cơ bản hoặc đọc số liệu trực tiếp. | "Xác định góc so le trong với $\angle A_1$", "Công thức thể tích hình hộp chữ nhật". |
| **2. Thông hiểu (Understand)** | 35% | Giải thích ý nghĩa hình học, chuyển đổi giữa biểu diễn đại số và hình ảnh 3D. | "Nếu hệ số $a > 0$ thì đồ thị hàm số có hướng như thế nào?", "So sánh góc nội tiếp và góc ở tâm". |
| **3. Vận dụng (Apply)** | 25% | Áp dụng công thức vào bài toán tính toán cụ thể từ 1 đến 2 bước. | "Tính thể tích lăng trụ tam giác khi biết cạnh đáy 5cm, chiều cao đáy 4cm, chiều cao lăng trụ 10cm". |
| **4. Vận dụng cao (Analyze)** | 10% | Phân tích bài toán tổng hợp, mô hình hóa tình huống thực tế hoặc tối ưu hóa kích thước. | "Tìm kích thước bể cá để diện tích kính sử dụng ít nhất với thể tích cho trước". |

---

## 2. Quy Chuẩn Biên Soạn 3 Dạng Câu Hỏi Khảo Thí

### 1. Trắc nghiệm nhiều lựa chọn (`multiple_choice`)
- **Phải có 4 phương án ($A, B, C, D$)**.
- **Kỹ thuật thiết kế phương án nhiễu (Distractors)**: Các phương án sai phải xuất phát từ **lỗi tư duy điển hình** của học sinh (như quên nhân 1/2 khi tính diện tích tam giác, nhầm số đối $|-a| = -a$, nhầm góc ở tâm gấp đôi thay vì bằng nửa). Tuyệt đối không đưa ra các số vô nghĩa, ngẫu nhiên.
- **Lời giải thích chi tiết**: Nêu rõ vì sao đáp án đúng là đúng và phân tích lý do các phương án còn lại bị sai.

### 2. Trắc nghiệm Đúng / Sai (`true_false`)
- Mỗi nhận định phải rõ ràng, mang tính khẳng định duy nhất, không chứa từ mơ hồ hoặc nước đôi.
- Phù hợp nhất để kiểm tra các tính chất định lý và quan niệm sai lầm phổ biến.

### 3. Trắc nghiệm điền số (`fill_number`)
- Yêu cầu học sinh nhập trực tiếp giá trị số (số nguyên hoặc số thập phân).
- Phải ghi rõ đơn vị đo trong câu hỏi để tránh hiểu lầm (ví dụ: *"Nhập kết quả theo đơn vị $\text{cm}^3$, làm tròn đến chữ số thập phân thứ nhất"*).

---

## 3. Cấu Trúc Dữ Liệu Câu Hỏi Chuẩn (TypeScript Interface)

```typescript
export interface AssessmentQuestion {
  id: string;
  topic: string;
  competency: Competency; // MAT_REASONING | MAT_MODELING | MAT_PROBLEM_SOLVING ...
  difficulty: 'easy' | 'medium' | 'hard';
  cognitiveLevel: 'remember' | 'understand' | 'apply' | 'analyze';
  type: 'multiple_choice' | 'true_false' | 'fill_number';
  content: string;
  options?: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}
```
