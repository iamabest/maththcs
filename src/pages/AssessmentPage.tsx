import { useState } from 'react';
import { AssessmentEngine } from '../features/assessment/AssessmentEngine';
import { SurveyEngine } from '../features/assessment/SurveyEngine';
import { preTest, postTest } from '../data/assessments';
import { studentSurvey } from '../data/surveyItems';
import { saveAssessmentResult, saveSurveyResponse, getAssessmentResults, getSurveyResponses } from '../lib/assessmentStorage';

type ViewState = 'menu' | 'pretest' | 'posttest' | 'survey';

export function AssessmentPage() {
  const [view, setView] = useState<ViewState>('menu');
  const [results, setResults] = useState(() => getAssessmentResults());
  const [surveys, setSurveys] = useState(() => getSurveyResponses());

  const handleAssessmentComplete = (type: 'pretest' | 'posttest', score: number, total: number, answers: Record<string, string>) => {
    saveAssessmentResult(type, score, total, answers);
    setResults(getAssessmentResults());
  };

  const handleSurveyComplete = (responses: Record<string, number>) => {
    saveSurveyResponse({
      instrumentId: studentSurvey.id,
      responses,
      submittedAt: new Date().toISOString(),
    });
    setSurveys(getSurveyResponses());
  };

  if (view === 'pretest') {
    return (
      <div>
        <AssessmentEngine assessment={preTest} onComplete={(s, t, a) => handleAssessmentComplete('pretest', s, t, a)} onClose={() => setView('menu')} />
      </div>
    );
  }

  if (view === 'posttest') {
    return (
      <div>
        <AssessmentEngine assessment={postTest} onComplete={(s, t, a) => handleAssessmentComplete('posttest', s, t, a)} onClose={() => setView('menu')} />
      </div>
    );
  }

  if (view === 'survey') {
    return (
      <div>
        <SurveyEngine instrument={studentSurvey} onComplete={handleSurveyComplete} onClose={() => setView('menu')} />
      </div>
    );
  }

  const preTestDone = !!results['pretest'];
  const postTestDone = !!results['posttest'];
  const surveyDone = surveys.some(s => s.instrumentId === studentSurvey.id);

  return (
    <div>
      {/* Header */}
      <div style={{ paddingBottom: '20px', marginBottom: '28px', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-accent-light)', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '4px' }}>
          ĐÁNH GIÁ THỰC NGHIỆM SƯ PHẠM
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
          Phiếu Kiểm tra & Khảo sát Năng lực
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Quy trình chuẩn hóa đánh giá năng lực tư duy không gian và trải nghiệm học tập mô phỏng 3D.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* Pre-test Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="plate-header">
              <span>ĐÁNH GIÁ ĐẦU VÀO</span>
              <span>TEST.PRE.01</span>
            </div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px', color: 'var(--color-text-primary)' }}>
              {preTest.title}
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '16px', lineHeight: 1.6 }}>
              {preTest.description}
            </p>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
              <span>{preTest.questions.length} CÂU HỎI</span>
              <span>THỜI LƯỢNG: ~15 PHÚT</span>
            </div>
          </div>
          
          <div>
            {preTestDone ? (
              <div style={{ padding: '12px 14px', background: 'rgba(5, 150, 105, 0.08)', border: '1px solid rgba(5, 150, 105, 0.2)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-emerald-light)' }}>✓ Đã hoàn thành</span>
                <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-emerald-light)' }}>
                  {results['pretest'].score} / {results['pretest'].total}
                </strong>
              </div>
            ) : (
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setView('pretest')}>
                Bắt đầu làm bài Pre-test →
              </button>
            )}
          </div>
        </div>

        {/* Post-test Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: (!preTestDone && !postTestDone) ? 0.65 : 1 }}>
          <div>
            <div className="plate-header">
              <span>ĐÁNH GIÁ ĐẦU RA</span>
              <span>TEST.POST.02</span>
            </div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px', color: 'var(--color-text-primary)' }}>
              {postTest.title}
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '16px', lineHeight: 1.6 }}>
              {postTest.description}
            </p>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
              <span>{postTest.questions.length} CÂU HỎI</span>
              <span>THỜI LƯỢNG: ~15 PHÚT</span>
            </div>
          </div>
          
          <div>
            {postTestDone ? (
              <div style={{ padding: '12px 14px', background: 'rgba(5, 150, 105, 0.08)', border: '1px solid rgba(5, 150, 105, 0.2)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-emerald-light)' }}>✓ Đã hoàn thành</span>
                <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-emerald-light)' }}>
                  {results['posttest'].score} / {results['posttest'].total}
                </strong>
              </div>
            ) : (
              <button 
                className="btn btn-primary" 
                style={{ width: '100%' }} 
                onClick={() => setView('posttest')}
                disabled={!preTestDone}
              >
                {preTestDone ? 'Bắt đầu làm bài Post-test →' : 'Yêu cầu hoàn thành Pre-test trước'}
              </button>
            )}
          </div>
        </div>

        {/* Survey Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: (!postTestDone && !surveyDone) ? 0.65 : 1 }}>
          <div>
            <div className="plate-header">
              <span>KHẢO SÁT THỰC NGHIỆM</span>
              <span>SURVEY.LIKERT.01</span>
            </div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px', color: 'var(--color-text-primary)' }}>
              {studentSurvey.title}
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '16px', lineHeight: 1.6 }}>
              Khảo sát trải nghiệm tương tác với mô phỏng toán 3D và mức độ hứng thú học tập.
            </p>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
              <span>{studentSurvey.items.length} MỤC LIKERT</span>
              <span>THỜI LƯỢNG: ~5 PHÚT</span>
            </div>
          </div>
          
          <div>
            {surveyDone ? (
              <div style={{ padding: '12px 14px', background: 'rgba(5, 150, 105, 0.08)', border: '1px solid rgba(5, 150, 105, 0.2)', borderRadius: 'var(--radius-sm)', textAlign: 'center', color: 'var(--color-emerald-light)', fontSize: '0.85rem' }}>
                ✓ Đã ghi nhận phản hồi khảo sát
              </div>
            ) : (
              <button 
                className="btn btn-primary" 
                style={{ width: '100%' }} 
                onClick={() => setView('survey')}
                disabled={!postTestDone}
              >
                {postTestDone ? 'Bắt đầu phiếu khảo sát →' : 'Yêu cầu hoàn thành Post-test trước'}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
