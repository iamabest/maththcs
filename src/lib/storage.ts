// ============================================================
// Storage Adapter — Dual Sync (localStorage + Backend API)
// ============================================================

import type { LessonProgress, QuizAttempt, SimulationEvent } from '../types';
import { attemptsApi, progressApi } from '../services/api';

const STORAGE_KEYS = {
  PROGRESS: 'math3d_progress',
  ATTEMPTS: 'math3d_attempts',
  EVENTS: 'math3d_events',
} as const;

function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// ---- Progress ----

export function getAllProgress(): LessonProgress[] {
  return getItem<LessonProgress[]>(STORAGE_KEYS.PROGRESS, []);
}

export function getProgress(lessonId: string): LessonProgress | undefined {
  return getAllProgress().find((p) => p.lessonId === lessonId);
}

export function saveProgress(progress: LessonProgress): void {
  const all = getAllProgress();
  const idx = all.findIndex((p) => p.lessonId === progress.lessonId);
  if (idx >= 0) {
    all[idx] = progress;
  } else {
    all.push(progress);
  }
  setItem(STORAGE_KEYS.PROGRESS, all);

  // Background sync to REST API
  if (localStorage.getItem('math3d_token')) {
    progressApi
      .updateProgress({
        lessonId: progress.lessonId,
        opened: progress.opened,
        simulationInteracted: progress.simulationInteracted,
        quizCompleted: progress.quizCompleted,
        quizBestScore: progress.quizBestScore,
        quizBestTotal: progress.quizBestTotal,
        completedAt: progress.completedAt,
      })
      .catch(() => {
        // Silently fallback to local storage
      });
  }
}

export function markLessonOpened(lessonId: string): void {
  const existing = getProgress(lessonId);
  saveProgress({
    lessonId,
    opened: true,
    simulationInteracted: existing?.simulationInteracted ?? false,
    quizCompleted: existing?.quizCompleted ?? false,
    quizBestScore: existing?.quizBestScore ?? null,
    quizBestTotal: existing?.quizBestTotal ?? null,
    lastAccessedAt: new Date().toISOString(),
    completedAt: existing?.completedAt ?? null,
  });
}

export function markSimulationInteracted(lessonId: string): void {
  const existing = getProgress(lessonId);
  if (existing) {
    saveProgress({
      ...existing,
      simulationInteracted: true,
      lastAccessedAt: new Date().toISOString(),
    });
  }
}

// ---- Quiz Attempts ----

export function getAllAttempts(): QuizAttempt[] {
  return getItem<QuizAttempt[]>(STORAGE_KEYS.ATTEMPTS, []);
}

export function saveAttempt(attempt: QuizAttempt): void {
  const all = getAllAttempts();
  all.push(attempt);
  setItem(STORAGE_KEYS.ATTEMPTS, all);

  // Background sync to REST API
  if (localStorage.getItem('math3d_token')) {
    attemptsApi
      .createAttempt({
        quizId: attempt.quizId,
        lessonId: attempt.lessonId,
        answers: attempt.answers,
        score: attempt.score,
        total: attempt.total,
        startedAt: attempt.startedAt,
        submittedAt: attempt.submittedAt,
      })
      .catch(() => {
        // Silently fallback to local storage
      });
  }

  // Update progress
  const existing = getProgress(attempt.lessonId);
  const pct = attempt.total > 0 ? attempt.score / attempt.total : 0;
  const bestPct =
    existing?.quizBestScore != null && existing.quizBestTotal
      ? existing.quizBestScore / existing.quizBestTotal
      : 0;

  const isNewBest = pct >= bestPct;
  const isComplete = existing?.opened && existing?.simulationInteracted;

  saveProgress({
    lessonId: attempt.lessonId,
    opened: existing?.opened ?? true,
    simulationInteracted: existing?.simulationInteracted ?? false,
    quizCompleted: true,
    quizBestScore: isNewBest ? attempt.score : (existing?.quizBestScore ?? attempt.score),
    quizBestTotal: isNewBest ? attempt.total : (existing?.quizBestTotal ?? attempt.total),
    lastAccessedAt: new Date().toISOString(),
    completedAt: isComplete ? new Date().toISOString() : (existing?.completedAt ?? null),
  });
}

// ---- Simulation Events ----

export function logSimulationEvent(event: SimulationEvent): void {
  const all = getItem<SimulationEvent[]>(STORAGE_KEYS.EVENTS, []);
  all.push(event);
  // Keep last 500 events max
  if (all.length > 500) all.splice(0, all.length - 500);
  setItem(STORAGE_KEYS.EVENTS, all);
}

export function getSimulationEvents(): SimulationEvent[] {
  return getItem<SimulationEvent[]>(STORAGE_KEYS.EVENTS, []);
}
