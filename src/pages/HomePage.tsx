import { Link } from 'react-router-dom';
import { lessons } from '../data/lessons';
import { getAllProgress } from '../lib/storage';

export function HomePage() {
  const progress = getAllProgress();
  const completedCount = progress.filter((p) => p.quizCompleted).length;

  return (
    <div className="bg-math-grid" style={{ minHeight: '100%' }}>
      
      {/* Asymmetric Split Hero Section */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'center', paddingBottom: '36px', borderBottom: '1px solid var(--color-border)' }}>
        
        {/* Left Column: Academic Manifesto */}
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 10px', backgroundColor: 'rgba(37, 99, 235, 0.1)', border: '1px solid rgba(37, 99, 235, 0.3)', borderRadius: 'var(--radius-xs)', marginBottom: '16px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.725rem', color: 'var(--color-accent-light)', fontWeight: 600 }}>
              TOÁN THCS · TRỌNG TÂM LỚP 9
            </span>
          </div>

          <h1 style={{ fontSize: '2.25rem', lineHeight: 1.2, fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '16px', letterSpacing: '-0.03em' }}>
            Trực quan hóa <br />
            Khái niệm Toán học 3D
          </h1>

          <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: '24px', maxWidth: '520px' }}>
            Nền tảng học liệu số tương tác giúp học sinh quan sát không gian, phân tích hàm số và kiểm chứng các định lý hình học thông qua mô hình tính toán 3D thời gian thực.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/bai-hoc" className="btn btn-primary btn-lg">
              Vào Thư viện Bài học →
            </Link>
            <Link to="/kiem-tra" className="btn btn-secondary btn-lg">
              Phiếu Đánh giá Năng lực
            </Link>
          </div>
        </div>

        {/* Right Column: Featured Mathematical Plate */}
        <div className="card" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', position: 'relative' }}>
          <div className="plate-header">
            <span>CHUYÊN ĐỀ TRỌNG TÂM LỚP 9</span>
            <span>MOD.09.01</span>
          </div>

          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: 'var(--color-text-primary)' }}>
            Hàm số bậc nhất y = ax + b
          </h2>
          
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
            Khám phá ý nghĩa hình học của hệ số góc <i>a</i> và tung độ gốc <i>b</i> trong hệ trục tọa độ 3 chiều.
          </p>

          <div className="theorem-block" style={{ margin: '12px 0 20px' }}>
            <div className="theorem-title">Định lý về đồ thị hàm số</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
              (d): y = ax + b (a ≠ 0) đi qua P(0, b) và Q(-b/a, 0)
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
            <span className="badge badge-grade">Khối 9 · Đại số</span>
            <Link to="/bai-hoc/lesson-linear-function" className="btn btn-primary btn-sm">
              Mở Mô phỏng 3D →
            </Link>
          </div>
        </div>

      </section>

      {/* Academic Telemetry Metrics */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', margin: '32px 0 40px' }}>
        <div className="card" style={{ padding: '18px 20px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            Tổng số Mô hình 3D
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
            06
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Bao phủ Khối 6, 7, 8, 9
          </div>
        </div>

        <div className="card" style={{ padding: '18px 20px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            Tiến độ Hoàn thành
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-accent-light)' }}>
            {completedCount} / {lessons.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Bài kiểm tra đã đạt
          </div>
        </div>

        <div className="card" style={{ padding: '18px 20px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            Khung Năng lực
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-emerald-light)' }}>
            05
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Thành tố Toán học & Số
          </div>
        </div>

        <div className="card" style={{ padding: '18px 20px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            Chuẩn Đào tạo
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-amber-light)' }}>
            GDPT 2018
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Bộ Giáo dục & Đào tạo
          </div>
        </div>
      </section>

      {/* Curriculum Plates Index */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-accent-light)', fontWeight: 600, letterSpacing: '0.05em' }}>
              MỤC LỤC CHUYÊN ĐỀ
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)', marginTop: '2px' }}>
              Chương trình Học liệu Mô phỏng
            </h2>
          </div>
          <Link to="/bai-hoc" className="btn btn-ghost btn-sm" style={{ border: '1px solid var(--color-border)' }}>
            Xem toàn bộ {lessons.length} bài học →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {lessons.map((lesson, index) => {
            const prog = progress.find((p) => p.lessonId === lesson.id);
            const indexStr = String(index + 1).padStart(2, '0');

            return (
              <Link
                key={lesson.id}
                to={`/bai-hoc/${lesson.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div className="plate-header">
                      <span>CH.{indexStr} · LỚP {lesson.grade}</span>
                      <span>{lesson.topic}</span>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--color-text-primary)' }}>
                      {lesson.title}
                    </h3>

                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
                      {lesson.description}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                      {lesson.competencies.slice(0, 2).map((c) => (
                        <span key={c} className="badge badge-competency">
                          {COMPETENCY_LABELS[c] ?? c}
                        </span>
                      ))}
                      <span className="badge badge-warning">
                        {lesson.estimatedTime} phút
                      </span>
                    </div>

                    {prog && (
                      <div style={{ paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                          <span>TIẾN ĐỘ</span>
                          <span>{getProgressPct(prog)}%</span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${getProgressPct(prog)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

    </div>
  );
}

function getProgressPct(prog: { opened: boolean; simulationInteracted: boolean; quizCompleted: boolean }): number {
  let pct = 0;
  if (prog.opened) pct += 33;
  if (prog.simulationInteracted) pct += 33;
  if (prog.quizCompleted) pct += 34;
  return pct;
}

const COMPETENCY_LABELS: Record<string, string> = {
  MAT_REASONING: 'Tư duy & Lập luận',
  MAT_PROBLEM_SOLVING: 'Giải quyết vấn đề',
  MAT_MODELING: 'Mô hình hóa',
  MAT_COMMUNICATION: 'Giao tiếp toán học',
  MAT_TOOLS: 'Công cụ & Phương tiện',
  DIGITAL_COMPETENCE: 'Năng lực số',
};
