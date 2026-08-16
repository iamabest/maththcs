import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usersApi, ApiUser, ApiError } from '../services/api';
import { Link } from 'react-router-dom';

export function UserDashboardPage() {
  const { user: currentUser, isAdmin, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'management' | 'profile'>('management');

  // Users List State
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);

  // Form States (Create)
  const [createFullName, setCreateFullName] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createRole, setCreateRole] = useState<'ADMIN' | 'TEACHER' | 'STUDENT'>('STUDENT');
  const [createIsActive, setCreateIsActive] = useState(true);

  // Form States (Edit)
  const [editFullName, setEditFullName] = useState('');
  const [editRole, setEditRole] = useState<'ADMIN' | 'TEACHER' | 'STUDENT'>('STUDENT');
  const [editPassword, setEditPassword] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);

  // Profile Form States (Self edit)
  const [profileFullName, setProfileFullName] = useState(currentUser?.fullName || '');
  const [profilePassword, setProfilePassword] = useState('');
  const [profileConfirmPassword, setProfileConfirmPassword] = useState('');
  const [isProfileSaving, setIsProfileSaving] = useState(false);

  // Load Users List (Admin)
  const fetchUsers = useCallback(async () => {
    if (!isAdmin) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await usersApi.getUsers({
        page,
        limit,
        search: search.trim() || undefined,
        role: roleFilter || undefined,
        isActive: statusFilter === '' ? undefined : statusFilter === 'true',
      });
      setUsers(res.items);
      setTotal(res.total);
    } catch (err: any) {
      if (err instanceof ApiError) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Không thể tải danh sách người dùng. Hãy kiểm tra kết nối server.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, page, limit, search, roleFilter, statusFilter]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    } else {
      setActiveTab('profile');
    }
  }, [isAdmin, fetchUsers]);

  // Handle Create User
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      await usersApi.createUser({
        fullName: createFullName.trim(),
        email: createEmail.trim(),
        password: createPassword,
        role: createRole,
        isActive: createIsActive,
      });
      setSuccessMsg(`Đã tạo thành công tài khoản: ${createEmail}`);
      setShowCreateModal(false);
      setCreateFullName('');
      setCreateEmail('');
      setCreatePassword('');
      setCreateRole('STUDENT');
      setCreateIsActive(true);
      fetchUsers();
    } catch (err: any) {
      setErrorMsg(err.message || 'Tạo tài khoản thất bại');
    }
  };

  // Handle Edit User
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setErrorMsg(null);
    try {
      await usersApi.updateUser(selectedUser.id, {
        fullName: editFullName.trim(),
        role: editRole,
        isActive: editIsActive,
        password: editPassword ? editPassword : undefined,
      });
      setSuccessMsg(`Đã cập nhật tài khoản: ${selectedUser.email}`);
      setShowEditModal(false);
      fetchUsers();
    } catch (err: any) {
      setErrorMsg(err.message || 'Cập nhật tài khoản thất bại');
    }
  };

  // Handle Delete User
  const handleDeleteSubmit = async () => {
    if (!selectedUser) return;
    setErrorMsg(null);
    try {
      await usersApi.deleteUser(selectedUser.id);
      setSuccessMsg(`Đã xóa tài khoản: ${selectedUser.email}`);
      setShowDeleteModal(false);
      fetchUsers();
    } catch (err: any) {
      setErrorMsg(err.message || 'Xóa tài khoản thất bại');
    }
  };

  // Handle Self Profile Submit
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setErrorMsg(null);

    if (profilePassword && profilePassword !== profileConfirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsProfileSaving(true);
    try {
      await usersApi.updateUser(currentUser.id, {
        fullName: profileFullName.trim(),
        password: profilePassword ? profilePassword : undefined,
      });
      setSuccessMsg('Đã cập nhật thông tin cá nhân thành công');
      setProfilePassword('');
      setProfileConfirmPassword('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Cập nhật hồ sơ thất bại');
    } finally {
      setIsProfileSaving(false);
    }
  };

  const openEditModal = (u: ApiUser) => {
    setSelectedUser(u);
    setEditFullName(u.fullName);
    setEditRole(u.role);
    setEditIsActive(u.isActive);
    setEditPassword('');
    setShowEditModal(true);
  };

  const openDeleteModal = (u: ApiUser) => {
    setSelectedUser(u);
    setShowDeleteModal(true);
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', paddingBottom: '20px', marginBottom: '24px', borderBottom: '1px solid var(--color-border)' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-accent-light)', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '4px' }}>
            HỆ THỐNG PHÂN QUYỀN RBAC
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
            Quản trị Người dùng & Hồ sơ Cá nhân
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Quản lý tài khoản người dùng, phân quyền giáo viên và bảo mật hệ thống.
          </p>
        </div>

        {currentUser ? (
          <div className="card" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{currentUser.fullName}</div>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>{currentUser.email}</div>
            </div>
            <span className={`badge ${currentUser.role === 'ADMIN' ? 'badge-danger' : currentUser.role === 'TEACHER' ? 'badge-grade' : 'badge-success'}`}>
              {currentUser.role}
            </span>
          </div>
        ) : (
          <Link to="/dang-nhap" className="btn btn-primary">
            Đăng nhập tài khoản →
          </Link>
        )}
      </div>

      {/* Notifications */}
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

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-border)', marginBottom: '24px' }}>
        {isAdmin && (
          <button
            className={`btn btn-sm ${activeTab === 'management' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0', borderBottom: 'none' }}
            onClick={() => setActiveTab('management')}
          >
            Quản lý Tài khoản (Admin CRUD)
          </button>
        )}
        <button
          className={`btn btn-sm ${activeTab === 'profile' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0', borderBottom: 'none' }}
          onClick={() => setActiveTab('profile')}
        >
          Hồ sơ Cá nhân ({currentUser?.fullName || 'Khách'})
        </button>
      </div>

      {/* Tab 1: Admin User Management */}
      {activeTab === 'management' && isAdmin && (
        <div>
          <div className="card" style={{ padding: '16px 20px', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', flex: 1 }}>
              <input
                type="text"
                className="quiz-input"
                style={{ maxWidth: '260px' }}
                placeholder="Tìm theo tên hoặc email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="quiz-input"
                style={{ width: 'auto' }}
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="">Tất cả Vai trò</option>
                <option value="ADMIN">ADMIN</option>
                <option value="TEACHER">TEACHER</option>
                <option value="STUDENT">STUDENT</option>
              </select>

              <select
                className="quiz-input"
                style={{ width: 'auto' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tất cả Trạng thái</option>
                <option value="true">Đang hoạt động</option>
                <option value="false">Đã khóa</option>
              </select>

              <button className="btn btn-secondary btn-sm" onClick={fetchUsers}>
                Làm mới
              </button>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              Thêm Người dùng +
            </button>
          </div>

          <div className="card" style={{ overflowX: 'auto', padding: '0' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>HỌ VÀ TÊN</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>EMAIL</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>VAI TRÒ</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>TRẠNG THÁI</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>NGÀY TẠO</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                      ĐANG TRUY VẤN DANH SÁCH NGƯỜI DÙNG...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                      [ KHÔNG CÓ DỮ LIỆU ]
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: 'var(--radius-xs)', background: 'var(--color-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--color-accent-light)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                            {u.fullName.charAt(0).toUpperCase()}
                          </div>
                          <span>{u.fullName}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>{u.email}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className={`badge ${u.role === 'ADMIN' ? 'badge-danger' : u.role === 'TEACHER' ? 'badge-grade' : 'badge-success'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontSize: '0.8rem', color: u.isActive ? 'var(--color-emerald-light)' : 'var(--color-rose-light)' }}>
                          {u.isActive ? 'Hoạt động' : 'Tạm khóa'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--color-text-muted)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                        {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => openEditModal(u)}
                          >
                            Sửa
                          </button>
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ color: 'var(--color-rose-light)', border: '1px solid rgba(220, 38, 38, 0.3)' }}
                            onClick={() => openDeleteModal(u)}
                            disabled={currentUser?.id === u.id}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderTop: '1px solid var(--color-border)', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)' }}>
              <div style={{ color: 'var(--color-text-muted)' }}>
                TỔNG SỐ: {total} TÀI KHOẢN (TRANG {page}/{totalPages})
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
        </div>
      )}

      {/* Tab 2: Profile */}
      {activeTab === 'profile' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          
          {/* Identity Card */}
          <div className="card" style={{ textAlign: 'center', padding: '28px' }}>
            <div className="plate-header">
              <span>HỒ SƠ XÁC THỰC</span>
              <span>USER.ID</span>
            </div>

            <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-sm)', background: 'var(--color-accent)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)' }}>
              {currentUser?.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{currentUser?.fullName || 'Khách vãng lai'}</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '16px', fontFamily: 'var(--font-mono)' }}>{currentUser?.email || 'N/A'}</p>
            
            <div style={{ display: 'inline-block', marginBottom: '20px' }}>
              <span className={`badge ${currentUser?.role === 'ADMIN' ? 'badge-danger' : currentUser?.role === 'TEACHER' ? 'badge-grade' : 'badge-success'}`}>
                {currentUser?.role || 'Guest'}
              </span>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'var(--font-mono)' }}>
              <div>ID: {currentUser?.id || 'N/A'}</div>
              <div>NGÀY TẠO: {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</div>
            </div>

            {currentUser && (
              <button
                className="btn btn-secondary"
                style={{ width: '100%', marginTop: '20px', color: 'var(--color-rose-light)' }}
                onClick={logout}
              >
                Đăng xuất tài khoản
              </button>
            )}
          </div>

          {/* Edit Profile Form */}
          <div className="card" style={{ padding: '28px' }}>
            <div className="plate-header">
              <span>CẬP NHẬT THÔNG TIN</span>
              <span>SECURITY.SETTINGS</span>
            </div>

            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>
              Thiết lập Tài khoản
            </h2>

            {currentUser ? (
              <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8125rem', fontWeight: 600 }}>
                    Họ và tên hiển thị
                  </label>
                  <input
                    type="text"
                    required
                    className="quiz-input"
                    value={profileFullName}
                    onChange={(e) => setProfileFullName(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8125rem', fontWeight: 600 }}>
                    Địa chỉ Email (Định danh cố định)
                  </label>
                  <input
                    type="email"
                    disabled
                    className="quiz-input"
                    value={currentUser.email}
                    style={{ opacity: 0.6 }}
                  />
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', marginTop: '4px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8125rem', fontWeight: 600 }}>
                    Mật khẩu mới (Bỏ trống nếu không đổi)
                  </label>
                  <input
                    type="password"
                    className="quiz-input"
                    value={profilePassword}
                    onChange={(e) => setProfilePassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                {profilePassword && (
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8125rem', fontWeight: 600 }}>
                      Nhập lại mật khẩu mới
                    </label>
                    <input
                      type="password"
                      className="quiz-input"
                      value={profileConfirmPassword}
                      onChange={(e) => setProfileConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ alignSelf: 'flex-start', marginTop: '8px' }}
                  disabled={isProfileSaving}
                >
                  {isProfileSaving ? 'Đang lưu...' : 'Lưu cập nhật'}
                </button>
              </form>
            ) : (
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                Vui lòng đăng nhập để chỉnh sửa thông tin cá nhân.
              </p>
            )}
          </div>

        </div>
      )}

      {/* Modal: Create User */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '28px' }}>
            <div className="plate-header">
              <span>TẠO TÀI KHOẢN MỚI</span>
              <span>ADMIN.USER_NEW</span>
            </div>

            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>
              Thêm Người dùng Hệ thống
            </h2>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', marginBottom: '6px', fontWeight: 600 }}>Họ và tên</label>
                <input
                  type="text"
                  required
                  className="quiz-input"
                  value={createFullName}
                  onChange={(e) => setCreateFullName(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', marginBottom: '6px', fontWeight: 600 }}>Email</label>
                <input
                  type="email"
                  required
                  className="quiz-input"
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', marginBottom: '6px', fontWeight: 600 }}>Mật khẩu</label>
                <input
                  type="password"
                  required
                  className="quiz-input"
                  value={createPassword}
                  onChange={(e) => setCreatePassword(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', marginBottom: '6px', fontWeight: 600 }}>Vai trò (Role)</label>
                <select
                  className="quiz-input"
                  value={createRole}
                  onChange={(e) => setCreateRole(e.target.value as any)}
                >
                  <option value="STUDENT">STUDENT (Học sinh)</option>
                  <option value="TEACHER">TEACHER (Giáo viên)</option>
                  <option value="ADMIN">ADMIN (Quản trị viên)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowCreateModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  Tạo tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit User */}
      {showEditModal && selectedUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '28px' }}>
            <div className="plate-header">
              <span>SỬA TÀI KHOẢN</span>
              <span>ADMIN.USER_EDIT</span>
            </div>

            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px' }}>
              Cập nhật: {selectedUser.email}
            </h2>

            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', marginBottom: '6px', fontWeight: 600 }}>Họ và tên</label>
                <input
                  type="text"
                  required
                  className="quiz-input"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', marginBottom: '6px', fontWeight: 600 }}>Vai trò (Role)</label>
                <select
                  className="quiz-input"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as any)}
                >
                  <option value="STUDENT">STUDENT (Học sinh)</option>
                  <option value="TEACHER">TEACHER (Giáo viên)</option>
                  <option value="ADMIN">ADMIN (Quản trị viên)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', marginBottom: '6px', fontWeight: 600 }}>Trạng thái tài khoản</label>
                <select
                  className="quiz-input"
                  value={editIsActive ? 'true' : 'false'}
                  onChange={(e) => setEditIsActive(e.target.value === 'true')}
                >
                  <option value="true">Đang hoạt động</option>
                  <option value="false">Đã khóa</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', marginBottom: '6px', fontWeight: 600 }}>Đổi mật khẩu mới (Bỏ trống nếu không đổi)</label>
                <input
                  type="password"
                  className="quiz-input"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowEditModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete User */}
      {showDeleteModal && selectedUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '24px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>
              Xác nhận xóa tài khoản?
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Bạn có chắc chắn muốn xóa tài khoản <strong>"{selectedUser.fullName}"</strong> ({selectedUser.email})?
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
