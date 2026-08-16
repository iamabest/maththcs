import type { Lesson } from '../types';

export const newLessons: Lesson[] = [
  {
    id: 'lesson-parallel-lines',
    grade: 7,
    topic: 'Hình học',
    title: 'Đường thẳng song song và góc',
    description: 'Khám phá các góc tạo bởi hai đường thẳng song song và một cát tuyến trong không gian 3D.',
    objectives: [
      'Nhận biết các cặp góc đồng vị, so le trong, so le ngoài, trong cùng phía',
      'Nắm được tính chất góc khi hai đường thẳng song song',
      'Tính toán số đo góc dựa vào các tính chất'
    ],
    prerequisites: ['Góc', 'Đường thẳng song song'],
    estimatedTime: 45,
    simulationSlug: 'parallel-lines',
    competencies: ['MAT_REASONING', 'MAT_TOOLS'],
    activities: [
      {
        id: 'pl-intro',
        type: 'intro',
        title: 'Khởi động',
        content: 'Hai đường ray xe lửa luôn song song. Nếu có một đường ray cắt ngang chúng, các góc tạo thành có mối liên hệ gì?',
      },
      {
        id: 'pl-explore',
        type: 'explore',
        title: 'Khám phá',
        content: 'Sử dụng mô phỏng để thay đổi góc của cát tuyến và quan sát sự thay đổi của các góc. Nhận xét về số đo các góc đồng vị, so le trong.',
        simulationSlug: 'parallel-lines',
      },
      {
        id: 'pl-practice',
        type: 'practice',
        title: 'Luyện tập',
        content: 'Cho góc đồng vị là 60°, tính các góc còn lại tại hai giao điểm.',
      },
      {
        id: 'pl-apply',
        type: 'apply',
        title: 'Vận dụng',
        content: 'Áp dụng tính chất đường thẳng song song để giải quyết các bài toán chứng minh hình học.',
      },
    ],
  },
  {
    id: 'lesson-triangular-prism',
    grade: 8,
    topic: 'Hình học không gian',
    title: 'Lăng trụ đứng tam giác',
    description: 'Tìm hiểu về hình lăng trụ đứng tam giác, diện tích xung quanh, toàn phần và thể tích thông qua mô phỏng 3D.',
    objectives: [
      'Nhận biết lăng trụ đứng tam giác',
      'Tính diện tích xung quanh và diện tích toàn phần',
      'Tính thể tích lăng trụ đứng tam giác'
    ],
    prerequisites: ['Diện tích tam giác', 'Hình chữ nhật'],
    estimatedTime: 45,
    simulationSlug: 'triangular-prism',
    competencies: ['MAT_MODELING', 'MAT_REASONING', 'MAT_TOOLS'],
    activities: [
      {
        id: 'tp-intro',
        type: 'intro',
        title: 'Khởi động',
        content: 'Hình dáng của một lều trại chữ A là một ví dụ về lăng trụ đứng tam giác. Làm sao để tính diện tích vải bạt cần thiết?',
      },
      {
        id: 'tp-explore',
        type: 'explore',
        title: 'Khám phá',
        content: 'Sử dụng mô phỏng để thay đổi cạnh đáy, chiều cao đáy và chiều cao lăng trụ. Quan sát sự thay đổi của diện tích và thể tích.',
        simulationSlug: 'triangular-prism',
      },
      {
        id: 'tp-practice',
        type: 'practice',
        title: 'Luyện tập',
        content: 'Tính diện tích xung quanh và thể tích của lăng trụ đứng tam giác có cạnh đáy 5cm, chiều cao đáy 4cm và chiều cao lăng trụ 10cm.',
      },
      {
        id: 'tp-apply',
        type: 'apply',
        title: 'Vận dụng',
        content: 'Vận dụng công thức để tính toán vật liệu làm các hộp đựng đồ có hình dạng lăng trụ đứng tam giác.',
      },
    ],
  },
  {
    id: 'lesson-linear-function',
    grade: 9,
    topic: 'Đại số',
    title: 'Hàm số bậc nhất y = ax + b',
    description: 'Nghiên cứu đồ thị hàm số bậc nhất y = ax + b trên hệ trục tọa độ.',
    objectives: [
      'Nhận biết đồ thị hàm số bậc nhất là một đường thẳng',
      'Hiểu ý nghĩa của hệ số góc a và tung độ gốc b',
      'Xác định sự đồng biến, nghịch biến của hàm số'
    ],
    prerequisites: ['Hàm số', 'Hệ trục tọa độ'],
    estimatedTime: 45,
    simulationSlug: 'linear-function',
    competencies: ['MAT_REASONING', 'MAT_PROBLEM_SOLVING', 'MAT_TOOLS'],
    activities: [
      {
        id: 'lf-intro',
        type: 'intro',
        title: 'Khởi động',
        content: 'Một chiếc taxi có giá mở cửa là 10.000đ và mỗi km tiếp theo là 15.000đ. Số tiền phải trả theo quãng đường x chính là một hàm số bậc nhất.',
      },
      {
        id: 'lf-explore',
        type: 'explore',
        title: 'Khám phá',
        content: 'Dùng mô phỏng để thay đổi a và b. Quan sát đường thẳng dịch chuyển và xoay như thế nào. Khi nào đường thẳng đi lên (đồng biến)?',
        simulationSlug: 'linear-function',
      },
      {
        id: 'lf-practice',
        type: 'practice',
        title: 'Luyện tập',
        content: 'Xác định hệ số a, b của đường thẳng đi qua hai điểm A(0, 3) và B(1, 5).',
      },
      {
        id: 'lf-apply',
        type: 'apply',
        title: 'Vận dụng',
        content: 'Sử dụng hàm số bậc nhất để giải quyết các bài toán về tối ưu chi phí và dự đoán.',
      },
    ],
  }
];
