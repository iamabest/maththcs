# MASTER PROMPT — MATH3D THCS
## Hệ thống mô phỏng tương tác 3D trong dạy học Toán THCS

### 1. Mục tiêu
Xây dựng một web app phục vụ đề tài:
**“Nghiên cứu xây dựng hệ thống mô phỏng tương tác 3D trong dạy học Toán THCS theo định hướng phát triển năng lực và chuyển đổi số.”**

Mục tiêu là tạo một hệ thống có giá trị đồng thời về:
- học liệu số;
- mô phỏng toán học tương tác;
- đánh giá học tập;
- learning analytics;
- nghiên cứu thực nghiệm;
- kiến trúc phần mềm có thể mở rộng.

Ưu tiên **0 đồng ở giai đoạn nghiên cứu cá nhân**, sử dụng free tier hiện hành và mã nguồn mở. Không sử dụng dịch vụ AI trả phí nếu không cần.

---

## 2. Kiến trúc chính thức

```text
                 React + TypeScript
                         |
                 Three.js / R3F
                         |
                    HTTPS / REST
                         |
                 Node.js + Express
                         |
                    Prisma ORM
                         |
              Supabase PostgreSQL
                 /       |       \
              Auth    Database   Storage
```

### Hạ tầng

| Thành phần | Công nghệ |
|---|---|
| Frontend | React + TypeScript + Vite |
| UI | Tailwind CSS |
| 3D | Three.js + React Three Fiber + Drei |
| Backend | Node.js + Express + TypeScript |
| REST API | Express |
| ORM | Prisma |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| File storage | Supabase Storage khi cần |
| Source | GitHub |
| Frontend hosting | Vercel hoặc static hosting tương đương |
| Backend hosting | Render hoặc Node.js hosting có free tier phù hợp |
| Phân tích | Python + pandas + scipy + statsmodels |

Free tier có thể thay đổi; khi deploy chính thức phải kiểm tra quota và pricing hiện hành của nhà cung cấp.

**Frontend không truy cập PostgreSQL trực tiếp.**

Luồng dữ liệu:

```text
React
 -> REST API
 -> Express
 -> Controller
 -> Service
 -> Repository
 -> Prisma
 -> PostgreSQL
```

---

# 3. Cấu trúc project

```text
math3d-thcs/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── lessons/
│   │   │   ├── simulations/
│   │   │   ├── quizzes/
│   │   │   ├── progress/
│   │   │   └── analytics/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── utils/
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── validators/
│   │   ├── lib/
│   │   └── utils/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   └── package.json
├── research/
│   ├── instruments/
│   ├── datasets/
│   ├── codebook/
│   └── analysis/
├── docs/
├── .env.example
├── .gitignore
└── README.md
```

---

# 4. Database

Sử dụng PostgreSQL + Prisma.

## User

```prisma
enum UserRole {
  ADMIN
  TEACHER
  STUDENT
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  fullName  String
  role      UserRole @default(STUDENT)
  avatarUrl String?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  lessons Lesson[]

  @@map("users")
}
```

## Lesson

```prisma
enum LessonStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

model Lesson {
  id          String       @id @default(uuid())
  title       String
  slug        String       @unique
  description String?
  grade       Int
  subject     String       @default("Toán")
  objectives  Json?
  content     Json?
  status      LessonStatus @default(DRAFT)

  teacherId String
  teacher   User @relation(fields: [teacherId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([grade])
  @@index([teacherId])
  @@index([status])
  @@map("lessons")
}
```

Mở rộng sau MVP:

```text
users
classes
class_members
lessons
simulations
activities
questions
assignments
attempts
learning_progress
simulation_events
surveys
survey_responses
```

Không lưu file `.glb`, video lớn hoặc tài nguyên nặng trực tiếp trong PostgreSQL. Database chỉ lưu metadata và URL.

---

# 5. Authentication và phân quyền

Dùng Supabase Auth.

Luồng:

```text
React
 -> Supabase Auth
 -> JWT
 -> Express middleware
 -> Verify token
 -> Load user
 -> RBAC
```

### ADMIN
Toàn quyền.

### TEACHER
- Quản lý lesson của mình.
- Quản lý lớp được phân công.
- Xem tiến độ học sinh thuộc lớp.
- Xem analytics được phép.

### STUDENT
- Xem lesson đã publish.
- Làm activity/quiz.
- Xem tiến độ cá nhân.
- Không xem dữ liệu học sinh khác.

Không chỉ ẩn nút ở frontend; quyền phải được kiểm tra ở backend.

---

# 6. REST API

Base URL:

```text
/api/v1
```

## User CRUD

```text
POST   /api/v1/users
GET    /api/v1/users
GET    /api/v1/users/:id
PATCH  /api/v1/users/:id
DELETE /api/v1/users/:id
```

Hỗ trợ:

```text
?page=1
&limit=20
&search=
&role=
&isActive=
```

Không cho client tự tạo ADMIN.

Nếu dùng Supabase Auth, không lưu password trong bảng `users`.

## Lesson CRUD

```text
POST   /api/v1/lessons
GET    /api/v1/lessons
GET    /api/v1/lessons/:id
PATCH  /api/v1/lessons/:id
DELETE /api/v1/lessons/:id
```

Hỗ trợ:

```text
?grade=9
&status=PUBLISHED
&search=đường tròn
```

Teacher chỉ sửa/xóa lesson của mình; Admin có toàn quyền; Student chỉ đọc lesson được phép.

## Các API mở rộng

```text
/api/v1/classes
/api/v1/students
/api/v1/simulations
/api/v1/activities
/api/v1/questions
/api/v1/assignments
/api/v1/attempts
/api/v1/progress
/api/v1/analytics
/api/v1/research
```

Response thành công:

```json
{
  "success": true,
  "data": {}
}
```

Response lỗi:

```json
{
  "success": false,
  "error": {
    "code": "LESSON_NOT_FOUND",
    "message": "Không tìm thấy bài học"
  }
}
```

Sử dụng HTTP status đúng: `200, 201, 204, 400, 401, 403, 404, 409, 422, 500`.

---

# 7. Backend architecture

Không viết route truy vấn Prisma trực tiếp.

Bắt buộc:

```text
Route
 -> Middleware
 -> Controller
 -> Service
 -> Repository
 -> Prisma
 -> PostgreSQL
```

Dùng:
- Zod cho validation.
- Helmet.
- CORS.
- Rate limiting khi phù hợp.
- Error middleware tập trung.
- Logging.
- JWT verification.
- RBAC.

---

# 8. Frontend CRUD

## Users

```text
/users
/users/new
/users/:id
/users/:id/edit
```

Có:
- danh sách;
- search;
- filter;
- pagination;
- create;
- edit;
- detail;
- deactivate;
- delete theo quyền.

## Lessons

```text
/lessons
/lessons/new
/lessons/:id
/lessons/:id/edit
```

Có:
- danh sách;
- filter khối;
- search;
- draft/published;
- create;
- edit;
- preview;
- publish;
- archive;
- delete.

Frontend chỉ gọi Express REST API.

---

# 9. 3D Simulation Engine

Công nghệ:

```text
Three.js
React Three Fiber
Drei
```

Mỗi simulation độc lập:

```text
src/features/simulations/
└── angle-inscribed/
    ├── index.tsx
    ├── config.ts
    ├── model.ts
    ├── controls.ts
    ├── questions.ts
    └── metadata.ts
```

Mỗi mô phỏng phải có:
1. mục tiêu toán học;
2. mô hình toán;
3. biến điều khiển;
4. tương tác;
5. quan sát;
6. câu hỏi;
7. reset;
8. kiểm chứng;
9. metadata;
10. fallback 2D hoặc chế độ nhẹ nếu thiết bị yếu.

Không dùng 3D chỉ để trang trí.

---

# 10. MVP 3 mô phỏng

## Lớp 6 — Trục số nguyên

Học sinh kéo điểm và quan sát:
- vị trí;
- số đối;
- so sánh;
- khoảng cách.

## Lớp 8 — Hình hộp chữ nhật

Điều chỉnh chiều dài, rộng, cao; quan sát:
- diện tích;
- thể tích;
- đường chéo.

## Lớp 9 — Góc nội tiếp

Di chuyển điểm trên đường tròn và quan sát quan hệ giữa góc nội tiếp và cung bị chắn.

MVP chỉ triển khai 3 mô phỏng trước. Sau khi ổn định mới mở rộng 20–30 mô phỏng.

---

# 11. Thiết kế học liệu

Mỗi lesson:

```text
Mục tiêu
Kiến thức nền
Khởi động
Nhiệm vụ khám phá
Mô phỏng
Câu hỏi dẫn dắt
Dự đoán
Kiểm chứng
Kết luận
Luyện tập
Vận dụng
Đánh giá
```

Chu trình:

```text
Dự đoán
 -> Thao tác
 -> Quan sát
 -> Giải thích
 -> Kiểm chứng
 -> Khái quát
 -> Vận dụng
```

Gắn mỗi hoạt động với năng lực:
- tư duy và lập luận toán học;
- giải quyết vấn đề;
- mô hình hóa;
- giao tiếp toán học;
- sử dụng công cụ và phương tiện học toán;
- năng lực số.

---

# 12. Learning Analytics

Chỉ ghi event có ý nghĩa:

```text
lesson_open
simulation_open
parameter_change
question_answer
quiz_start
quiz_submit
lesson_complete
```

Không ghi event theo từng frame.

Ví dụ:

```json
{
  "simulationId": "xxx",
  "eventType": "parameter_change",
  "payload": {
    "parameter": "radius",
    "from": 5,
    "to": 8
  }
}
```

Có dashboard:
- số học sinh;
- tiến độ;
- điểm;
- câu hỏi khó;
- thời gian học;
- mức sử dụng simulation.

---

# 13. Nghiên cứu thực nghiệm

Khuyến nghị thiết kế quasi-experimental pretest-posttest:

```text
Nhóm thực nghiệm
 -> Pre-test
 -> Học với mô phỏng
 -> Post-test

Nhóm đối chứng
 -> Pre-test
 -> Phương án dạy đối chứng
 -> Post-test
```

Phân tích:
- Mean;
- SD;
- Median;
- t-test/Wilcoxon;
- ANCOVA khi phù hợp;
- Cohen's d/Hedges' g;
- CI 95%;
- correlation/regression khi đủ dữ liệu.

Không p-hacking. Không bịa dữ liệu, p-value hoặc kết quả khảo sát.

Tách thông tin nhận diện khỏi dataset nghiên cứu. Dùng mã như `ST001`.

---

# 14. Deployment

## Supabase

1. Tạo project.
2. Lấy PostgreSQL connection string.
3. Cấu hình Prisma.
4. Chạy migration.
5. Seed dữ liệu DEMO.
6. Cấu hình Auth.
7. Cấu hình Storage nếu cần.
8. Kiểm tra RLS.

## Backend

Deploy thư mục `server` lên nền tảng Node.js có free tier phù hợp.

Health check:

```text
GET /api/v1/health
```

Response:

```json
{
  "success": true,
  "message": "API is running"
}
```

## Frontend

Deploy thư mục `client` lên Vercel hoặc static hosting tương đương.

Environment:

```env
VITE_API_URL=https://your-api-domain
```

Backend environment:

```env
PORT=5000
DATABASE_URL=...
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

`SUPABASE_SERVICE_ROLE_KEY` chỉ được dùng server-side.

Không commit `.env`.

---

# 15. MVP Backlog

## Phase 1
- [ ] Repository.
- [ ] React.
- [ ] Express.
- [ ] TypeScript.
- [ ] Prisma.
- [ ] Supabase.
- [ ] Environment.
- [ ] README.

## Phase 2
- [ ] Database.
- [ ] Migration.
- [ ] Seed.
- [ ] Auth.
- [ ] RBAC.

## Phase 3
- [ ] User CRUD.
- [ ] Lesson CRUD.
- [ ] API testing.
- [ ] Validation.
- [ ] Error handling.

## Phase 4
- [ ] Admin UI.
- [ ] User management.
- [ ] Lesson management.

## Phase 5
- [ ] 3D engine.
- [ ] 3 simulations.
- [ ] 3 lessons.

## Phase 6
- [ ] Quiz.
- [ ] Progress.
- [ ] Analytics.
- [ ] Dashboard.

## Phase 7
- [ ] Pre-test.
- [ ] Post-test.
- [ ] Survey.
- [ ] Research export.
- [ ] Python analysis.

## Phase 8
- [ ] Production deployment.
- [ ] Security audit.
- [ ] Performance test.
- [ ] Pilot.

---

# 16. Definition of Done

MVP chỉ hoàn thành khi:

- User CRUD hoạt động.
- Lesson CRUD hoạt động.
- Authentication hoạt động.
- RBAC hoạt động.
- REST API hoạt động.
- PostgreSQL hoạt động.
- Prisma migration hoạt động.
- API được test.
- Frontend gọi API production.
- Có ít nhất 3 mô phỏng.
- Có ít nhất 3 lesson.
- Có quiz.
- Có lưu tiến độ.
- Có analytics.
- Có dashboard giáo viên.
- Deploy thành công.
- Không có secret trong GitHub.
- Có README.
- Có tài liệu nghiên cứu.

---

# 17. Quy tắc AI Coding Agent

Không được:
- xây toàn bộ trong một lần;
- bịa API;
- bịa dữ liệu nghiên cứu;
- commit secret;
- bỏ qua validation;
- bỏ qua authorization;
- cho học sinh truy cập dữ liệu học sinh khác;
- đưa service-role key vào frontend;
- ghi analytics theo từng frame.

Phải:
- đọc code trước khi sửa;
- làm từng phase;
- test từng phase;
- tạo migration khi thay đổi schema;
- kiểm tra permission;
- kiểm tra responsive;
- kiểm tra hiệu năng;
- ghi rõ file đã tạo/sửa;
- báo lỗi và nguyên nhân nếu có.

---

# 18. Prompt khởi động cho AI

```text
Đọc toàn bộ file MASTER_Math3D_THCS_Express_Supabase_REST.md.

Chưa viết code ngay.

Hãy:
1. Phân tích yêu cầu.
2. Xác nhận kiến trúc React → Express REST API → Prisma → Supabase PostgreSQL.
3. Thiết kế ERD.
4. Thiết kế API contract.
5. Thiết kế cấu trúc thư mục.
6. Liệt kê dependency.
7. Lập kế hoạch triển khai theo phase.
8. Chỉ ra rủi ro và giả định.

Sau đó chờ lệnh TIẾN HÀNH PHASE 1.
```

## Phase 1

```text
TIẾN HÀNH PHASE 1 — FOUNDATION + DATABASE.

Tạo monorepo client/server.
Thiết lập React TypeScript Vite.
Thiết lập Express TypeScript.
Thiết lập Prisma.
Kết nối Supabase PostgreSQL.
Tạo schema User và Lesson cùng các bảng MVP cần thiết.
Tạo migration và seed DEMO.
Không tạo dữ liệu nghiên cứu giả.

Sau khi xong:
- chạy build;
- kiểm tra migration;
- kiểm tra Prisma;
- báo cáo file đã tạo/sửa;
- báo cáo lỗi nếu có.
```

## Phase 2

```text
TIẾN HÀNH PHASE 2 — AUTH + REST API.

Triển khai Supabase Auth verification.
Triển khai JWT middleware.
Triển khai RBAC ADMIN/TEACHER/STUDENT.
Triển khai đầy đủ User CRUD và Lesson CRUD.
Thêm validation, pagination, search, filter, error handling, CORS và Helmet.

Sau đó tạo collection test API và kiểm tra:
200, 201, 204, 400, 401, 403, 404, 409, 422.
```

## Phase 3

```text
TIẾN HÀNH PHASE 3 — ADMIN FRONTEND.

Tạo Login.
Tạo User Management.
Tạo Lesson Management.
Có CRUD, search, filter, pagination, loading, empty state, error state và permission-based UI.

Frontend chỉ gọi Express REST API.
```

## Phase 4

```text
TIẾN HÀNH PHASE 4 — 3D ENGINE.

Tạo framework mô phỏng có thể mở rộng.
Triển khai:
1. Trục số nguyên.
2. Hình hộp chữ nhật.
3. Góc nội tiếp.

Mỗi mô phỏng phải có mục tiêu, biến, tương tác, reset, quan sát, câu hỏi dẫn dắt và metadata.
```

## Phase 5

```text
TIẾN HÀNH PHASE 5 — LEARNING + RESEARCH.

Tạo lesson player, activity, quiz, scoring, progress, analytics, pre-test, post-test, survey, codebook và CSV export.

Không tạo dữ liệu thực nghiệm giả.
```

## Phase 6

```text
TIẾN HÀNH PHASE 6 — DEPLOY.

Deploy:
- Supabase PostgreSQL/Auth/Storage.
- Express REST API.
- React frontend.

Kiểm tra:
- authentication;
- RBAC;
- CRUD;
- CORS;
- production database;
- API;
- 3D;
- mobile;
- security;
- environment variables.

Không kết luận deploy thành công nếu chưa thực sự kiểm tra endpoint production.
```

---

# 19. Kết luận

Kiến trúc mục tiêu:

```text
React
+ TypeScript
+ Vite
+ Tailwind
+ Three.js
+ React Three Fiber
        ↓ REST
Node.js
+ Express
+ TypeScript
+ Zod
+ Prisma
        ↓
Supabase
+ PostgreSQL
+ Auth
+ Storage
```

Mục tiêu cuối cùng không phải chỉ là một website 3D mà là:

**Nền tảng học liệu số + mô phỏng tương tác + đánh giá + learning analytics + dữ liệu nghiên cứu.**

Mọi quyết định công nghệ phải phục vụ mục tiêu giáo dục và nghiên cứu. Mọi kết luận nghiên cứu phải dựa trên dữ liệu thực tế.
