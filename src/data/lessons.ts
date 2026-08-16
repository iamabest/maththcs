import type { Lesson } from '../types';
import { newLessons } from './newLessons';

export const lessons: Lesson[] = [
  ...newLessons,
  {
    id: 'lesson-number-line',
    grade: 6,
    topic: 'Số nguyên',
    title: 'Số nguyên trên trục số',
    description:
      'Khám phá vị trí các số nguyên trên trục số, so sánh và sắp xếp số nguyên thông qua mô phỏng tương tác 3D.',
    objectives: [
      'Nhận biết vị trí các số nguyên trên trục số',
      'So sánh hai số nguyên bất kỳ',
      'Sắp xếp một dãy số nguyên theo thứ tự',
      'Tìm số đối và giá trị tuyệt đối',
    ],
    prerequisites: ['Số tự nhiên', 'Trục số tự nhiên'],
    estimatedTime: 45,
    simulationSlug: 'number-line-3d',
    competencies: ['MAT_REASONING', 'MAT_TOOLS'],
    activities: [
      {
        id: 'nl-intro',
        type: 'intro',
        title: 'Khởi động',
        content:
          'Nhiệt độ ở Sa Pa vào mùa đông có thể xuống dưới 0°C. Làm thế nào biểu diễn các nhiệt độ âm trên trục số? Hãy cùng khám phá!',
      },
      {
        id: 'nl-explore',
        type: 'explore',
        title: 'Khám phá trục số 3D',
        content:
          'Sử dụng mô phỏng bên dưới để:\n1. Kéo các số nguyên lên trục số\n2. Quan sát vị trí của số dương và số âm\n3. Dự đoán: Số -3 nằm bên nào của 0?\n4. Kiểm chứng dự đoán bằng cách kéo số -3 lên trục',
        simulationSlug: 'number-line-3d',
      },
      {
        id: 'nl-practice',
        type: 'practice',
        title: 'Luyện tập',
        content:
          'So sánh các cặp số sau bằng cách quan sát vị trí trên trục số:\n• -5 và 2\n• -3 và -7\n• 0 và -1\nQuy luật: Trên trục số, số bên phải luôn lớn hơn số bên trái.',
      },
      {
        id: 'nl-apply',
        type: 'apply',
        title: 'Vận dụng',
        content:
          'Một thang máy ở tầng 3. Nó đi xuống 5 tầng. Hãy dùng trục số để xác định thang máy ở tầng mấy. Biểu diễn phép tính tương ứng trên trục số.',
      },
    ],
  },
  {
    id: 'lesson-rectangular-prism',
    grade: 8,
    topic: 'Hình học không gian',
    title: 'Hình hộp chữ nhật',
    description:
      'Khám phá cấu tạo, diện tích bề mặt và thể tích của hình hộp chữ nhật thông qua mô phỏng 3D tương tác.',
    objectives: [
      'Nhận biết các yếu tố cấu tạo: đỉnh, cạnh, mặt',
      'Tính diện tích xung quanh và diện tích toàn phần',
      'Tính thể tích hình hộp chữ nhật',
      'Hiểu ảnh hưởng khi thay đổi kích thước',
    ],
    prerequisites: ['Hình chữ nhật', 'Diện tích hình chữ nhật'],
    estimatedTime: 45,
    simulationSlug: 'rectangular-prism',
    competencies: ['MAT_REASONING', 'MAT_MODELING', 'MAT_TOOLS'],
    activities: [
      {
        id: 'rp-intro',
        type: 'intro',
        title: 'Khởi động',
        content:
          'Hãy quan sát xung quanh em: hộp sữa, viên gạch, tủ sách: chúng đều có dạng hình hộp chữ nhật. Nếu cần bọc quà một hộp sữa, em cần bao nhiêu giấy?',
      },
      {
        id: 'rp-explore',
        type: 'explore',
        title: 'Khám phá 3D',
        content:
          'Sử dụng mô phỏng bên dưới:\n1. Xoay hình hộp để quan sát 6 mặt\n2. Thay đổi chiều dài a, chiều rộng b, chiều cao c\n3. Quan sát công thức thay đổi theo\n4. Dự đoán: Nếu tăng gấp đôi chiều cao c, thể tích tăng bao nhiêu lần?\n5. Kiểm chứng bằng cách điều chỉnh slider',
        simulationSlug: 'rectangular-prism',
      },
      {
        id: 'rp-practice',
        type: 'practice',
        title: 'Luyện tập',
        content:
          'Dùng mô phỏng để tìm kích thước hình hộp chữ nhật có:\n• Thể tích bằng 60 cm³\n• Chiều dài gấp đôi chiều rộng\nGhi lại các bộ kích thước tìm được.',
      },
      {
        id: 'rp-apply',
        type: 'apply',
        title: 'Vận dụng',
        content:
          'Một bể cá hình hộp chữ nhật có chiều dài 60 cm, rộng 30 cm, cao 40 cm. Tính lượng nước (lít) cần đổ đầy 3/4 bể.',
      },
    ],
  },
  {
    id: 'lesson-inscribed-angle',
    grade: 9,
    topic: 'Đường tròn',
    title: 'Góc nội tiếp đường tròn',
    description:
      'Khám phá định lý góc nội tiếp: quan hệ giữa góc nội tiếp và cung bị chắn thông qua thao tác trực tiếp trên đường tròn 3D.',
    objectives: [
      'Nhận biết góc nội tiếp và cung bị chắn',
      'Phát biểu định lý: góc nội tiếp bằng nửa cung bị chắn',
      'So sánh góc nội tiếp và góc ở tâm cùng chắn một cung',
      'Áp dụng định lý để tính góc',
    ],
    prerequisites: ['Đường tròn', 'Góc ở tâm', 'Cung tròn'],
    estimatedTime: 45,
    simulationSlug: 'inscribed-angle',
    competencies: ['MAT_REASONING', 'MAT_PROBLEM_SOLVING', 'MAT_TOOLS'],
    activities: [
      {
        id: 'ia-intro',
        type: 'intro',
        title: 'Khởi động',
        content:
          'Khi ba điểm nằm trên đường tròn tạo thành một góc, góc đó có tính chất gì đặc biệt? Liệu góc này có thay đổi khi ta di chuyển đỉnh góc dọc theo đường tròn?',
      },
      {
        id: 'ia-explore',
        type: 'explore',
        title: 'Khám phá',
        content:
          'Sử dụng mô phỏng:\n1. Di chuyển điểm M (đỉnh góc nội tiếp) trên cung lớn\n2. Ghi số đo góc nội tiếp tại 3 vị trí khác nhau\n3. Dự đoán: Góc nội tiếp có thay đổi không khi di chuyển đỉnh?\n4. Quan sát số đo cung AB (cung bị chắn)\n5. Tìm quan hệ giữa góc nội tiếp và cung bị chắn\n6. So sánh góc nội tiếp và góc ở tâm',
        simulationSlug: 'inscribed-angle',
      },
      {
        id: 'ia-practice',
        type: 'practice',
        title: 'Luyện tập',
        content:
          'Sử dụng mô phỏng để trả lời:\n• Cho cung AB = 120°, tính góc nội tiếp?\n• Hai góc nội tiếp cùng chắn một cung có bằng nhau không? Kiểm chứng.\n• Góc nội tiếp chắn nửa đường tròn bằng bao nhiêu?',
      },
      {
        id: 'ia-apply',
        type: 'apply',
        title: 'Vận dụng',
        content:
          'Cho đường tròn (O) với đường kính AB. Điểm C nằm trên đường tròn (C ≠ A, B). Chứng minh rằng góc ACB = 90° bằng cách sử dụng định lý góc nội tiếp.',
      },
    ],
  },
];
