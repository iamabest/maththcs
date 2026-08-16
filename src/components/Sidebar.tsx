import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user } = useAuth();
  const isTeacherOrAdmin = user?.role === 'TEACHER' || user?.role === 'ADMIN';

  return (
    <>
      <div
        className={`sidebar-overlay ${open ? 'open' : ''}`}
        onClick={onClose}
      />
      <aside className={`app-sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <h1>
            MATH 3D <span className="brand-badge">THCS</span>
          </h1>
          <p>Mô phỏng Trực quan Toán học 6-9</p>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section">Mục lục Chính</div>
          
          <NavLink
            to="/"
            end
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <span className="icon">01</span> Tổng quan Hệ thống
          </NavLink>

          <NavLink
            to="/bai-hoc"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <span className="icon">02</span> Thư viện Bài học 3D
          </NavLink>

          <NavLink
            to="/kiem-tra"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <span className="icon">03</span> Đánh giá & Khảo sát
          </NavLink>

          <NavLink
            to="/tong-quan"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <span className="icon">04</span> Tiến độ Học tập
          </NavLink>

          <div className="sidebar-section" style={{ marginTop: 16 }}>
            Khu vực Giảng dạy
          </div>

          <NavLink
            to="/gv"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <span className="icon">GV</span> Bảng Phân tích Lớp
          </NavLink>

          {isTeacherOrAdmin && (
            <NavLink
              to="/quan-ly-bai-hoc"
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="icon">QL</span> Soạn thảo & Xuất bản
            </NavLink>
          )}

          <NavLink
            to="/nguoi-dung"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <span className="icon">ND</span> {user?.role === 'ADMIN' ? 'Quản lý Tài khoản' : 'Hồ sơ Cá nhân'}
          </NavLink>

          <NavLink
            to="/export"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <span className="icon">EX</span> Xuất Dữ liệu Nghiên cứu
          </NavLink>

          <div className="sidebar-section" style={{ marginTop: 16 }}>
            Phân hệ Khối lớp
          </div>
          <NavLink to="/bai-hoc?grade=6" className="sidebar-link" onClick={onClose}>
            <span className="icon">K6</span> Khối Lớp 6 (Số nguyên)
          </NavLink>
          <NavLink to="/bai-hoc?grade=7" className="sidebar-link" onClick={onClose}>
            <span className="icon">K7</span> Khối Lớp 7 (Góc song song)
          </NavLink>
          <NavLink to="/bai-hoc?grade=8" className="sidebar-link" onClick={onClose}>
            <span className="icon">K8</span> Khối Lớp 8 (Hình không gian)
          </NavLink>
          <NavLink to="/bai-hoc?grade=9" className="sidebar-link" onClick={onClose}>
            <span className="icon">K9</span> Khối Lớp 9 (Hàm số & Góc)
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <span>THCS · CHƯƠNG TRÌNH 2018</span>
          <span>v2.1</span>
        </div>
      </aside>
    </>
  );
}
