import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createPendingUserRegistration } from "@/utils/authApi";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<"student" | "admin">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [regName, setRegName] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regUniversity, setRegUniversity] = useState("");
  const [regLoading, setRegLoading] = useState(false);

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

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!regUniversity) {
      toast.error("Please select a university");
      return;
    }

    setRegLoading(true);
    try {
      createPendingUserRegistration({
        name: regName,
        registrationNumber: regNumber,
        email: regEmail,
        username: regUsername,
        password: regPassword,
        university: regUniversity,
      });

      setIsRegisterOpen(false);
      setRegName("");
      setRegNumber("");
      setRegEmail("");
      setRegUsername("");
      setRegPassword("");
      setRegUniversity("");

      toast.success("Registration submitted. Please wait for admin approval before logging in.");
    } finally {
      setRegLoading(false);
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

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full mt-2">
                    Add User / Request Access
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Student Registration Request</DialogTitle>
                    <DialogDescription>
                      Fill in the details below to request a new student account. Your request will be
                      reviewed by an admin.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleRegisterSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-name">Name</Label>
                      <Input
                        id="reg-name"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-number">Registration Number</Label>
                      <Input
                        id="reg-number"
                        value={regNumber}
                        onChange={(e) => setRegNumber(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <Input
                        id="reg-email"
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-username">Username</Label>
                      <Input
                        id="reg-username"
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <Input
                        id="reg-password"
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>University</Label>
                      <Select value={regUniversity} onValueChange={setRegUniversity}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your university" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lovely-professional-university">
                            <div className="flex items-center gap-2">
                              <img
                                src="/lpu-logo.png"
                                alt="Lovely Professional University logo"
                                className="h-5 w-5 rounded-full"
                              />
                              <span>Lovely Professional University</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full" disabled={regLoading}>
                      {regLoading ? "Submitting..." : "Submit Request"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
