import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { students } from "@/data/seedData";
import { loadCourses } from "@/utils/courseStorage";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Analytics() {
  const courseList = loadCourses();
  const hasStudents = students.length > 0;
  // Students per branch
  const branchData = students.reduce((acc, student) => {
    const existing = acc.find((item) => item.name === student.branch);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ name: student.branch, count: 1 });
    }
    return acc;
  }, [] as { name: string; count: number }[]);

  // Popular categories
  const categoryData = courseList.reduce((acc, course) => {
    const existing = acc.find((item) => item.name === course.category);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ name: course.category, count: 1 });
    }
    return acc;
  }, [] as { name: string; count: number }[]);

  // CGPA distribution
  const cgpaRanges = [
    { name: "0-5", count: 0 },
    { name: "5-6", count: 0 },
    { name: "6-7", count: 0 },
    { name: "7-8", count: 0 },
    { name: "8-9", count: 0 },
    { name: "9-10", count: 0 },
  ];

  if (hasStudents) {
    students.forEach((student) => {
      if (student.cgpa < 5) cgpaRanges[0].count++;
      else if (student.cgpa < 6) cgpaRanges[1].count++;
      else if (student.cgpa < 7) cgpaRanges[2].count++;
      else if (student.cgpa < 8) cgpaRanges[3].count++;
      else if (student.cgpa < 9) cgpaRanges[4].count++;
      else cgpaRanges[5].count++;
    });
  }

  // Career goals distribution
  const careerData = hasStudents
    ? students.reduce((acc, student) => {
        const existing = acc.find((item) => item.name === student.careerGoal);
        if (existing) {
          existing.value += 1;
        } else {
          acc.push({ name: student.careerGoal, value: 1 });
        }
        return acc;
      }, [] as { name: string; value: number }[])
    : [];

  const COLORS = [
    "hsl(var(--primary))",
    "hsl(var(--accent))",
    "hsl(var(--success))",
    "hsl(var(--warning))",
    "hsl(var(--destructive))",
    "hsl(215 70% 60%)",
    "hsl(180 60% 60%)",
  ];

  const avgCGPA = hasStudents
    ? students.reduce((sum, s) => sum + s.cgpa, 0) / students.length
    : 0;
  const avgMathScore = hasStudents
    ? students.reduce((sum, s) => sum + s.mathScore, 0) / students.length
    : 0;
  const avgCodingSkill = hasStudents
    ? students.reduce((sum, s) => sum + s.codingSkill, 0) / students.length
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Insights into student profiles and course offerings</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average CGPA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCGPA.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Across all students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Math Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgMathScore.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">Out of 100</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Coding Skill</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCodingSkill.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">Out of 100</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Students per Branch</CardTitle>
            <CardDescription>Distribution of students across branches</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={branchData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Course Categories</CardTitle>
            <CardDescription>Number of courses in each category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CGPA Distribution</CardTitle>
            <CardDescription>Student performance across CGPA ranges</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cgpaRanges}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Career Goals</CardTitle>
            <CardDescription>Student aspirations and career paths</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={careerData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="hsl(var(--primary))"
                  dataKey="value"
                >
                  {careerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
