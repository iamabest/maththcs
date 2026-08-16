import React, { useState, useEffect } from 'react';

interface ClassInfo {
  id: string;
  name: string;
  grade: number;
  schoolYear: string;
}

interface StudentInfo {
  id: string;
  name: string;
  joinedAt: string;
}

export function ClassManager() {
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState<number>(6);
  const [newSchoolYear, setNewSchoolYear] = useState('2023-2024');

  // Mock students
  const [students] = useState<StudentInfo[]>([
    { id: 's1', name: 'Nguyễn Văn A', joinedAt: '2023-09-05' },
    { id: 's2', name: 'Trần Thị B', joinedAt: '2023-09-05' },
    { id: 's3', name: 'Lê Hoàng C', joinedAt: '2023-09-06' },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('math3d_classes');
    if (saved) {
      try {
        setClasses(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Default demo class
      const defaultClasses = [
        { id: 'c1', name: 'Lớp 6A', grade: 6, schoolYear: '2023-2024' }
      ];
      setClasses(defaultClasses);
      localStorage.setItem('math3d_classes', JSON.stringify(defaultClasses));
    }
  }, []);

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName) return;

    const newClass: ClassInfo = {
      id: `c_${Date.now()}`,
      name: newClassName,
      grade: newClassGrade,
      schoolYear: newSchoolYear,
    };

    const updated = [...classes, newClass];
    setClasses(updated);
    localStorage.setItem('math3d_classes', JSON.stringify(updated));
    setNewClassName('');
  };

  return (
    <div className="animate-in">
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 24px 0' }}>Quản lý Lớp học</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* Create Class Form */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 16px 0' }}>Thêm lớp mới</h3>
          <form onSubmit={handleCreateClass} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', margin: '0 0 8px 0', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Tên lớp</label>
              <input 
                className="quiz-input"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="VD: 6A1"
                required
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', margin: '0 0 8px 0', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Khối</label>
                <select 
                  className="quiz-input"
                  value={newClassGrade}
                  onChange={(e) => setNewClassGrade(Number(e.target.value))}
                >
                  <option value={6}>Lớp 6</option>
                  <option value={7}>Lớp 7</option>
                  <option value={8}>Lớp 8</option>
                  <option value={9}>Lớp 9</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', margin: '0 0 8px 0', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Năm học</label>
                <input 
                  className="quiz-input"
                  value={newSchoolYear}
                  onChange={(e) => setNewSchoolYear(e.target.value)}
                  placeholder="2023-2024"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
              Tạo lớp
            </button>
          </form>
        </div>

        {/* Class List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {classes.map(c => (
            <div key={c.id} className="card glass-strong">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>{c.name}</h3>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                    Khối {c.grade} • Năm học {c.schoolYear}
                  </div>
                </div>
                <span className="badge badge-grade">{students.length} học sinh</span>
              </div>
              
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)', margin: '0 0 12px 0' }}>Danh sách học sinh (Demo)</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {students.map(s => (
                    <li key={s.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', padding: '8px', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                      <span>{s.name}</span>
                      <span style={{ color: 'var(--color-text-muted)' }}>Tham gia: {s.joinedAt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
