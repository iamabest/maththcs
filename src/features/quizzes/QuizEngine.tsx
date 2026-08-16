import { useState, useCallback } from 'react';
import type { Quiz, QuizAttempt } from '../../types';
import { saveAttempt } from '../../lib/storage';

interface QuizEngineProps {
  quiz: Quiz;
  onClose: () => void;
}

export function QuizEngine({ quiz, onClose }: QuizEngineProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const startedAt = useState(() => new Date().toISOString())[0];

  const handleAnswer = useCallback(
    (questionId: string, value: string) => {
      if (submitted) return;
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    },
    [submitted],
  );

  const handleSubmit = () => {
    let correct = 0;
    for (const q of quiz.questions) {
      const userAns = answers[q.id];
      if (!userAns) continue;

      if (q.type === 'fill_number') {
        const userNum = parseFloat(userAns);
        const correctNum = parseFloat(q.correctAnswer);
        const tol = q.tolerance ?? 0;
        if (!isNaN(userNum) && Math.abs(userNum - correctNum) <= tol) {
          correct++;
        }
      } else {
        if (userAns === q.correctAnswer) {
          correct++;
        }
      }
    }

    setScore(correct);
    setSubmitted(true);

    // Save attempt
    const attempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      quizId: quiz.id,
      lessonId: quiz.lessonId,
      answers,
      score: correct,
      total: quiz.questions.length,
      startedAt,
      submittedAt: new Date().toISOString(),
    };
    saveAttempt(attempt);
  };

  const pct = quiz.questions.length > 0 ? Math.round((score / quiz.questions.length) * 100) : 0;
  const allAnswered = quiz.questions.every((q) => answers[q.id] !== undefined && answers[q.id] !== '');

  return (
    <div className="quiz-container">
      {/* Score Summary Panel */}
      {submitted && (
        <div className="card" style={{ marginBottom: '24px', textAlign: 'center', borderColor: pct >= 60 ? 'var(--color-emerald)' : 'var(--color-amber)' }}>
          <div className="plate-header">
            <span>KẾT QUẢ ĐÁNH GIÁ NĂNG LỰC</span>
            <span>SCORED / RECORDED</span>
          </div>

          <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: pct >= 60 ? 'var(--color-emerald-light)' : 'var(--color-amber-light)' }}>
            {score} / {quiz.questions.length}
          </div>

          <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', margin: '8px 0 16px' }}>
            Tỷ lệ đạt: {pct}% : {pct >= 80 ? 'Nắm vững toàn bộ định lý' : pct >= 60 ? 'Đạt yêu cầu kiến thức' : 'Cần ôn tập thêm mô hình 3D'}
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={onClose}>
              Đóng phiếu làm bài
            </button>
          </div>
        </div>
      )}

      {/* Question Items */}
      {quiz.questions.map((q, idx) => {
        const userAns = answers[q.id];
        const isCorrect =
          q.type === 'fill_number'
            ? !isNaN(parseFloat(userAns ?? '')) &&
              Math.abs(parseFloat(userAns ?? '') - parseFloat(q.correctAnswer)) <= (q.tolerance ?? 0)
            : userAns === q.correctAnswer;

        return (
          <div key={q.id} className="quiz-question">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-accent-light)', fontWeight: 700 }}>
                CÂU HỎI {String(idx + 1).padStart(2, '0')} / {String(quiz.questions.length).padStart(2, '0')}
              </span>
              <span className={`badge ${q.difficulty === 'easy' ? 'badge-success' : q.difficulty === 'medium' ? 'badge-warning' : 'badge-danger'}`}>
                {q.difficulty === 'easy' ? 'Mức 1: Nhận biết' : q.difficulty === 'medium' ? 'Mức 2: Thông hiểu' : 'Mức 3: Vận dụng'}
              </span>
            </div>

            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '16px', lineHeight: 1.6 }}>
              {q.content}
            </h3>

            {/* Multiple choice */}
            {q.type === 'multiple_choice' && q.options && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {q.options.map((opt) => {
                  let cls = 'quiz-option';
                  if (userAns === opt.id) cls += ' selected';
                  if (submitted) {
                    if (opt.id === q.correctAnswer) cls += ' correct';
                    else if (userAns === opt.id && !isCorrect) cls += ' incorrect';
                  }
                  return (
                    <button
                      key={opt.id}
                      className={cls}
                      onClick={() => handleAnswer(q.id, opt.id)}
                      disabled={submitted}
                    >
                      <span className="option-marker">
                        {opt.id.toUpperCase()}
                      </span>
                      <span>{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* True/False */}
            {q.type === 'true_false' && (
              <div style={{ display: 'flex', gap: '12px' }}>
                {(['true', 'false'] as const).map((val) => {
                  let cls = 'quiz-option';
                  if (userAns === val) cls += ' selected';
                  if (submitted) {
                    if (val === q.correctAnswer) cls += ' correct';
                    else if (userAns === val && !isCorrect) cls += ' incorrect';
                  }
                  return (
                    <button
                      key={val}
                      className={cls}
                      onClick={() => handleAnswer(q.id, val)}
                      disabled={submitted}
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      {val === 'true' ? 'Đúng' : 'Sai'}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Fill number */}
            {q.type === 'fill_number' && (
              <div style={{ marginTop: '8px' }}>
                <input
                  type="number"
                  className="quiz-input"
                  placeholder="Nhập giá trị số..."
                  value={userAns ?? ''}
                  onChange={(e) => handleAnswer(q.id, e.target.value)}
                  disabled={submitted}
                  style={submitted ? {
                    borderColor: isCorrect ? 'var(--color-emerald)' : 'var(--color-rose)',
                  } : {}}
                />
              </div>
            )}

            {/* Explanation after submit */}
            {submitted && (
              <div className="theorem-block" style={{ marginTop: '14px', backgroundColor: isCorrect ? 'rgba(5, 150, 105, 0.08)' : 'rgba(220, 38, 38, 0.08)', borderColor: isCorrect ? 'var(--color-emerald)' : 'var(--color-rose)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: isCorrect ? 'var(--color-emerald-light)' : 'var(--color-rose-light)', marginBottom: '4px' }}>
                  {isCorrect ? '✓ Đáp án chính xác' : `✗ Đáp án đúng: ${getDisplayAnswer(q)}`}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                  {q.explanation}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Submit button */}
      {!submitted && (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleSubmit}
            disabled={!allAnswered}
          >
            Nộp bài kiểm tra ({Object.keys(answers).length}/{quiz.questions.length}) →
          </button>
        </div>
      )}
    </div>
  );
}

function getDisplayAnswer(q: { type: string; correctAnswer: string; options?: Array<{ id: string; text: string }> }): string {
  if (q.type === 'true_false') return q.correctAnswer === 'true' ? 'Đúng' : 'Sai';
  if (q.type === 'fill_number') return q.correctAnswer;
  const opt = q.options?.find((o) => o.id === q.correctAnswer);
  return opt ? `${opt.id.toUpperCase()}. ${opt.text}` : q.correctAnswer;
}
