import { courses as seedCourses, Course } from "@/data/seedData";

const STORAGE_KEY_COURSES = "ers_courses";

export function loadCourses(): Course[] {
  if (typeof window === "undefined") {
    return seedCourses;
  }
  const raw = localStorage.getItem(STORAGE_KEY_COURSES);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(seedCourses));
    return seedCourses;
  }
  try {
    const parsed = JSON.parse(raw) as Course[];
    if (!Array.isArray(parsed) || parsed.length === 0) return seedCourses;
    return parsed;
  } catch {
    return seedCourses;
  }
}

export function saveCourses(courses: Course[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(courses));
}
