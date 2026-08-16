import { useParams, Link } from 'react-router-dom';
import { lessons } from '../data/lessons';
import { quizzes } from '../data/quizzes';
import { markLessonOpened } from '../lib/storage';
import { useEffect, useState, lazy, Suspense } from 'react';
import { QuizEngine } from '../features/quizzes/QuizEngine';

const NumberLine3D = lazy(() => import('../features/simulations/NumberLine3D'));
const RectangularPrism = lazy(() => import('../features/simulations/RectangularPrism'));
const InscribedAngle = lazy(() => import('../features/simulations/InscribedAngle'));
const ParallelLines = lazy(() => import('../features/simulations/ParallelLines'));
const TriangularPrism = lazy(() => import('../features/simulations/TriangularPrism'));
const LinearFunction = lazy(() => import('../features/simulations/LinearFunction'));

const SIMULATION_COMPONENTS: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  'number-line-3d': NumberLine3D,
  'rectangular-prism': RectangularPrism,
  'inscribed-angle': InscribedAngle,
  'parallel-lines': ParallelLines,
  'triangular-prism': TriangularPrism,
  'linear-function': LinearFunction,
};

export function LessonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const lesson = lessons.find((l) => l.id === id || l.slug === id);
  const quiz = quizzes.find((q) => q.lessonId === lesson?.id);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    if (lesson) {
      markLessonOpened(lesson.id);
    }
  }, [lesson]);

  if (!lesson) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
          [ 404 · KHÔNG TÌM THẤY BÀI HỌC ]
        </p>
        <Link to="/bai-hoc" className="btn btn-secondary">
          ← Quay lại danh mục bài học
        </Link>
      </div>
    );
  }

  const SimComponent = SIMULATION_COMPONENTS[lesson.simulationSlug];

  return (
    <div>
      {/* Lesson Monograph Header */}
      <div className="lesson-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <Link
            to="/bai-hoc"
            style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}
          >
            ← QUAY LẠI MỤC LỤC
          </Link>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="badge badge-grade">Lớp {lesson.grade}</span>
            <span className="badge badge-competency">{lesson.topic}</span>
          </div>
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          {lesson.title}
        </h1>

        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '800px' }}>
          {lesson.description}
        </p>

        <div style={{ marginTop: '20px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.725rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
            MỤC TIÊU NĂNG LỰC CẦN ĐẠT
          </div>
          <ul className="lesson-objectives">
            {lesson.objectives.map((obj, i) => (
              <li key={i}>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-accent-light)', marginRight: '8px' }}>
                  [{String(i + 1).padStart(2, '0')}]
                </span>
                {obj}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Lesson Activities */}
      {lesson.activities.map((activity, actIdx) => (
        <div key={activity.id} className="lesson-section">
          <div className="plate-header">
            <span>HOẠT ĐỘNG {String(actIdx + 1).padStart(2, '0')} · {ACTIVITY_TITLES[activity.type] || activity.type.toUpperCase()}</span>
            <span>SEC.{String(actIdx + 1).padStart(2, '0')}</span>
          </div>

          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px', color: 'var(--color-text-primary)' }}>
            {activity.title}
          </h2>

          <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '16px' }}>
            {activity.content.split('\n').map((line, i) => (
              <p key={i} style={{ marginBottom: '8px' }}>{line}</p>
            ))}
          </div>

          {/* Interactive Simulation Viewport */}
          {activity.simulationSlug && SimComponent && (
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-cyan-light)' }}>
                <span>PHÒNG THÍ NGHIỆM TƯƠNG TÁC 3D</span>
                <span>TOẠ ĐỘ & KHÔNG GIAN</span>
              </div>
              <Suspense
                fallback={
                  <div style={{ height: '420px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                    ĐANG KHỞI TẠO MÔ PHỎNG 3D...
                  </div>
                }
              >
                <SimComponent />
              </Suspense>
            </div>
          )}
        </div>
      ))}

      {/* Quiz Worksheet Section */}
      {quiz && (
        <div className="lesson-section" style={{ marginTop: '36px' }}>
          <div className="plate-header">
            <span>KIỂM TRA & ĐÁNH GIÁ ĐỊNH KỲ</span>
            <span>EVAL.01</span>
          </div>

          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
            Phiếu Luyện tập & Đánh giá Năng lực
          </h2>

          {!showQuiz ? (
            <div style={{ textAlign: 'center', padding: '32px 16px', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', margin: '16px 0' }}>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
                Bộ câu hỏi gồm <strong>{quiz.questions.length} câu</strong> trắc nghiệm và điền số kiểm tra mức độ nắm vững định lý.
              </p>
              <button className="btn btn-primary btn-lg" onClick={() => setShowQuiz(true)}>
                Bắt đầu làm bài kiểm tra →
              </button>
            </div>
          ) : (
            <div style={{ marginTop: '20px' }}>
              <QuizEngine quiz={quiz} onClose={() => setShowQuiz(false)} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const ACTIVITY_TITLES: Record<string, string> = {
  intro: 'KHỞI ĐỘNG & TÌNH HUỐNG',
  explore: 'KHÁM PHÁ MÔ HÌNH 3D',
  practice: 'LUYỆN TẬP VẬN DỤNG',
  apply: 'ỨNG DỤNG THỰC TIỄN',
  assess: 'ĐÁNH GIÁ HIỂU BIẾT',
};
