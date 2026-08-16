import { useState, useEffect, useCallback } from 'react';
import type { LessonProgress, QuizAttempt } from '../types';
import {
  getAllProgress,
  getProgress,
  getAllAttempts,
  saveProgress as saveProgressStorage,
  saveAttempt as saveAttemptStorage,
} from '../lib/storage';

export function useProgress() {
  const [progressList, setProgressList] = useState<LessonProgress[]>([]);
  const [attemptsList, setAttemptsList] = useState<QuizAttempt[]>([]);

  const reload = useCallback(() => {
    setProgressList(getAllProgress());
    setAttemptsList(getAllAttempts());
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const saveProgress = useCallback(
    (progress: LessonProgress) => {
      saveProgressStorage(progress);
      reload();
    },
    [reload],
  );

  const saveAttempt = useCallback(
    (attempt: QuizAttempt) => {
      saveAttemptStorage(attempt);
      reload();
    },
    [reload],
  );

  const getLessonProgress = useCallback(
    (lessonId: string) => {
      return getProgress(lessonId);
    },
    [],
  );

  return {
    progressList,
    attemptsList,
    saveProgress,
    saveAttempt,
    getLessonProgress,
    reload,
  };
}
