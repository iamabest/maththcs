import { Link, useSearchParams } from 'react-router-dom';
import { lessons } from '../data/lessons';
import { getAllProgress } from '../lib/storage';
import type { Grade } from '../types';

const COMPETENCY_LABELS: Record<string, string> = {
  MAT_REASONING: 'Tư duy & Lập luận',
  MAT_PROBLEM_SOLVING: 'Giải quyết vấn đề',
  MAT_MODELING: 'Mô hình hóa',
  MAT_COMMUNICATION: 'Giao tiếp toán học',
  MAT_TOOLS: 'Công cụ & Phương tiện',
  DIGITAL_COMPETENCE: 'Năng lực số',
};

const GRADES: Grade[] = [6, 7, 8, 9];

export function LessonsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const gradeFilter = searchParams.get('grade');
  const progress = getAllProgress();

  const filtered = gradeFilter
    ? lessons.filter((l) => l.grade === Number(gradeFilter))
    : lessons;

  return (
    <div>
      {/* Page Header */}
      <div style={{ paddingBottom: '20px', marginBottom: '24px', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-accent-light)', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '4px' }}>
          CHƯƠNG TRÌNH HỌC LIỆU TOÁN THCS
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
          Thư viện Bài học & Mô phỏng 3D
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Lựa chọn chuyên đề toán học để tương tác với mô hình không gian và kiểm chứng kiến thức.
        </p>
      </div>

      {/* Grade filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <button
          className={`btn btn-sm ${!gradeFilter ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSearchParams({})}
        >
          Toàn bộ ({lessons.length})
        </button>
        {GRADES.map((g) => {
          const count = lessons.filter((l) => l.grade === g).length;
          return (
            <button
              key={g}
              className={`btn btn-sm ${gradeFilter === String(g) ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSearchParams({ grade: String(g) })}
              disabled={count === 0}
              style={{ opacity: count > 0 ? 1 : 0.4 }}
            >
              Khối Lớp {g} ({count})
            </button>
          );
        })}
      </div>

      {/* Lessons Monograph Cards */}
      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            [ KHÔNG TÌM THẤY BÀI HỌC CHO PHÂN HỆ NÀY ]
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {filtered.map((lesson, i) => {
            const prog = progress.find((p) => p.lessonId === lesson.id);
            const indexStr = String(i + 1).padStart(2, '0');

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

                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '8px', color: 'var(--color-text-primary)' }}>
                      {lesson.title}
                    </h3>

                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
                      {lesson.description}
                    </p>
                  </div>

                  <div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                      {lesson.competencies.map((c) => (
                        <span key={c} className="badge badge-competency">
                          {COMPETENCY_LABELS[c] ?? c}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--color-border)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                      <span>THỜI LƯỢNG: {lesson.estimatedTime} PHÚT</span>
                      {prog?.quizCompleted ? (
                        <span className="badge badge-success">✓ ĐÃ ĐẠT</span>
                      ) : (
                        <span style={{ color: 'var(--color-accent-light)' }}>BẮT ĐẦU →</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
