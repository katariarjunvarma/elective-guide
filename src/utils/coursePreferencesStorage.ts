import { Course } from "@/data/seedData";
import { User } from "@/utils/authApi";

export type CoursePreferenceStatus = "pending" | "approved" | "disapproved";
export type CoursePreferenceSubmittedBy = "user" | "admin";

export interface CoursePreferenceSubmission {
  id: string;
  userId: string;
  username: string;
  name: string;
  preferences: string[]; // list of course IDs in order
  createdAt: string;
  status: CoursePreferenceStatus;
  submittedBy: CoursePreferenceSubmittedBy;
}

const STORAGE_KEY_PREFERENCES = "ers_course_preferences";

export function loadCoursePreferences(): CoursePreferenceSubmission[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY_PREFERENCES);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CoursePreferenceSubmission[];
    // Ensure backwards compatibility if older entries don't have status
    return parsed.map((p) => ({
      ...p,
      status: (p as any).status ?? "pending",
      submittedBy: ((p as any).submittedBy ?? "user") as CoursePreferenceSubmittedBy,
    }));
  } catch {
    return [];
  }
}

export function saveCoursePreferences(prefs: CoursePreferenceSubmission[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_PREFERENCES, JSON.stringify(prefs));
}

export function addCoursePreferenceSubmission(
  user: User,
  preferences: string[]
): CoursePreferenceSubmission {
  const existing = loadCoursePreferences();
  const submission: CoursePreferenceSubmission = {
    id: `pref-${Date.now()}`,
    userId: user.id,
    username: user.username || user.email || user.id,
    name: user.name,
    preferences,
    createdAt: new Date().toISOString(),
    status: "pending",
    submittedBy: "user",
  };
  existing.push(submission);
  saveCoursePreferences(existing);
  return submission;
}

export function updateCoursePreferenceStatus(id: string, status: CoursePreferenceStatus): CoursePreferenceSubmission[] {
  const prefs = loadCoursePreferences();
  const updated = prefs.map((p) => (p.id === id ? { ...p, status } : p));
  saveCoursePreferences(updated);
  return updated;
}

export function setAllCoursePreferenceStatus(status: CoursePreferenceStatus): CoursePreferenceSubmission[] {
  const prefs = loadCoursePreferences();
  const updated = prefs.map((p) => ({ ...p, status }));
  saveCoursePreferences(updated);
  return updated;
}

export function updateCoursePreferenceChoices(id: string, preferences: string[]): CoursePreferenceSubmission[] {
  const prefs = loadCoursePreferences();
  const updated = prefs.map((p) =>
    p.id === id
      ? {
          ...p,
          preferences,
          createdAt: new Date().toISOString(),
          submittedBy: "admin",
        }
      : p
  );
  saveCoursePreferences(updated);
  return updated;
}

export function deleteCoursePreferenceSubmission(id: string): CoursePreferenceSubmission[] {
  const prefs = loadCoursePreferences();
  const updated = prefs.filter((p) => p.id !== id);
  saveCoursePreferences(updated);
  return updated;
}
