import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ApiError } from '../services/api';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err: any) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg(null);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh', padding: '16px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '32px' }}>
        
        <div className="plate-header">
          <span>XÁC THỰC NGƯỜI DÙNG</span>
          <span>AUTH.LOGIN</span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
            Đăng nhập Hệ thống
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Nền tảng Học liệu Mô phỏng Toán học THCS
          </p>
        </div>

        {user && (
          <div style={{ marginBottom: '20px', padding: '12px 14px', background: 'rgba(5, 150, 105, 0.08)', border: '1px solid rgba(5, 150, 105, 0.25)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
            <p style={{ color: 'var(--color-emerald-light)' }}>
              Đang đăng nhập: <strong>{user.fullName}</strong> ({user.role})
            </p>
            <button
              onClick={() => navigate('/nguoi-dung')}
              className="btn btn-ghost btn-sm"
              style={{ marginTop: '6px', color: 'var(--color-text-primary)' }}
            >
              Vào trang Cá nhân →
            </button>
          </div>
        )}

        {errorMsg && (
          <div style={{ marginBottom: '20px', padding: '12px 14px', background: 'rgba(220, 38, 38, 0.08)', border: '1px solid rgba(220, 38, 38, 0.25)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--color-rose-light)' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
              placeholder="user@math3d.vn"
              disabled={isSubmitting}
            />
          </div>

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
              placeholder="••••••••"
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '6px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang xác thực...' : 'Đăng nhập ngay'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
          Chưa có tài khoản?{' '}
          <Link to="/dang-ky" style={{ color: 'var(--color-accent-light)', fontWeight: 600, textDecoration: 'none' }}>
            Đăng ký tài khoản
          </Link>
        </div>

        {/* Demo Accounts */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '8px', textAlign: 'center' }}>
            TÀI KHOẢN MẪU THỬ NGHIỆM
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ fontFamily: 'var(--font-mono)' }}
              onClick={() => fillDemoAccount('admin@math3d.vn', 'admin1234')}
            >
              ADMIN
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ fontFamily: 'var(--font-mono)' }}
              onClick={() => fillDemoAccount('teacher@math3d.vn', 'teacher1234')}
            >
              GIÁO VIÊN
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ fontFamily: 'var(--font-mono)' }}
              onClick={() => fillDemoAccount('student@math3d.vn', 'student1234')}
            >
              HỌC SINH
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
