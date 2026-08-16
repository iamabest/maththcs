import { useState } from 'react';
import type { SurveyInstrument } from '../../types/assessment';

interface SurveyEngineProps {
  instrument: SurveyInstrument;
  onComplete: (responses: Record<string, number>) => void;
  onClose?: () => void;
}

export function SurveyEngine({ instrument, onComplete, onClose }: SurveyEngineProps) {
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (itemId: string, value: number) => {
    if (submitted) return;
    setResponses((prev) => ({ ...prev, [itemId]: value }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    onComplete(responses);
  };

  const allAnswered = instrument.items.every((item) => responses[item.id] !== undefined);

  // Group items by dimension
  const groupedItems = instrument.items.reduce((acc, item) => {
    if (!acc[item.dimension]) acc[item.dimension] = [];
    acc[item.dimension]!.push(item);
    return acc;
  }, {} as Record<string, typeof instrument.items>);

  return (
    <div className="quiz-container" style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{instrument.title}</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: 8 }}>{instrument.description}</p>
      </div>

      {submitted ? (
        <div className="card glass-strong" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🙏</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>Cảm ơn bạn đã tham gia khảo sát!</h3>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>Phản hồi của bạn rất quý giá đối với chúng tôi.</p>
          {onClose && (
            <button className="btn btn-primary" onClick={onClose}>
              Quay lại
            </button>
          )}
        </div>
      ) : (
        <>
          {Object.entries(groupedItems).map(([dimension, items]) => (
            <div key={dimension} style={{ marginBottom: 32 }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 16, borderBottom: '1px solid var(--color-border)', paddingBottom: 8 }}>
                {dimension}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {items.map((item) => (
                  <div key={item.id} className="card glass" style={{ padding: '20px 24px' }}>
                    <p style={{ fontWeight: 500, marginBottom: 16 }}>{item.content}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                      {instrument.scale.map((label, i) => {
                        const val = i + 1;
                        const isSelected = responses[item.id] === val;
                        return (
                          <label
                            key={val}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: 8,
                              cursor: 'pointer',
                              flex: '1 1 0',
                              minWidth: 80,
                              textAlign: 'center',
                            }}
                          >
                            <input
                              type="radio"
                              name={item.id}
                              value={val}
                              checked={isSelected}
                              onChange={() => handleAnswer(item.id, val)}
                              style={{ width: 18, height: 18, accentColor: 'var(--color-accent)' }}
                            />
                            <span style={{ fontSize: '0.75rem', color: isSelected ? 'var(--color-accent-light)' : 'var(--color-text-secondary)', fontWeight: isSelected ? 600 : 400 }}>
                              {label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={{ textAlign: 'center', marginTop: 32, paddingBottom: 40 }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleSubmit}
              disabled={!allAnswered}
              style={{ opacity: allAnswered ? 1 : 0.5 }}
            >
              🚀 Gửi Khảo Sát ({Object.keys(responses).length}/{instrument.items.length})
            </button>
            {!allAnswered && <p style={{ fontSize: '0.875rem', color: 'var(--color-rose)', marginTop: 12 }}>Vui lòng trả lời tất cả các câu hỏi.</p>}
          </div>
        </>
      )}
    </div>
  );
}
