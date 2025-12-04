import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<"student" | "admin">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await login(email, password, role);
    setLoading(false);
    if (!ok) {
      toast.error("Invalid credentials");
      return;
    }
    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-muted px-4 flex flex-col">
      <header className="pt-6 pb-4 flex items-center gap-2 text-primary">
        <img src="/favicon.ico" alt="Elective Recommendation System logo" className="h-8 w-8" />
        <h1 className="text-2xl font-semibold tracking-tight">Elective Recommendation System</h1>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Sign in as a student or admin to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={role} onValueChange={(val) => setRole(val as "student" | "admin")} className="w-full mb-4">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
              <TabsContent value="student" className="mt-4 text-sm text-muted-foreground">
                Use username <span className="font-semibold">user001</span> and password <span className="font-semibold">user@001</span> for student access.
              </TabsContent>
              <TabsContent value="admin" className="mt-4 text-sm text-muted-foreground">
                Use username <span className="font-semibold">adminhead</span> and password <span className="font-semibold">admin@head</span> for admin access.
              </TabsContent>
            </Tabs>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Username</Label>
                <Input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
