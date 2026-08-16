import { lessons } from '../data/lessons';
import { quizzes } from '../data/quizzes';
import { getAllProgress, getAllAttempts } from '../lib/storage';
import type { Competency } from '../types';

const COMPETENCY_LABELS: Record<Competency, string> = {
  MAT_REASONING: 'Tư duy & Lập luận',
  MAT_PROBLEM_SOLVING: 'Giải quyết vấn đề',
  MAT_MODELING: 'Mô hình hóa',
  MAT_COMMUNICATION: 'Giao tiếp',
  MAT_TOOLS: 'Công cụ & Phương tiện',
  DIGITAL_COMPETENCE: 'Năng lực số',
};

export function DashboardPage() {
  const progress = getAllProgress();
  const attempts = getAllAttempts();

  const totalLessons = lessons.length;
  const completedLessons = progress.filter((p) => p.quizCompleted).length;
  const openedLessons = progress.filter((p) => p.opened).length;
  const overallPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Average score
  const avgScore =
    attempts.length > 0
      ? Math.round(
          (attempts.reduce((s, a) => s + (a.total > 0 ? (a.score / a.total) * 100 : 0), 0) /
            attempts.length)
        )
      : 0;

  // Competency breakdown from all attempts
  const compStats: Record<string, { correct: number; total: number }> = {};

  for (const attempt of attempts) {
    const quiz = quizzes.find((q: { id: string }) => q.id === attempt.quizId);
    if (!quiz) continue;
    for (const q of quiz.questions) {
      if (!compStats[q.competency]) {
        compStats[q.competency] = { correct: 0, total: 0 };
      }
      compStats[q.competency]!.total++;
      if (attempt.answers[q.id] === q.correctAnswer) {
        compStats[q.competency]!.correct++;
      }
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ paddingBottom: '20px', marginBottom: '24px', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-accent-light)', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '4px' }}>
          HỒ SƠ HỌC TẬP CÁ NHÂN
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
          Tiến độ & Kết quả Học tập
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Báo cáo định lượng mức độ hoàn thành bài học 3D và chỉ số thành thạo năng lực toán học.
        </p>
      </div>

      {/* Top Telemetry Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            Tỷ lệ Hoàn thành
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-accent-light)' }}>
            {overallPct}%
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            {completedLessons} / {totalLessons} bài học đã đạt
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            Bài học đã khám phá
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
            {openedLessons}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            trên tổng số {totalLessons} chuyên đề
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            Điểm Trung bình Kiểm tra
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-emerald-light)' }}>
            {avgScore}%
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Dựa trên {attempts.length} lượt làm bài
          </div>
        </div>
      </div>

      {/* Competency breakdown */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div className="plate-header">
          <span>ĐÁNH GIÁ NĂNG LỰC TOÁN HỌC</span>
          <span>COMPETENCY MATRIX</span>
        </div>

        {Object.keys(compStats).length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Object.entries(compStats).map(([key, val]) => {
              const pct = val.total > 0 ? Math.round((val.correct / val.total) * 100) : 0;
              return (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {COMPETENCY_LABELS[key as Competency] ?? key}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>
                      {val.correct}/{val.total} câu đúng ({pct}%)
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '24px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
            [ CHƯA CÓ DỮ LIỆU ĐÁNH GIÁ NĂNG LỰC ]
          </p>
        )}
      </div>

      {/* Lesson Progress Detailed Monograph Table */}
      <div className="card">
        <div className="plate-header">
          <span>CHI TIẾT TIẾN ĐỘ TỪNG CHUYÊN ĐỀ</span>
          <span>CURRICULUM LOG</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ textAlign: 'left', padding: '12px 14px', color: 'var(--color-text-muted)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>CHUYÊN ĐỀ</th>
                <th style={{ textAlign: 'center', padding: '12px 14px', color: 'var(--color-text-muted)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>KHỐI LỚP</th>
                <th style={{ textAlign: 'center', padding: '12px 14px', color: 'var(--color-text-muted)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>ĐÃ MỞ</th>
                <th style={{ textAlign: 'center', padding: '12px 14px', color: 'var(--color-text-muted)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>MÔ PHỎNG 3D</th>
                <th style={{ textAlign: 'right', padding: '12px 14px', color: 'var(--color-text-muted)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>ĐIỂM CAO NHẤT</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson) => {
                const prog = progress.find((p) => p.lessonId === lesson.id);
                return (
                  <tr key={lesson.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {lesson.title}
                    </td>
                    <td style={{ textAlign: 'center', padding: '12px 14px' }}>
                      <span className="badge badge-grade">Lớp {lesson.grade}</span>
                    </td>
                    <td style={{ textAlign: 'center', padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>
                      {prog?.opened ? (
                        <span className="badge badge-success">✓</span>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)' }}>-</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center', padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>
                      {prog?.simulationInteracted ? (
                        <span className="badge badge-success">✓</span>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)' }}>-</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right', padding: '12px 14px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      {prog?.quizBestScore != null && prog.quizBestTotal ? (
                        <span style={{ color: 'var(--color-emerald-light)' }}>
                          {prog.quizBestScore}/{prog.quizBestTotal}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)' }}>Chưa thi</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
