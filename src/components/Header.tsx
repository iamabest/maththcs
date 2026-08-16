import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button className="menu-toggle" onClick={onMenuToggle} aria-label="Menu">
          ☰
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-accent-light)', fontWeight: 600, letterSpacing: '0.04em' }}>
            LAB.MATH3D
          </span>
          <span style={{ color: 'var(--color-border)', fontSize: '0.8rem' }}>/</span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
            Học liệu Mô phỏng Toán học THCS
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link
              to="/nguoi-dung"
              style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'inherit' }}
            >
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'var(--color-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  color: '#fff',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{user.fullName}</span>
            </Link>
            <span
              className={`badge ${
                user.role === 'ADMIN'
                  ? 'badge-danger'
                  : user.role === 'TEACHER'
                  ? 'badge-grade'
                  : 'badge-success'
              }`}
            >
              {user.role}
            </span>
            <button
              onClick={logout}
              className="btn btn-ghost"
              style={{ padding: '4px 8px', fontSize: '0.75rem', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}
              title="Đăng xuất"
            >
              Thoát
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <Link
              to="/dang-nhap"
              className="btn btn-ghost"
              style={{ padding: '5px 12px', fontSize: '0.8125rem', border: '1px solid var(--color-border)' }}
            >
              Đăng nhập
            </Link>
            <Link
              to="/dang-ky"
              className="btn btn-primary"
              style={{ padding: '5px 12px', fontSize: '0.8125rem' }}
            >
              Đăng ký
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
