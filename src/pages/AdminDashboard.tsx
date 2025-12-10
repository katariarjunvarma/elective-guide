import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { listStudents, listPendingUserRegistrations } from "@/utils/authApi";
import { useEffect, useState } from "react";
import { courses } from "@/data/seedData";
import { loadCoursePreferences } from "@/utils/coursePreferencesStorage";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [studentsCount, setStudentsCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [blockedCount, setBlockedCount] = useState(0);
  const [preferencesCount, setPreferencesCount] = useState(0);

  const totalCourses = courses.length;

  useEffect(() => {
    const students = listStudents();
    setStudentsCount(students.length);
    setBlockedCount(students.filter((s) => s.isBlocked).length);
    setPendingCount(listPendingUserRegistrations().length);
    setPreferencesCount(loadCoursePreferences().length);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage students and monitor the system</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="cursor-pointer" onClick={() => navigate("/students")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <CardDescription>Registered student accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentsCount}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer" onClick={() => navigate("/admin/approvals")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New User Approvals</CardTitle>
            <CardDescription>Pending student access requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer" onClick={() => navigate("/courses")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <CardDescription>Elective courses available in the portal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer" onClick={() => navigate("/admin/blocked-students")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Blocked Students</CardTitle>
            <CardDescription>Students currently blocked from login</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blockedCount}</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer" onClick={() => navigate("/admin/course-preferences")}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Submitted Preferences</CardTitle>
            <CardDescription>Student course preference submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{preferencesCount}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
