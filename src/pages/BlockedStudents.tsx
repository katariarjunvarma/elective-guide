import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, EyeOff, Search } from "lucide-react";
import { listStudents, unblockStudentUser, getCurrentUser, login } from "@/utils/authApi";
import { toast } from "sonner";

export default function BlockedStudents() {
  const [accounts, setAccounts] = useState(() => listStudents().filter((s) => s.isBlocked));
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmTargetId, setConfirmTargetId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setAccounts(listStudents().filter((s) => s.isBlocked));
  }, []);

  const filteredAccounts = useMemo(
    () =>
      accounts.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.email.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [accounts, searchTerm]
  );

  const refreshAccounts = () => {
    setAccounts(listStudents().filter((s) => s.isBlocked));
  };

  const openUnblockConfirm = (id: string) => {
    setConfirmTargetId(id);
    setConfirmPassword("");
    setShowPassword(false);
    setIsConfirmOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Blocked Students</h1>
          <p className="text-muted-foreground">View and manage students who are blocked from logging in</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Blocked Accounts</CardTitle>
              <CardDescription>
                {filteredAccounts.length === 0
                  ? "No blocked students"
                  : `${filteredAccounts.length} blocked student${filteredAccounts.length > 1 ? "s" : ""}`}
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAccounts.length === 0 ? (
            <p className="text-sm text-muted-foreground">There are currently no blocked student accounts.</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{s.email}</TableCell>
                      <TableCell>{s.email}</TableCell>
                      <TableCell>{s.blockReason || "Not specified"}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openUnblockConfirm(s.id)}
                        >
                          Unblock
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Admin Password</DialogTitle>
            <DialogDescription>Enter the admin password to continue.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Admin password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                variant="outline"
                onClick={() => {
                  setIsConfirmOpen(false);
                  setConfirmPassword("");
                  setConfirmTargetId(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const current = getCurrentUser();
                  if (!current || current.role !== "admin") {
                    toast.error("You must be logged in as an admin to perform this action.");
                    return;
                  }
                  if (!confirmPassword) {
                    toast.error("Please enter the admin password");
                    return;
                  }
                  const ok = login(current.email, confirmPassword, "admin");
                  if (!ok) {
                    toast.error("Incorrect admin password");
                    return;
                  }

                  if (!confirmTargetId) return;

                  unblockStudentUser(confirmTargetId);
                  toast.success("User unblocked");

                  refreshAccounts();
                  setIsConfirmOpen(false);
                  setConfirmPassword("");
                  setConfirmTargetId(null);
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
