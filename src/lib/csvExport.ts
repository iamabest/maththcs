import { getAllProgress, getAllAttempts, getSimulationEvents } from './storage';

/**
 * Trả về mã nghiên cứu ẩn danh của người dùng hiện tại (lưu trong localStorage)
 * Nếu chưa có, sẽ tạo mới.
 */
function getResearchCode(): string {
  let code = localStorage.getItem('research_code');
  if (!code) {
    // Tạo random hash 8 ký tự
    code = Math.random().toString(36).substring(2, 10);
    localStorage.setItem('research_code', code);
  }
  return code;
}

/**
 * Helper tải file CSV xuống client
 */
function downloadCSV(filename: string, csvContent: string) {
  // Thêm BOM cho Excel hỗ trợ UTF-8
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Escape giá trị cho CSV
 */
function escapeCSV(value: any): string {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

/**
 * Xuất dữ liệu tiến độ bài học
 */
export function exportProgressCSV() {
  const code = getResearchCode();
  const progressMap = getAllProgress();
  
  const headers = [
    'research_code', 'lessonId', 'opened', 'simulationInteracted', 
    'quizCompleted', 'quizBestScore', 'quizBestTotal', 'lastAccessedAt', 'completedAt'
  ];
  
  let csv = headers.join(',') + '\n';
  
  for (const [lessonId, progress] of Object.entries(progressMap)) {
    const row = [
      code,
      lessonId,
      progress.opened,
      progress.simulationInteracted,
      progress.quizCompleted,
      progress.quizBestScore,
      progress.quizBestTotal,
      progress.lastAccessedAt,
      progress.completedAt
    ];
    csv += row.map(escapeCSV).join(',') + '\n';
  }
  
  downloadCSV(`progress_export_${code}.csv`, csv);
}

/**
 * Xuất dữ liệu lịch sử làm bài tập
 */
export function exportAttemptsCSV() {
  const code = getResearchCode();
  const attempts = getAllAttempts();
  
  const headers = [
    'research_code', 'attemptId', 'quizId', 'lessonId', 
    'score', 'total', 'startedAt', 'submittedAt'
  ];
  
  let csv = headers.join(',') + '\n';
  
  for (const attempt of attempts) {
    const row = [
      code,
      attempt.id,
      attempt.quizId,
      attempt.lessonId,
      attempt.score,
      attempt.total,
      attempt.startedAt,
      attempt.submittedAt
    ];
    csv += row.map(escapeCSV).join(',') + '\n';
  }
  
  downloadCSV(`attempts_export_${code}.csv`, csv);
}

/**
 * Xuất sự kiện tương tác mô phỏng
 */
export function exportSimulationEventsCSV() {
  const code = getResearchCode();
  const events = getSimulationEvents();
  
  const headers = [
    'research_code', 'simulationSlug', 'eventType', 'payload', 'occurredAt'
  ];
  
  let csv = headers.join(',') + '\n';
  
  for (const event of events) {
    const row = [
      code,
      event.simulationSlug,
      event.eventType,
      event.payload ? JSON.stringify(event.payload) : '',
      event.occurredAt
    ];
    csv += row.map(escapeCSV).join(',') + '\n';
  }
  
  downloadCSV(`simulation_events_export_${code}.csv`, csv);
}
