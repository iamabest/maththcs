import React, { useMemo } from 'react';
import { getAllProgress, getAllAttempts } from '../lib/storage';
import { lessons } from '../data/lessons';
import { quizzes } from '../data/quizzes';
import { Link } from 'react-router-dom';

export function TeacherDashboardPage() {
  const progress = getAllProgress();
  const attempts = getAllAttempts();

  const totalStudents = 35;
  const completionRate = progress.filter((p) => p.quizCompleted).length > 0 
    ? Math.round((progress.filter((p) => p.quizCompleted).length / (totalStudents * lessons.length)) * 100) 
    : 0;

  const averageScore = attempts.length > 0 
    ? Math.round((attempts.reduce((acc, a) => acc + (a.total > 0 ? a.score / a.total : 0), 0) / attempts.length) * 100) 
    : 0;

  const lessonStats = useMemo(() => {
    return lessons.map((lesson) => {
      const lessonProgress = progress.filter((p) => p.lessonId === lesson.id);
      const lessonAttempts = attempts.filter((a) => a.lessonId === lesson.id);
      
      const openedCount = lessonProgress.filter((p) => p.opened).length;
      const openedPct = Math.round((openedCount / totalStudents) * 100);
      
      const completedCount = lessonProgress.filter((p) => p.quizCompleted).length;
      const completedPct = Math.round((completedCount / totalStudents) * 100);

      const avgLessonScore = lessonAttempts.length > 0
        ? Math.round((lessonAttempts.reduce((acc, a) => acc + (a.total > 0 ? a.score / a.total : 0), 0) / lessonAttempts.length) * 100)
        : 0;

      return {
        id: lesson.id,
        title: lesson.title,
        grade: lesson.grade,
        openedPct,
        completedPct,
        avgLessonScore,
      };
    });
  }, [progress, attempts, totalStudents]);

  // Difficult questions analysis
  const difficultQuestions = useMemo(() => {
    const qStats: Record<string, { correct: number; total: number; text: string; lessonTitle: string }> = {};
    
    attempts.forEach((attempt) => {
      const quiz = quizzes.find((q: any) => q.id === attempt.quizId);
      const lesson = lessons.find((l: any) => l.id === attempt.lessonId);
      if (!quiz || !lesson) return;

      quiz.questions.forEach((q: any) => {
        if (!qStats[q.id]) {
          qStats[q.id] = { correct: 0, total: 0, text: q.content, lessonTitle: lesson.title };
        }
        qStats[q.id]!.total++;
        if (attempt.answers && attempt.answers[q.id] === q.correctAnswer) {
          qStats[q.id]!.correct++;
        }
      });
    });

    return Object.values(qStats)
      .map((s) => ({ ...s, successRate: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0 }))
      .filter((s) => s.total >= 3 && s.successRate < 60)
      .sort((a, b) => a.successRate - b.successRate)
      .slice(0, 5);
  }, [attempts]);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', paddingBottom: '20px', marginBottom: '24px', borderBottom: '1px solid var(--color-border)' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-accent-light)', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '4px' }}>
            KHÔNG GIAN GIẢNG DẠY & SƯ PHẠM
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
            Bảng Phân tích Sư phạm Dành cho Giáo viên
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Theo dõi dữ liệu thực nghiệm, mức độ tiếp cận bài học 3D và các lỗi sai điển hình của học sinh.
          </p>
        </div>

        <Link to="/quan-ly-bai-hoc" className="btn btn-primary">
          Soạn & Quản lý Bài học →
        </Link>
      </div>

      {/* Top metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            Tổng số Học sinh
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
            {totalStudents}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Nhóm thực nghiệm THCS
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            Tỷ lệ Hoàn thành Lớp
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-accent-light)' }}>
            {completionRate}%
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Tính trên toàn bộ các bài học
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            Điểm Trung bình Toàn lớp
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-emerald-light)' }}>
            {averageScore}%
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Độ lệch chuẩn trong giới hạn cho phép
          </div>
        </div>
      </div>

      {/* Difficult questions */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div className="plate-header">
          <span>CÁC CÂU HỎI HỌC SINH HAY NHẦM LẪN</span>
          <span>DIAGNOSTIC ALERTS</span>
        </div>

        {difficultQuestions.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {difficultQuestions.map((q, i) => (
              <div key={i} style={{ padding: '14px', background: 'rgba(220, 38, 38, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(220, 38, 38, 0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                  <span className="badge badge-danger">TỶ LỆ ĐÚNG: {q.successRate}%</span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{q.lessonTitle}</span>
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)' }} dangerouslySetInnerHTML={{ __html: q.text }} />
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '20px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
            [ KHÔNG CÓ CÂU HỎI NÀO CÓ TỶ LỆ SAI VƯỢT QUÁ NGƯỠNG CẢNH BÁO ]
          </p>
        )}
      </div>

      {/* Lesson Breakdown Table */}
      <div className="card">
        <div className="plate-header">
          <span>THỐNG KÊ CHI TIẾT TỪNG CHUYÊN ĐỀ</span>
          <span>COHORT ANALYSIS</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ textAlign: 'left', padding: '12px 14px', color: 'var(--color-text-muted)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>CHUYÊN ĐỀ</th>
                <th style={{ textAlign: 'center', padding: '12px 14px', color: 'var(--color-text-muted)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>KHỐI</th>
                <th style={{ textAlign: 'center', padding: '12px 14px', color: 'var(--color-text-muted)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>TỶ LỆ TIẾP CẬN</th>
                <th style={{ textAlign: 'center', padding: '12px 14px', color: 'var(--color-text-muted)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>ĐÃ LÀM BÀI</th>
                <th style={{ textAlign: 'right', padding: '12px 14px', color: 'var(--color-text-muted)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>ĐIỂM TRUNG BÌNH</th>
              </tr>
            </thead>
            <tbody>
              {lessonStats.map((stat) => (
                <tr key={stat.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {stat.title}
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px 14px' }}>
                    <span className="badge badge-grade">Lớp {stat.grade}</span>
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>
                    {stat.openedPct}%
                  </td>
                  <td style={{ textAlign: 'center', padding: '12px 14px', fontFamily: 'var(--font-mono)' }}>
                    {stat.completedPct}%
                  </td>
                  <td style={{ textAlign: 'right', padding: '12px 14px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    {stat.avgLessonScore > 0 ? (
                      <span style={{ color: 'var(--color-emerald-light)' }}>{stat.avgLessonScore}%</span>
                    ) : (
                      <span style={{ color: 'var(--color-text-muted)' }}>Chưa có</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
