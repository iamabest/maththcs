import { SurveyInstrument } from '../types/assessment';

export const studentSurvey: SurveyInstrument = {
  id: 'survey-student-01',
  title: 'Khảo sát trải nghiệm học tập',
  description: 'Vui lòng đánh giá mức độ đồng ý của bạn với các phát biểu sau. Không có câu trả lời đúng hay sai, chúng tôi quan tâm đến trải nghiệm thực tế của bạn.',
  scale: ['Hoàn toàn không đồng ý', 'Không đồng ý', 'Phân vân', 'Đồng ý', 'Hoàn toàn đồng ý'],
  items: [
    {
      id: 'vis_1',
      code: 'VIS_1',
      dimension: 'Trực quan hóa (Visualization)',
      content: 'Tôi dễ hình dung các khái niệm toán học hơn khi sử dụng mô phỏng 3D.',
    },
    {
      id: 'vis_2',
      code: 'VIS_2',
      dimension: 'Trực quan hóa (Visualization)',
      content: 'Mô phỏng 3D giúp tôi nhìn thấy rõ ràng các hình khối trong không gian.',
    },
    {
      id: 'vis_3',
      code: 'VIS_3',
      dimension: 'Trực quan hóa (Visualization)',
      content: 'Tôi có thể hiểu sự thay đổi của bài toán qua các hình ảnh động.',
    },
    {
      id: 'int_1',
      code: 'INT_1',
      dimension: 'Tương tác (Interaction)',
      content: 'Tôi có thể dễ dàng thay đổi các tham số (ví dụ: kéo thanh trượt) để kiểm chứng dự đoán của mình.',
    },
    {
      id: 'int_2',
      code: 'INT_2',
      dimension: 'Tương tác (Interaction)',
      content: 'Việc xoay, phóng to/thu nhỏ mô hình 3D giúp tôi hiểu bài tốt hơn.',
    },
    {
      id: 'int_3',
      code: 'INT_3',
      dimension: 'Tương tác (Interaction)',
      content: 'Hệ thống phản hồi nhanh chóng khi tôi tương tác.',
    },
    {
      id: 'mot_1',
      code: 'MOT_1',
      dimension: 'Hứng thú (Motivation)',
      content: 'Tôi cảm thấy việc học Toán thú vị hơn khi sử dụng hệ thống này.',
    },
    {
      id: 'mot_2',
      code: 'MOT_2',
      dimension: 'Hứng thú (Motivation)',
      content: 'Tôi muốn hệ thống này được áp dụng vào các bài học Toán khác.',
    },
    {
      id: 'mot_3',
      code: 'MOT_3',
      dimension: 'Hứng thú (Motivation)',
      content: 'Môi trường 3D kích thích sự tò mò của tôi khi học.',
    },
    {
      id: 'use_1',
      code: 'USE_1',
      dimension: 'Khả dụng (Usability)',
      content: 'Giao diện của hệ thống dễ hiểu và dễ sử dụng.',
    },
    {
      id: 'use_2',
      code: 'USE_2',
      dimension: 'Khả dụng (Usability)',
      content: 'Tôi không cần quá nhiều thời gian để học cách sử dụng hệ thống.',
    },
    {
      id: 'use_3',
      code: 'USE_3',
      dimension: 'Khả dụng (Usability)',
      content: 'Tôi hiếm khi gặp lỗi kỹ thuật trong quá trình sử dụng.',
    },
  ],
};
