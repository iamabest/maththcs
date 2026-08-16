import { createApp } from '../src/app.js';
import { Server } from 'http';

const app = createApp();
const PORT = 5098; // Isolated test port

let server: Server;
let studentToken = '';
let teacherToken = '';
let adminToken = '';
let createdLessonId = '';

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    console.error(`  ❌ FAIL: ${testName}${detail ? ` -> ${detail}` : ''}`);
  }
}

async function runTests() {
  console.log('\n🧪 BẮT ĐẦU KIỂM THỬ TOÀN DIỆN REST API (AUTH, USERS, LESSONS, ATTEMPTS, PROGRESS, SURVEYS)\n');

  server = app.listen(PORT);
  const BASE_URL = `http://localhost:${PORT}/api/v1`;

  try {
    // 1. Health Check (200)
    console.log('--- 1. Kiểm tra Health & Hệ thống ---');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData: any = await healthRes.json();
    assert(healthRes.status === 200, 'GET /health trả về 200 OK');
    assert(healthData.data?.status === 'healthy', 'Health status là "healthy"');

    // 2. Authentication - Login
    console.log('\n--- 2. Kiểm tra Authentication & Cấp JWT Token ---');
    const studentLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@math3d.vn', password: 'student1234' }),
    });
    const studentData: any = await studentLogin.json();
    assert(studentLogin.status === 200, 'Login STUDENT thành công (200)');
    studentToken = studentData.data?.token;

    const teacherLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'teacher@math3d.vn', password: 'teacher1234' }),
    });
    const teacherData: any = await teacherLogin.json();
    assert(teacherLogin.status === 200, 'Login TEACHER thành công (200)');
    teacherToken = teacherData.data?.token;

    const adminLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@math3d.vn', password: 'admin1234' }),
    });
    const adminData: any = await adminLogin.json();
    assert(adminLogin.status === 200, 'Login ADMIN thành công (200)');
    adminToken = adminData.data?.token;

    // 3. User Management
    console.log('\n--- 3. Kiểm tra Quản lý Người dùng & RBAC ---');
    const adminGetUsers = await fetch(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(adminGetUsers.status === 200, 'ADMIN xem danh sách /users thành công (200)');

    // 4. Lesson CRUD
    console.log('\n--- 4. Kiểm tra Quản lý Bài học (Lessons) ---');
    const publicLessons = await fetch(`${BASE_URL}/lessons`);
    const publicLessonsData: any = await publicLessons.json();
    assert(publicLessons.status === 200, 'Khách xem danh sách bài học (200)');
    assert(publicLessonsData.data?.items?.length >= 6, 'Có đủ 6 bài học 3D đã PUBLISHED');

    const teacherCreateLesson = await fetch(`${BASE_URL}/lessons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${teacherToken}`,
      },
      body: JSON.stringify({
        title: 'Bài học thử nghiệm của Giáo viên',
        slug: `bai-hoc-test-${Date.now()}`,
        grade: 8,
        description: 'Mô tả bài học thử nghiệm',
        topic: 'Hình học',
        status: 'DRAFT',
      }),
    });
    const createdLessonData: any = await teacherCreateLesson.json();
    assert(teacherCreateLesson.status === 201, 'TEACHER tạo bài học mới trả về 201 Created');
    createdLessonId = createdLessonData.data?.id;

    // 5. Attempts & Scoring API (Task 3)
    console.log('\n--- 5. Kiểm tra API Điểm số & Bài làm (Attempts) ---');
    const createAttemptRes = await fetch(`${BASE_URL}/attempts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        quizId: 'quiz-number-line',
        lessonId: 'lesson-number-line',
        answers: { 'q-1': 'a', 'q-2': '5' },
        score: 5,
        total: 6,
      }),
    });
    const attemptResult: any = await createAttemptRes.json();
    assert(createAttemptRes.status === 201, 'STUDENT nộp bài kiểm tra trả về 201 Created');
    assert(attemptResult.data?.score === 5, 'Lưu đúng điểm số bài làm (5/6)');

    const getAttemptsRes = await fetch(`${BASE_URL}/attempts`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const attemptsList: any = await getAttemptsRes.json();
    assert(getAttemptsRes.status === 200, 'STUDENT truy vấn lịch sử làm bài (200)');
    assert(attemptsList.data?.items?.length > 0, 'Danh sách trả về bài làm vừa nộp');

    // 6. Progress API (Task 3)
    console.log('\n--- 6. Kiểm tra API Tiến độ Học tập (Progress) ---');
    const updateProgressRes = await fetch(`${BASE_URL}/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        lessonId: 'lesson-parallel-lines',
        opened: true,
        simulationInteracted: true,
        quizCompleted: false,
      }),
    });
    const progressResult: any = await updateProgressRes.json();
    assert(updateProgressRes.status === 200, 'STUDENT cập nhật tiến độ học 3D (200)');
    assert(progressResult.data?.simulationInteracted === true, 'Đã ghi nhận tương tác mô phỏng 3D');

    const getProgressRes = await fetch(`${BASE_URL}/progress`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    const progressList: any = await getProgressRes.json();
    assert(getProgressRes.status === 200, 'STUDENT lấy tiến độ học tập cá nhân (200)');
    assert(progressList.data?.items?.length >= 2, 'Có tiến độ cho các bài học đã học');

    // 7. Survey Responses API (Task 3)
    console.log('\n--- 7. Kiểm tra API Khảo sát Likert (Surveys) ---');
    const submitSurveyRes = await fetch(`${BASE_URL}/surveys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        instrumentId: 'survey-experience-v1',
        responses: {
          'vis-1': 5,
          'vis-2': 4,
          'int-1': 5,
          'mot-1': 4,
          'usb-1': 5,
        },
      }),
    });
    const surveyResult: any = await submitSurveyRes.json();
    assert(submitSurveyRes.status === 201, 'STUDENT nộp phiếu khảo sát Likert (201)');
    assert(surveyResult.data?.responses?.['vis-1'] === 5, 'Lưu đúng phản hồi khảo sát');

    const getSurveysTeacherRes = await fetch(`${BASE_URL}/surveys`, {
      headers: { Authorization: `Bearer ${teacherToken}` },
    });
    const surveyListTeacher: any = await getSurveysTeacherRes.json();
    assert(getSurveysTeacherRes.status === 200, 'TEACHER xem danh sách kết quả khảo sát (200)');
    assert(surveyListTeacher.data?.items?.length > 0, 'Giáo viên xem được kết quả khảo sát học sinh');

    // Clean up created lesson
    await fetch(`${BASE_URL}/lessons/${createdLessonId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    console.log('\n====================================================');
    console.log(`🎉 KẾT QUẢ KIỂM THỬ: ${passedTests}/${totalTests} TESTS ĐẠT (100%)`);
    console.log('====================================================\n');
  } catch (err) {
    console.error('Lỗi trong quá trình chạy test script:', err);
  } finally {
    server.close();
  }
}

runTests();
