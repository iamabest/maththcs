import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { lessonsApi, ApiLesson, ApiError } from '../services/api';
import { Link } from 'react-router-dom';

const AVAILABLE_SIMULATIONS = [
  { slug: 'number-line-3d', name: 'Trục số nguyên 3D (Lớp 6)' },
  { slug: 'parallel-lines', name: 'Đường thẳng song song và góc (Lớp 7)' },
  { slug: 'rectangular-prism', name: 'Hình hộp chữ nhật trong không gian (Lớp 8)' },
  { slug: 'triangular-prism', name: 'Lăng trụ đứng tam giác (Lớp 8)' },
  { slug: 'inscribed-angle', name: 'Góc nội tiếp đường tròn (Lớp 9)' },
  { slug: 'linear-function', name: 'Hàm số bậc nhất y = ax + b (Lớp 9)' },
];

export function TeacherLessonManagerPage() {
  const { isTeacher, isAdmin } = useAuth();

  const [lessons, setLessons] = useState<ApiLesson[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<ApiLesson | null>(null);

  // Form States
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formGrade, setFormGrade] = useState<number>(6);
  const [formTopic, setFormTopic] = useState('Số học');
  const [formDescription, setFormDescription] = useState('');
  const [formEstimatedTime, setFormEstimatedTime] = useState(45);
  const [formSimulationSlug, setFormSimulationSlug] = useState('number-line-3d');
  const [formObjectives, setFormObjectives] = useState('');
  const [formStatus, setFormStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');

  // Load Lessons
  const fetchLessons = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await lessonsApi.getLessons({
        page,
        limit,
        search: search.trim() || undefined,
        grade: gradeFilter ? parseInt(gradeFilter, 10) : undefined,
        status: statusFilter || undefined,
      });
      setLessons(res.items);
      setTotal(res.total);
    } catch (err: any) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Không thể tải danh sách bài học từ máy chủ.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, gradeFilter, statusFilter]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  };

  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (!selectedLesson) {
      setFormSlug(generateSlug(val));
    }
  };

  // Open Create
  const openCreateModal = () => {
    setSelectedLesson(null);
    setFormTitle('');
    setFormSlug('');
    setFormGrade(6);
    setFormTopic('Số học');
    setFormDescription('');
    setFormEstimatedTime(45);
    setFormSimulationSlug('number-line-3d');
    setFormObjectives('Nhận biết khái niệm\nThực hành thao tác mô phỏng 3D\nVận dụng giải bài tập thực tế');
    setFormStatus('DRAFT');
    setShowCreateModal(true);
  };

  // Open Edit
  const openEditModal = (lesson: ApiLesson) => {
    setSelectedLesson(lesson);
    setFormTitle(lesson.title);
    setFormSlug(lesson.slug);
    setFormGrade(lesson.grade);
    setFormTopic(lesson.topic || 'Toán học');
    setFormDescription(lesson.description || '');
    setFormEstimatedTime(lesson.estimatedTime || 45);
    setFormSimulationSlug(lesson.simulationSlug || 'number-line-3d');
    setFormObjectives(Array.isArray(lesson.objectives) ? lesson.objectives.join('\n') : '');
    setFormStatus(lesson.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT');
    setShowEditModal(true);
  };

  // Open Delete
  const openDeleteModal = (lesson: ApiLesson) => {
    setSelectedLesson(lesson);
    setShowDeleteModal(true);
  };

  // Handle Create Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const objectivesList = formObjectives
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      await lessonsApi.createLesson({
        title: formTitle.trim(),
        slug: formSlug.trim() || generateSlug(formTitle),
        grade: formGrade,
        subject: 'Toán',
        topic: formTopic.trim(),
        description: formDescription.trim(),
        estimatedTime: formEstimatedTime,
        simulationSlug: formSimulationSlug,
        objectives: objectivesList,
        status: formStatus,
        activities: [
          {
            id: `act-intro-${Date.now()}`,
            type: 'intro',
            title: 'Khởi động & Đặt vấn đề',
            content: 'Giới thiệu tình huống thực tiễn và câu hỏi gợi mở.',
          },
          {
            id: `act-explore-${Date.now()}`,
            type: 'explore',
            title: 'Khám phá Mô phỏng Không gian 3D',
            content: 'Học sinh tương tác trực tiếp với mô hình số để phát hiện quy luật.',
            simulationSlug: formSimulationSlug,
          },
          {
            id: `act-practice-${Date.now()}`,
            type: 'practice',
            title: 'Luyện tập & Kiểm chứng',
            content: 'Giải các câu hỏi trắc nghiệm và điền giá trị số.',
          },
        ],
      });

      setSuccessMsg(`Đã tạo thành công bài học: "${formTitle}"`);
      setShowCreateModal(false);
      fetchLessons();
    } catch (err: any) {
      setErrorMsg(err.message || 'Tạo bài học thất bại');
    }
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLesson) return;
    setErrorMsg(null);
    try {
      const objectivesList = formObjectives
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      await lessonsApi.updateLesson(selectedLesson.id, {
        title: formTitle.trim(),
        slug: formSlug.trim(),
        grade: formGrade,
        topic: formTopic.trim(),
        description: formDescription.trim(),
        estimatedTime: formEstimatedTime,
        simulationSlug: formSimulationSlug,
        objectives: objectivesList,
        status: formStatus,
      });

      setSuccessMsg(`Đã cập nhật bài học: "${formTitle}"`);
      setShowEditModal(false);
      fetchLessons();
    } catch (err: any) {
      setErrorMsg(err.message || 'Cập nhật bài học thất bại');
    }
  };

  // Quick Toggle Status
  const handleToggleStatus = async (lesson: ApiLesson) => {
    const nextStatus = lesson.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await lessonsApi.updateLesson(lesson.id, { status: nextStatus });
      setSuccessMsg(`Đã chuyển trạng thái bài học sang: ${nextStatus === 'PUBLISHED' ? 'ĐÃ XUẤT BẢN' : 'BẢN NHÁP'}`);
      fetchLessons();
    } catch (err: any) {
      setErrorMsg(err.message || 'Không thể đổi trạng thái bài học');
    }
  };

  // Handle Delete Submit
  const handleDeleteSubmit = async () => {
    if (!selectedLesson) return;
    setErrorMsg(null);
    try {
      await lessonsApi.deleteLesson(selectedLesson.id);
      setSuccessMsg(`Đã xóa bài học: "${selectedLesson.title}"`);
      setShowDeleteModal(false);
      fetchLessons();
    } catch (err: any) {
      setErrorMsg(err.message || 'Xóa bài học thất bại');
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;
  const canManage = isTeacher || isAdmin;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', paddingBottom: '20px', marginBottom: '24px', borderBottom: '1px solid var(--color-border)' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-accent-light)', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '4px' }}>
            HỆ THỐNG QUẢN TRỊ HỌC LIỆU SỐ
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
            Quản lý Bài học & Mô phỏng 3D
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Soạn thảo nội dung sư phạm, gán mô hình 3D, phân loại khối lớp và quản lý xuất bản học liệu.
          </p>
        </div>

        {canManage && (
          <button className="btn btn-primary" onClick={openCreateModal}>
            Soạn Bài học Mới +
          </button>
        )}
      </div>

      {/* Alerts */}
      {successMsg && (
        <div style={{ marginBottom: '16px', padding: '12px 16px', background: 'rgba(5, 150, 105, 0.1)', border: '1px solid rgba(5, 150, 105, 0.25)', borderRadius: 'var(--radius-sm)', color: 'var(--color-emerald-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
          <span>✓ {successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {errorMsg && (
        <div style={{ marginBottom: '16px', padding: '12px 16px', background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.25)', borderRadius: 'var(--radius-sm)', color: 'var(--color-rose-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', flex: 1 }}>
          <input
            type="text"
            className="quiz-input"
            style={{ maxWidth: '280px' }}
            placeholder="Tìm theo tiêu đề, chủ đề..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="quiz-input"
            style={{ width: 'auto' }}
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
          >
            <option value="">Tất cả Khối lớp</option>
            <option value="6">Khối Lớp 6</option>
            <option value="7">Khối Lớp 7</option>
            <option value="8">Khối Lớp 8</option>
            <option value="9">Khối Lớp 9</option>
          </select>

          <select
            className="quiz-input"
            style={{ width: 'auto' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tất cả Trạng thái</option>
            <option value="PUBLISHED">Đã xuất bản (PUBLISHED)</option>
            <option value="DRAFT">Bản nháp (DRAFT)</option>
          </select>

          <button className="btn btn-secondary btn-sm" onClick={fetchLessons}>
            Làm mới
          </button>
        </div>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          TỔNG SỐ: <strong>{total}</strong> BÀI HỌC
        </div>
      </div>

      {/* Lessons Table */}
      <div className="card" style={{ overflowX: 'auto', padding: '0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
              <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>BÀI HỌC</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>PHÂN PHỐI</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>MÔ PHỎNG 3D</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>TRẠNG THÁI</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>TÁC GIẢ</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                  ĐANG TRUY VẤN DỮ LIỆU BÀI HỌC...
                </td>
              </tr>
            ) : lessons.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                  [ KHÔNG TÌM THẤY BÀI HỌC NÀO ]
                </td>
              </tr>
            ) : (
              lessons.map((lesson) => (
                <tr key={lesson.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
                      {lesson.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      slug: {lesson.slug} · {lesson.estimatedTime || 45} phút
                    </div>
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span className="badge badge-grade">Lớp {lesson.grade}</span>
                      <span className="badge badge-competency">{lesson.topic || 'Toán'}</span>
                    </div>
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--color-cyan-light)' }}>
                      {lesson.simulationSlug || 'none'}
                    </span>
                  </td>

                  <td style={{ padding: '14px 16px' }}>
                    <button
                      onClick={() => canManage && handleToggleStatus(lesson)}
                      disabled={!canManage}
                      style={{ background: 'none', border: 'none', cursor: canManage ? 'pointer' : 'default', padding: 0 }}
                      title="Bấm để đổi trạng thái"
                    >
                      <span className={`badge ${lesson.status === 'PUBLISHED' ? 'badge-success' : 'badge-warning'}`}>
                        {lesson.status === 'PUBLISHED' ? 'ĐÃ XUẤT BẢN' : 'BẢN NHÁP'}
                      </span>
                    </button>
                  </td>

                  <td style={{ padding: '14px 16px', color: 'var(--color-text-secondary)', fontSize: '0.8125rem' }}>
                    {lesson.teacherName || 'Hệ thống'}
                  </td>

                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <Link
                        to={`/bai-hoc/${lesson.slug || lesson.id}`}
                        className="btn btn-secondary btn-sm"
                      >
                        Xem
                      </Link>

                      {canManage && (
                        <>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => openEditModal(lesson)}
                          >
                            Sửa
                          </button>

                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ color: 'var(--color-rose-light)', border: '1px solid rgba(220, 38, 38, 0.3)' }}
                            onClick={() => openDeleteModal(lesson)}
                          >
                            Xóa
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderTop: '1px solid var(--color-border)', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)' }}>
          <div style={{ color: 'var(--color-text-muted)' }}>
            TRANG {page} / {totalPages}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn btn-secondary btn-sm"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              ← Trước
            </button>
            <button
              className="btn btn-secondary btn-sm"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Sau →
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Create / Edit */}
      {(showCreateModal || showEditModal) && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '28px' }}>
            <div className="plate-header">
              <span>{showCreateModal ? 'SOẠN THẢO BÀI HỌC' : 'CHỈNH SỬA BÀI HỌC'}</span>
              <span>LESSON.FORM</span>
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px' }}>
              {showCreateModal ? 'Tạo Chuyên đề Bài học Mới' : `Cập nhật: ${selectedLesson?.title}`}
            </h2>

            <form onSubmit={showCreateModal ? handleCreateSubmit : handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', marginBottom: '6px', fontWeight: 600 }}>
                  Tiêu đề bài học
                </label>
                <input
                  type="text"
                  required
                  className="quiz-input"
                  value={formTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Ví dụ: Góc nội tiếp đường tròn"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', marginBottom: '6px', fontWeight: 600 }}>
                    Slug URL
                  </label>
                  <input
                    type="text"
                    required
                    className="quiz-input"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="goc-noi-tiep"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', marginBottom: '6px', fontWeight: 600 }}>
                    Khối lớp
                  </label>
                  <select
                    className="quiz-input"
                    value={formGrade}
                    onChange={(e) => setFormGrade(parseInt(e.target.value, 10))}
                  >
                    <option value={6}>Khối Lớp 6</option>
                    <option value={7}>Khối Lớp 7</option>
                    <option value={8}>Khối Lớp 8</option>
                    <option value={9}>Khối Lớp 9</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', marginBottom: '6px', fontWeight: 600 }}>
                    Chủ đề (Topic)
                  </label>
                  <input
                    type="text"
                    className="quiz-input"
                    value={formTopic}
                    onChange={(e) => setFormTopic(e.target.value)}
                    placeholder="Hình học"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', marginBottom: '6px', fontWeight: 600 }}>
                    Thời lượng (phút)
                  </label>
                  <input
                    type="number"
                    min={15}
                    max={180}
                    className="quiz-input"
                    value={formEstimatedTime}
                    onChange={(e) => setFormEstimatedTime(parseInt(e.target.value, 10))}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', marginBottom: '6px', fontWeight: 600 }}>
                  Gán Mô hình 3D
                </label>
                <select
                  className="quiz-input"
                  value={formSimulationSlug}
                  onChange={(e) => setFormSimulationSlug(e.target.value)}
                >
                  {AVAILABLE_SIMULATIONS.map((sim) => (
                    <option key={sim.slug} value={sim.slug}>
                      {sim.name} ({sim.slug})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', marginBottom: '6px', fontWeight: 600 }}>
                  Mô tả tóm tắt
                </label>
                <textarea
                  className="quiz-input"
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', marginBottom: '6px', fontWeight: 600 }}>
                  Mục tiêu năng lực (Mỗi dòng một mục tiêu)
                </label>
                <textarea
                  className="quiz-input"
                  rows={3}
                  value={formObjectives}
                  onChange={(e) => setFormObjectives(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', marginBottom: '6px', fontWeight: 600 }}>
                  Trạng thái xuất bản
                </label>
                <select
                  className="quiz-input"
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                >
                  <option value="DRAFT">Bản nháp (DRAFT)</option>
                  <option value="PUBLISHED">Đã xuất bản (PUBLISHED)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                  }}
                >
                  Hủy bỏ
                </button>
                <button type="submit" className="btn btn-primary">
                  {showCreateModal ? 'Tạo bài học' : 'Lưu cập nhật'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete */}
      {showDeleteModal && selectedLesson && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '24px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>
              Xác nhận xóa bài học?
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Bạn có chắc chắn muốn xóa bài học "{selectedLesson.title}" (Lớp {selectedLesson.grade})?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Hủy
              </button>
              <button
                className="btn btn-primary"
                style={{ backgroundColor: 'var(--color-rose)' }}
                onClick={handleDeleteSubmit}
              >
                Xác nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
