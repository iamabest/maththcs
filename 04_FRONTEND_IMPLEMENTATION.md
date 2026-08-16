# 04 — FRONTEND IMPLEMENTATION

## Stack
React + TypeScript + Vite + Tailwind CSS + Three.js + React Three Fiber + Drei + Supabase.

## Khởi tạo
```bash
npm create vite@latest math3d -- --template react-ts
cd math3d
npm install
npm install three @react-three/fiber @react-three/drei
npm install mathjs jsxgraph plotly.js-react
npm install @supabase/supabase-js react-router-dom
```

## Cấu trúc
```text
src/
  app/
  components/
  features/
    auth/
    lessons/
    simulations/
    quizzes/
    analytics/
  pages/
  data/
  lib/
  types/
  hooks/
  utils/
  assets/
```

## Routes
`/`, `/login`, `/dashboard`, `/lessons`, `/lessons/:id`, `/simulation/:slug`, `/quiz/:id`, `/progress`, `/teacher`, `/teacher/classes/:id`, `/research`.

## Màn hình mô phỏng
Header → mục tiêu → Canvas 3D → control panel → observation → câu hỏi → reset/fullscreen.

## Coding rules
TypeScript; Props interface; component nhỏ; custom hooks cho server state; không dùng `any` nếu không cần.

## UX
Loading, empty, error, retry, responsive, keyboard navigation.

## Testing
Smoke test component; simulation initialization; quiz scoring; auth guard; build test.

## Definition of Done
TypeScript không lỗi, build thành công, responsive, có loading/error state, test cơ bản, không có secret trong source.
