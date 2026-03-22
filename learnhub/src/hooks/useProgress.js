import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";

/**
 * useProgress — tracks per-lesson completion for a given course.
 * Data is persisted in localStorage keyed by user + course.
 */
export function useProgress(courseId) {
  const { user } = useAuth();
  const key = `progress_${user?.id}_${courseId}`;

  const load = () => {
    try {
      return JSON.parse(localStorage.getItem(key) || "{}");
    } catch {
      return {};
    }
  };

  const [completed, setCompleted] = useState(load);

  const markComplete = useCallback(
    (lessonId) => {
      setCompleted((prev) => {
        const next = { ...prev, [lessonId]: true };
        localStorage.setItem(key, JSON.stringify(next));
        return next;
      });
    },
    [key]
  );

  const isCompleted = useCallback(
    (lessonId) => !!completed[lessonId],
    [completed]
  );

  const getPercent = useCallback(
    (totalLessons) => {
      const count = Object.values(completed).filter(Boolean).length;
      return totalLessons ? Math.round((count / totalLessons) * 100) : 0;
    },
    [completed]
  );

  const completedCount = Object.values(completed).filter(Boolean).length;

  return { markComplete, isCompleted, getPercent, completedCount };
}
