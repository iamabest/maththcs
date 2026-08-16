# 03 — DATABASE SPECIFICATION

## Công nghệ
Supabase PostgreSQL, UUID và Row Level Security.

## Bảng
### profiles
`id UUID PK`, `role`, `full_name`, `created_at`

### classes
`id UUID PK`, `name`, `grade`, `school_year`, `teacher_id`, `created_at`

### class_members
`class_id`, `student_id`, `joined_at`

### lessons
`id UUID PK`, `grade`, `subject`, `title`, `description`, `objectives JSONB`, `content JSONB`, `published`, `created_at`

### simulations
`id UUID PK`, `lesson_id`, `slug`, `title`, `description`, `component_key`, `metadata JSONB`, `published`

### activities
`id UUID PK`, `lesson_id`, `type`, `title`, `content JSONB`, `order_index`

### questions
`id UUID PK`, `activity_id`, `type`, `content JSONB`, `answer JSONB`, `difficulty`, `competency`

### attempts
`id UUID PK`, `student_id`, `activity_id`, `score`, `started_at`, `submitted_at`

### simulation_events
`id BIGINT`, `student_id`, `simulation_id`, `event_type`, `payload JSONB`, `occurred_at`

### learning_progress
`id UUID PK`, `student_id`, `lesson_id`, `progress`, `completed`, `updated_at`

### surveys
`id UUID PK`, `respondent_type`, `anonymous_code`, `instrument_version`, `submitted_at`

### survey_responses
`id UUID PK`, `survey_id`, `item_code`, `value`

## RLS
Student chỉ đọc bài publish và dữ liệu của mình. Teacher chỉ đọc dữ liệu lớp mình. Admin quản trị theo quyền.

## Dữ liệu nghiên cứu
Tách thông tin nhận diện khỏi dataset. Xuất bằng `research_code`, không xuất tên/ID thật.

## Seed
Dữ liệu mẫu phải ghi rõ `DEMO DATA`, tuyệt đối không dùng làm dữ liệu nghiên cứu.
