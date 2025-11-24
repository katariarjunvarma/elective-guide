import { Course, Student } from "@/data/seedData";

export interface RecommendationResult {
  course: Course;
  matchScore: number;
  explanation: string;
}

export function generateRecommendations(
  student: Partial<Student>,
  courses: Course[]
): RecommendationResult[] {
  const results: RecommendationResult[] = [];

  for (const course of courses) {
    let score = 0;
    const reasons: string[] = [];

    // Interest match (40 points)
    const interestMatch = student.interestAreas?.some(
      (interest) => course.category === interest || course.category.includes(interest)
    );
    if (interestMatch) {
      score += 40;
      reasons.push(`matches your interest in ${course.category}`);
    }

    // Career path match (30 points)
    if (course.careerPath === student.careerGoal) {
      score += 30;
      reasons.push(`aligns with your career goal (${student.careerGoal})`);
    }

    // Difficulty alignment (30 points)
    const avgSkill = ((student.cgpa || 0) / 10 + (student.mathScore || 0) / 100 + (student.codingSkill || 0) / 100) / 3;
    const idealDifficulty = Math.round(avgSkill * 5);
    const difficultyGap = Math.abs(course.difficultyLevel - idealDifficulty);
    const difficultyScore = Math.max(0, 30 - difficultyGap * 10);
    score += difficultyScore;

    if (difficultyGap === 0) {
      reasons.push(`difficulty level perfectly matches your skill level`);
    } else if (difficultyGap === 1) {
      reasons.push(`difficulty level is well-suited to your skills`);
    }

    // CGPA bonus
    if (student.cgpa && student.cgpa >= 8.5 && course.difficultyLevel >= 4) {
      reasons.push(`your high CGPA (${student.cgpa}) makes you ready for advanced courses`);
    }

    // Time commitment consideration
    if (student.timeCommitment === "Low" && course.difficultyLevel >= 4) {
      score -= 10;
    } else if (student.timeCommitment === "High" && course.difficultyLevel >= 4) {
      score += 5;
      reasons.push(`your high time commitment fits this challenging course`);
    }

    // Normalize score to 0-100
    score = Math.min(100, Math.max(0, score));

    const explanation = `Recommended because ${reasons.join(", ")}.`;

    results.push({
      course,
      matchScore: Math.round(score),
      explanation,
    });
  }

  // Sort by match score (descending)
  results.sort((a, b) => b.matchScore - a.matchScore);

  return results;
}
