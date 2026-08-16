import React, { useMemo } from 'react';
import { 
  exportProgressCSV, 
  exportAttemptsCSV, 
  exportSimulationEventsCSV 
} from '../lib/csvExport';
import { 
  getAllProgress, 
  getAllAttempts, 
  getSimulationEvents 
} from '../lib/storage';
import { 
  progressCodebook, 
  attemptsCodebook, 
  simulationEventsCodebook 
} from '../data/codebook';

export function ExportPage() {
  const progressCount = useMemo(() => Object.keys(getAllProgress()).length, []);
  const attemptsCount = useMemo(() => getAllAttempts().length, []);
  const simulationEventsCount = useMemo(() => getSimulationEvents().length, []);

  return (
    <div>
      {/* Header */}
      <div style={{ paddingBottom: '20px', marginBottom: '28px', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-accent-light)', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '4px' }}>
          TRÍCH XUẤT DỮ LIỆU THỰC NGHIỆM
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
          Xuất Dữ liệu Nghiên cứu & Từ điển Biến
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Trích xuất dữ liệu ẩn danh (mã hóa research_code) phục vụ phân tích học tập và kiểm định thống kê.
        </p>
      </div>

      {/* Export Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        
        {/* Progress Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="plate-header">
              <span>TIẾN ĐỘ BÀI HỌC</span>
              <span>CSV.PROGRESS</span>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--color-text-primary)' }}>
              Trạng thái Tiến độ
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
              Dữ liệu về thời gian mở bài, tương tác 3D và kết quả bài kiểm tra.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              <span>CẤU TRÚC: 9 CỘT</span>
              <span style={{ color: 'var(--color-accent-light)', fontWeight: 700 }}>{progressCount} BẢN GHI</span>
            </div>
          </div>
          <button className="btn btn-primary" onClick={exportProgressCSV} style={{ width: '100%' }}>
            Tải CSV Tiến độ
          </button>
        </div>

        {/* Attempts Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="plate-header">
              <span>LỊCH SỬ LÀM BÀI</span>
              <span>CSV.ATTEMPTS</span>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--color-text-primary)' }}>
              Chi tiết Bài kiểm tra
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
              Điểm số, câu trả lời từng mục, thời điểm bắt đầu và nộp bài.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              <span>CẤU TRÚC: 8 CỘT</span>
              <span style={{ color: 'var(--color-emerald-light)', fontWeight: 700 }}>{attemptsCount} BẢN GHI</span>
            </div>
          </div>
          <button className="btn btn-primary" onClick={exportAttemptsCSV} style={{ width: '100%' }}>
            Tải CSV Điểm số
          </button>
        </div>

        {/* Simulation Events Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="plate-header">
              <span>SỰ KIỆN TƯƠNG TÁC 3D</span>
              <span>CSV.SIM_EVENTS</span>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--color-text-primary)' }}>
              Nhật ký Thao tác Mô phỏng
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
              Chuỗi hành vi điều chỉnh tham số, xoay góc nhìn và kiểm chứng mô hình 3D.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              <span>CẤU TRÚC: 5 CỘT</span>
              <span style={{ color: 'var(--color-amber-light)', fontWeight: 700 }}>{simulationEventsCount} BẢN GHI</span>
            </div>
          </div>
          <button className="btn btn-primary" onClick={exportSimulationEventsCSV} style={{ width: '100%' }}>
            Tải CSV Sự kiện 3D
          </button>
        </div>

      </div>

      {/* Codebook Section */}
      <div className="card">
        <div className="plate-header">
          <span>TỪ ĐIỂN DỮ LIỆU NGHIÊN CỨU</span>
          <span>VARIABLE CODEBOOK</span>
        </div>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '20px', color: 'var(--color-text-primary)' }}>
          Đặc tả Biến & Cấu trúc Thuộc tính
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Progress Codebook */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-accent-light)', marginBottom: '10px' }}>
              1. BẢNG TIẾN ĐỘ HỌC TẬP (LEARNING PROGRESS)
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>TÊN BIẾN</th>
                    <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>KIỂU</th>
                    <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--color-text-muted)' }}>MÔ TẢ</th>
                    <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>MIỀN GIÁ TRỊ</th>
                  </tr>
                </thead>
                <tbody>
                  {progressCodebook.map((row) => (
                    <tr key={row.variable} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{row.variable}</td>
                      <td style={{ padding: '10px 12px' }}><span className="badge badge-competency">{row.type}</span></td>
                      <td style={{ padding: '10px 12px', color: 'var(--color-text-secondary)' }}>{row.description}</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>{row.possibleValues}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Attempts Codebook */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-emerald-light)', marginBottom: '10px' }}>
              2. BẢNG LỊCH SỬ LÀM BÀI (QUIZ ATTEMPTS)
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>TÊN BIẾN</th>
                    <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>KIỂU</th>
                    <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--color-text-muted)' }}>MÔ TẢ</th>
                    <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>MIỀN GIÁ TRỊ</th>
                  </tr>
                </thead>
                <tbody>
                  {attemptsCodebook.map((row) => (
                    <tr key={row.variable} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{row.variable}</td>
                      <td style={{ padding: '10px 12px' }}><span className="badge badge-competency">{row.type}</span></td>
                      <td style={{ padding: '10px 12px', color: 'var(--color-text-secondary)' }}>{row.description}</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>{row.possibleValues}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Simulation Events Codebook */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-amber-light)', marginBottom: '10px' }}>
              3. BẢNG NHẬT KÝ SỰ KIỆN MÔ PHỎNG (SIMULATION EVENTS)
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>TÊN BIẾN</th>
                    <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>KIỂU</th>
                    <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--color-text-muted)' }}>MÔ TẢ</th>
                    <th style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>MIỀN GIÁ TRỊ</th>
                  </tr>
                </thead>
                <tbody>
                  {simulationEventsCodebook.map((row) => (
                    <tr key={row.variable} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-text-primary)' }}>{row.variable}</td>
                      <td style={{ padding: '10px 12px' }}><span className="badge badge-competency">{row.type}</span></td>
                      <td style={{ padding: '10px 12px', color: 'var(--color-text-secondary)' }}>{row.description}</td>
                      <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>{row.possibleValues}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
