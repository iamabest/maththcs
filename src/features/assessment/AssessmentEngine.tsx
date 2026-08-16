import { useState, useCallback } from 'react';
import type { Assessment } from '../../types/assessment';

interface AssessmentEngineProps {
  assessment: Assessment;
  onComplete: (score: number, total: number, answers: Record<string, string>) => void;
  onClose?: () => void;
}

export function AssessmentEngine({ assessment, onComplete, onClose }: AssessmentEngineProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = useCallback(
    (questionId: string, value: string) => {
      if (submitted) return;
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    },
    [submitted]
  );

  const handleSubmit = () => {
    let correct = 0;
    for (const q of assessment.questions) {
      const userAns = answers[q.id];
      if (!userAns) continue;

      if (q.type === 'fill_number') {
        const userNum = parseFloat(userAns);
        const correctNum = parseFloat(q.correctAnswer);
        if (!isNaN(userNum) && Math.abs(userNum - correctNum) <= 0.01) {
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
    onComplete(correct, assessment.questions.length, answers);
  };

  const pct = assessment.questions.length > 0 ? Math.round((score / assessment.questions.length) * 100) : 0;
  const allAnswered = assessment.questions.every((q) => answers[q.id] !== undefined && answers[q.id] !== '');

  return (
    <div className="quiz-container">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{assessment.title}</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 8 }}>{assessment.description}</p>
      </div>

      {submitted && (
        <div className="card quiz-score animate-in" style={{ marginBottom: 24 }}>
          <div className="score-value">
            {score}/{assessment.questions.length}
          </div>
          <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)', margin: '8px 0' }}>
            Điểm: {pct}%
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
            {onClose && (
              <button className="btn btn-secondary" onClick={onClose}>
                Quay lại
              </button>
            )}
          </div>
        </div>
      )}

      {assessment.questions.map((q, idx) => {
        const userAns = answers[q.id];
        const isCorrect =
          q.type === 'fill_number'
            ? !isNaN(parseFloat(userAns ?? '')) && Math.abs(parseFloat(userAns ?? '') - parseFloat(q.correctAnswer)) <= 0.01
            : userAns === q.correctAnswer;

        return (
          <div key={q.id} className="card quiz-question animate-in" style={{ animationDelay: `${idx * 0.05}s` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                Câu {idx + 1}/{assessment.questions.length}
              </span>
              <span className={`badge badge-competency`}>
                {q.difficulty === 'easy' ? 'Dễ' : q.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
              </span>
            </div>

            <h3>{q.content}</h3>

            {q.type === 'multiple_choice' && q.options && (
              <div className="quiz-options">
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
                      <span style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        border: '2px solid var(--color-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}>
                        {opt.id.toUpperCase()}
                      </span>
                      {opt.text}
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === 'true_false' && (
              <div className="quiz-options" style={{ flexDirection: 'row', gap: 12 }}>
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
                      {val === 'true' ? '✓ Đúng' : '✗ Sai'}
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === 'fill_number' && (
              <input
                type="number"
                className="quiz-input"
                placeholder="Nhập đáp án..."
                value={userAns ?? ''}
                onChange={(e) => handleAnswer(q.id, e.target.value)}
                disabled={submitted}
                style={submitted ? { borderColor: isCorrect ? 'var(--color-emerald)' : 'var(--color-rose)' } : {}}
              />
            )}

            {submitted && (
              <div className={`quiz-explanation ${isCorrect ? 'correct-bg' : 'incorrect-bg'}`}>
                <strong>{isCorrect ? '✓ Chính xác!' : `✗ Đáp án đúng: ${q.correctAnswer}`}</strong>
                <br />
                {q.explanation}
              </div>
            )}
          </div>
        );
      })}

      {!submitted && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleSubmit}
            disabled={!allAnswered}
            style={{ opacity: allAnswered ? 1 : 0.5 }}
          >
            ✅ Nộp bài ({Object.keys(answers).length}/{assessment.questions.length})
          </button>
        </div>
      )}
    </div>
  );
}
