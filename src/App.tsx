import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "./pages/Dashboard";
import Recommendations from "./pages/Recommendations";
import CoursePreferences from "./pages/CoursePreferences";
import Students from "./pages/Students";
import Courses from "./pages/Courses";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCoursePreferences from "./pages/AdminCoursePreferences";
import Profile from "./pages/Profile";
import PendingUserApprovals from "./pages/PendingUserApprovals";
import BlockedStudents from "./pages/BlockedStudents";
import { useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

function RequireAuth({ children, role }: { children: JSX.Element; role?: "student" | "admin" }) {
  const { isAuthenticated, user, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return null;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <AppLayout>
                <RequireAuth role="student">
                  <Dashboard />
                </RequireAuth>
              </AppLayout>
            }
          />
          <Route
            path="/recommendations"
            element={
              <AppLayout>
                <RequireAuth role="student">
                  <Recommendations />
                </RequireAuth>
              </AppLayout>
            }
          />
          <Route
            path="/course-preferences"
            element={
              <AppLayout>
                <RequireAuth role="student">
                  <CoursePreferences />
                </RequireAuth>
              </AppLayout>
            }
          />
          <Route
            path="/students"
            element={
              <AppLayout>
                <RequireAuth role="admin">
                  <Students />
                </RequireAuth>
              </AppLayout>
            }
          />
          <Route
            path="/courses"
            element={
              <AppLayout>
                <RequireAuth>
                  <Courses />
                </RequireAuth>
              </AppLayout>
            }
          />
          <Route
            path="/analytics"
            element={
              <AppLayout>
                <RequireAuth>
                  <Analytics />
                </RequireAuth>
              </AppLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <AppLayout>
                <RequireAuth>
                  <Settings />
                </RequireAuth>
              </AppLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <AppLayout>
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              </AppLayout>
            }
          />
          <Route
            path="/admin"
            element={
              <AppLayout>
                <RequireAuth role="admin">
                  <AdminDashboard />
                </RequireAuth>
              </AppLayout>
            }
          />
          <Route
            path="/admin/course-preferences"
            element={
              <AppLayout>
                <RequireAuth role="admin">
                  <AdminCoursePreferences />
                </RequireAuth>
              </AppLayout>
            }
          />
          <Route
            path="/admin/approvals"
            element={
              <AppLayout>
                <RequireAuth role="admin">
                  <PendingUserApprovals />
                </RequireAuth>
              </AppLayout>
            }
          />
          <Route
            path="/admin/blocked-students"
            element={
              <AppLayout>
                <RequireAuth role="admin">
                  <BlockedStudents />
                </RequireAuth>
              </AppLayout>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
