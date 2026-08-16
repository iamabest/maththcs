import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { Layout } from '../components/Layout';
import { HomePage } from '../pages/HomePage';
import { LessonsPage } from '../pages/LessonsPage';
import { LessonDetailPage } from '../pages/LessonDetailPage';
import { DashboardPage } from '../pages/DashboardPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ExportPage } from '../pages/ExportPage';
import { AssessmentPage } from '../pages/AssessmentPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { TeacherDashboardPage } from '../pages/TeacherDashboardPage';
import { TeacherLessonManagerPage } from '../pages/TeacherLessonManagerPage';
import { UserDashboardPage } from '../pages/UserDashboardPage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="bai-hoc" element={<LessonsPage />} />
            <Route path="bai-hoc/:id" element={<LessonDetailPage />} />
            <Route path="tong-quan" element={<DashboardPage />} />
            <Route path="export" element={<ExportPage />} />
            <Route path="kiem-tra" element={<AssessmentPage />} />
            <Route path="dang-nhap" element={<LoginPage />} />
            <Route path="dang-ky" element={<RegisterPage />} />
            <Route path="nguoi-dung" element={<UserDashboardPage />} />
            <Route path="users" element={<UserDashboardPage />} />
            <Route path="gv" element={<TeacherDashboardPage />} />
            <Route path="quan-ly-bai-hoc" element={<TeacherLessonManagerPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
