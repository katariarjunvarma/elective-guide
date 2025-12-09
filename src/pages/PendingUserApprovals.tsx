import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, EyeOff } from "lucide-react";
import {
  listPendingUserRegistrations,
  approvePendingUserRegistration,
  rejectPendingUserRegistration,
  PendingUserRegistration,
  getCurrentUser,
  login,
} from "@/utils/authApi";
import { toast } from "sonner";

export default function PendingUserApprovals() {
  const [pendingUsers, setPendingUsers] = useState<PendingUserRegistration[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmTargetId, setConfirmTargetId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setPendingUsers(listPendingUserRegistrations());
  }, []);

  const openConfirm = (id: string, action: "approve" | "reject") => {
    setConfirmTargetId(id);
    setConfirmAction(action);
    setConfirmPassword("");
    setShowPassword(false);
    setIsConfirmOpen(true);
  };

  const handleApprove = (id: string) => {
    openConfirm(id, "approve");
  };

  const handleReject = (id: string) => {
    openConfirm(id, "reject");
  };

  const handleConfirm = () => {
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
    if (!confirmTargetId || !confirmAction) return;

    if (confirmAction === "approve") {
      const user = approvePendingUserRegistration(confirmTargetId);
      if (!user) {
        toast.error("Unable to approve user");
      } else {
        toast.success(`Approved ${user.name} as student`);
      }
    } else {
      rejectPendingUserRegistration(confirmTargetId);
      toast.success("Registration request rejected");
    }

    setPendingUsers(listPendingUserRegistrations());
    setIsConfirmOpen(false);
    setConfirmPassword("");
    setConfirmTargetId(null);
    setConfirmAction(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">New User Approvals</h1>
          <p className="text-muted-foreground">Review and approve or reject new student account requests</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pending Registrations</CardTitle>
              <CardDescription>
                {pendingUsers.length === 0
                  ? "No pending registrations"
                  : `${pendingUsers.length} registration${pendingUsers.length > 1 ? "s" : ""} awaiting review`}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {pendingUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground">There are currently no pending user registration requests.</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Reg. Number</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>University</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell>{u.registrationNumber}</TableCell>
                      <TableCell>{u.username}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.university}</TableCell>
                      <TableCell>
                        <Badge variant={u.status === "pending" ? "outline" : "default"}>{u.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" onClick={() => handleApprove(u.id)} disabled={u.status !== "pending"}>
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(u.id)}
                            disabled={u.status !== "pending"}
                          >
                            Reject
                          </Button>
                        </div>
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
                  setConfirmAction(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleConfirm}>Confirm</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
