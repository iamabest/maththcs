import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="animate-in" style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ fontSize: '4rem', marginBottom: 16 }}>🔍</div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 12 }}>
        Không tìm thấy trang
      </h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
      </p>
      <Link to="/" className="btn btn-primary btn-lg">
        ← Về trang chủ
      </Link>
    </div>
  );
}
