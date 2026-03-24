import { useState, useCallback } from "react";

/**
 * useEnrollment — manages which courses a user is enrolled in.
 * Data is persisted in localStorage keyed by userId.
 */
export function useEnrollment(userId) {
  const key = `enrollments_${userId}`;

  const [enrolled, setEnrolled] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key) || "[]");
    } catch {
      return [];
    }
  });

  const enroll = useCallback(
    (courseId) => {
      setEnrolled((prev) => {
        if (prev.includes(courseId)) return prev;
        const next = [...prev, courseId];
        localStorage.setItem(key, JSON.stringify(next));
        return next;
      });
    },
    [key]
  );

  const isEnrolled = useCallback(
    (courseId) => enrolled.includes(courseId),
    [enrolled]
  );

  return { enrolled, enroll, isEnrolled };
}
