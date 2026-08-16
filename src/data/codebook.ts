// ============================================================
// Codebook Data
// ============================================================

export interface CodebookEntry {
  variable: string;
  type: string;
  description: string;
  possibleValues: string;
}

export const progressCodebook: CodebookEntry[] = [
  { variable: 'research_code', type: 'string', description: 'Mã định danh ẩn danh của học sinh', possibleValues: 'Chuỗi hash (vd: a1b2c3d4)' },
  { variable: 'lessonId', type: 'string', description: 'Mã bài học', possibleValues: 'Chuỗi ID bài học (vd: pythagoras-theorem)' },
  { variable: 'opened', type: 'boolean', description: 'Đã mở bài học chưa', possibleValues: 'true, false' },
  { variable: 'simulationInteracted', type: 'boolean', description: 'Đã tương tác với mô phỏng chưa', possibleValues: 'true, false' },
  { variable: 'quizCompleted', type: 'boolean', description: 'Đã hoàn thành bài kiểm tra chưa', possibleValues: 'true, false' },
  { variable: 'quizBestScore', type: 'number', description: 'Điểm cao nhất đạt được', possibleValues: 'Từ 0 đến quizBestTotal' },
  { variable: 'quizBestTotal', type: 'number', description: 'Tổng số điểm tối đa', possibleValues: 'Số nguyên dương' },
  { variable: 'lastAccessedAt', type: 'string', description: 'Thời gian truy cập lần cuối', possibleValues: 'ISO 8601 Date String' },
  { variable: 'completedAt', type: 'string', description: 'Thời gian hoàn thành', possibleValues: 'ISO 8601 Date String hoặc rỗng' }
];

export const attemptsCodebook: CodebookEntry[] = [
  { variable: 'research_code', type: 'string', description: 'Mã định danh ẩn danh của học sinh', possibleValues: 'Chuỗi hash (vd: a1b2c3d4)' },
  { variable: 'attemptId', type: 'string', description: 'Mã lượt làm bài', possibleValues: 'Chuỗi UUID' },
  { variable: 'quizId', type: 'string', description: 'Mã bài kiểm tra', possibleValues: 'Chuỗi ID' },
  { variable: 'lessonId', type: 'string', description: 'Mã bài học liên quan', possibleValues: 'Chuỗi ID' },
  { variable: 'score', type: 'number', description: 'Điểm đạt được', possibleValues: 'Số nguyên' },
  { variable: 'total', type: 'number', description: 'Tổng điểm', possibleValues: 'Số nguyên dương' },
  { variable: 'startedAt', type: 'string', description: 'Thời gian bắt đầu làm', possibleValues: 'ISO 8601 Date String' },
  { variable: 'submittedAt', type: 'string', description: 'Thời gian nộp bài', possibleValues: 'ISO 8601 Date String' }
];

export const simulationEventsCodebook: CodebookEntry[] = [
  { variable: 'research_code', type: 'string', description: 'Mã định danh ẩn danh của học sinh', possibleValues: 'Chuỗi hash (vd: a1b2c3d4)' },
  { variable: 'simulationSlug', type: 'string', description: 'Định danh mô phỏng', possibleValues: 'Chuỗi ID' },
  { variable: 'eventType', type: 'string', description: 'Loại sự kiện', possibleValues: 'open, parameter_change, reset, close' },
  { variable: 'payload', type: 'string', description: 'Dữ liệu chi tiết của sự kiện', possibleValues: 'Chuỗi JSON' },
  { variable: 'occurredAt', type: 'string', description: 'Thời gian xảy ra', possibleValues: 'ISO 8601 Date String' }
];
