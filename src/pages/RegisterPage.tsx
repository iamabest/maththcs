import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ApiError } from '../services/api';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'TEACHER'>('STUDENT');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu nhập lại không khớp.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Mật khẩu phải có độ dài ít nhất 6 ký tự.');
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        role,
      });
      navigate('/', { replace: true });
    } catch (err: any) {
      if (err instanceof ApiError) {
        if (err.details && Array.isArray(err.details)) {
          setErrorMsg(err.details.map((d: any) => d.message).join(', '));
        } else {
          setErrorMsg(err.message);
        }
      } else {
        setErrorMsg('Đăng ký tài khoản không thành công. Vui lòng thử lại.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh', padding: '16px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '32px' }}>
        
        <div className="plate-header">
          <span>THÀNH VIÊN MỚI</span>
          <span>AUTH.REGISTER</span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
            Đăng ký Tài khoản
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Tham gia phòng thí nghiệm mô phỏng và kiểm tra năng lực
          </p>
        </div>

        {errorMsg && (
          <div style={{ marginBottom: '20px', padding: '12px 14px', background: 'rgba(220, 38, 38, 0.08)', border: '1px solid rgba(220, 38, 38, 0.25)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--color-rose-light)' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              Họ và tên
            </label>
            <input
              type="text"
              required
              className="quiz-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nguyễn Văn A"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              Địa chỉ Email
            </label>
            <input
              type="email"
              required
              className="quiz-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hocsinh@math3d.vn"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              Phân loại Vai trò
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                className={`btn ${role === 'STUDENT' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontFamily: 'var(--font-mono)' }}
                onClick={() => setRole('STUDENT')}
              >
                HỌC SINH
              </button>
              <button
                type="button"
                className={`btn ${role === 'TEACHER' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontFamily: 'var(--font-mono)' }}
                onClick={() => setRole('TEACHER')}
              >
                GIÁO VIÊN
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                Mật khẩu
              </label>
              <input
                type="password"
                required
                className="quiz-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                Nhập lại mật khẩu
              </label>
              <input
                type="password"
                required
                className="quiz-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang tạo tài khoản...' : 'Hoàn tất Đăng ký'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
          Đã có tài khoản?{' '}
          <Link to="/dang-nhap" style={{ color: 'var(--color-accent-light)', fontWeight: 600, textDecoration: 'none' }}>
            Đăng nhập
          </Link>
        </div>

      </div>
    </div>
  );
}
