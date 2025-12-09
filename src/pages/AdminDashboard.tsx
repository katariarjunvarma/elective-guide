import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { listStudents, listPendingUserRegistrations } from "@/utils/authApi";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [studentsCount, setStudentsCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    setStudentsCount(listStudents().length);
    setPendingCount(listPendingUserRegistrations().length);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage students and monitor the system</p>
        </div>
        <Button onClick={() => navigate("/students")}>
          Manage Students
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
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
      </div>
    </div>
  );
}
