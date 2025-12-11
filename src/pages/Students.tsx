import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, EyeOff } from "lucide-react";
import { students as profileStudents, Student } from "@/data/seedData";
import { toast } from "sonner";
import { listStudents, blockStudentUser, unblockStudentUser, getCurrentUser, login, createPendingUserRegistration, adminResetStudentPassword, adminUpdateStudentUsername } from "@/utils/authApi";

export default function Students() {
  const [searchTerm, setSearchTerm] = useState("");
  const [accounts, setAccounts] = useState(() => listStudents());
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmTargetId, setConfirmTargetId] = useState<string | null>(null);
  const [confirmIsBlocked, setConfirmIsBlocked] = useState<boolean | undefined>(undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedReasonKey, setSelectedReasonKey] = useState<string>("");
  const [customReason, setCustomReason] = useState("");

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [regName, setRegName] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regUniversity, setRegUniversity] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  const [isResetOpen, setIsResetOpen] = useState(false);
  const [resetAdminPassword, setResetAdminPassword] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [showResetAdmin, setShowResetAdmin] = useState(false);
  const [showResetNew, setShowResetNew] = useState(false);

  const [isUsernameOpen, setIsUsernameOpen] = useState(false);
  const [usernameAdminPassword, setUsernameAdminPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [showUsernameAdminPassword, setShowUsernameAdminPassword] = useState(false);

  const refreshAccounts = () => {
    setAccounts(listStudents());
  };

  const filteredAccounts = useMemo(
    () =>
      accounts.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.email.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [accounts, searchTerm]
  );

  const openResetPassword = () => {
    if (!selectedUser) return;
    setResetAdminPassword("");
    setResetNewPassword("");
    setShowResetAdmin(false);
    setShowResetNew(false);
    setIsResetOpen(true);
  };

  const openChangeUsername = (userId: string, currentUsername: string) => {
    setSelectedUserId(userId);
    setUsernameAdminPassword("");
    setNewUsername(currentUsername);
    setShowUsernameAdminPassword(false);
    setIsUsernameOpen(true);
  };

  const handleAddUserSubmit = async (e: React.FormEvent) => {
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

      setIsAddUserOpen(false);
      setRegName("");
      setRegNumber("");
      setRegEmail("");
      setRegUsername("");
      setRegPassword("");
      setRegUniversity("");

      toast.success("Registration submitted. Please approve it from New User Approvals.");
    } finally {
      setRegLoading(false);
    }
  };

  const handleToggleBlock = (id: string, isBlocked?: boolean) => {
    setConfirmTargetId(id);
    setConfirmIsBlocked(isBlocked);
    setConfirmPassword("");
    setShowPassword(false);
    setSelectedReasonKey("");
    setCustomReason("");
    setIsConfirmOpen(true);
  };

  const openDetails = (id: string) => {
    setSelectedUserId(id);
    setIsDetailsOpen(true);
  };

  const selectedUser = useMemo(
    () => accounts.find((u) => u.id === selectedUserId) ?? null,
    [accounts, selectedUserId]
  );

  const selectedProfile: Student | undefined = useMemo(
    () =>
      selectedUser
        ? profileStudents.find((p) => p.name === selectedUser.name)
        : undefined,
    [selectedUser]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Students Management</h1>
          <p className="text-muted-foreground">Manage student accounts and view their details</p>
        </div>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Student User</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new student account request. It will appear in the New User Approvals list.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddUserSubmit} className="space-y-4 mt-4">
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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Students</CardTitle>
              <CardDescription>Approved student accounts with login access</CardDescription>
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
            <p className="text-sm text-muted-foreground">No student accounts found.</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.map((s) => (
                    <TableRow
                      key={s.id}
                      className="cursor-pointer"
                      onClick={() => openDetails(s.id)}
                    >
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{s.username}</TableCell>
                      <TableCell>{s.email}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant={s.isBlocked ? "outline" : "default"}
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleBlock(s.id, s.isBlocked);
                            }}
                          >
                            {s.isBlocked ? "Unblock" : "Block"}
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              openChangeUsername(s.id, s.username);
                            }}
                          >
                            Edit Username
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
            {!confirmIsBlocked && (
              <div className="space-y-2">
                <Label className="mb-1 block">Reason for blocking</Label>
                <Select value={selectedReasonKey} onValueChange={setSelectedReasonKey}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple-failed-logins">Multiple failed login attempts</SelectItem>
                    <SelectItem value="misuse-features">Misuse of portal features</SelectItem>
                    <SelectItem value="temp-suspension">Temporary suspension pending investigation</SelectItem>
                    <SelectItem value="not-enrolled">Graduated / no longer enrolled</SelectItem>
                    <SelectItem value="duplicate-account">Duplicate / fake account</SelectItem>
                    <SelectItem value="other">Other (specify)</SelectItem>
                  </SelectContent>
                </Select>
                {selectedReasonKey === "other" && (
                  <Input
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Enter custom reason (required)"
                  />
                )}
              </div>
            )}
            <div className="flex justify-end gap-2 pt-1">
              <Button
                variant="outline"
                onClick={() => {
                  setIsConfirmOpen(false);
                  setConfirmPassword("");
                  setConfirmTargetId(null);
                  setSelectedReasonKey("");
                  setCustomReason("");
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

                  if (confirmIsBlocked) {
                    unblockStudentUser(confirmTargetId);
                    toast.success("User unblocked");
                  } else {
                    let finalReason = "";
                    if (selectedReasonKey === "other") {
                      finalReason = customReason.trim();
                    } else if (selectedReasonKey === "multiple-failed-logins") {
                      finalReason = "Multiple failed login attempts";
                    } else if (selectedReasonKey === "misuse-features") {
                      finalReason = "Misuse of portal features";
                    } else if (selectedReasonKey === "temp-suspension") {
                      finalReason = "Temporary suspension pending investigation";
                    } else if (selectedReasonKey === "not-enrolled") {
                      finalReason = "Graduated / no longer enrolled";
                    } else if (selectedReasonKey === "duplicate-account") {
                      finalReason = "Duplicate / fake account";
                    }

                    if (!finalReason) {
                      toast.error("Please select or enter a reason for blocking this student");
                      return;
                    }

                    blockStudentUser(confirmTargetId, finalReason);
                    toast.success("User blocked");
                  }

                  refreshAccounts();
                  setIsConfirmOpen(false);
                  setConfirmPassword("");
                  setConfirmTargetId(null);
                  setSelectedReasonKey("");
                  setCustomReason("");
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>Account and academic information</DialogDescription>
          </DialogHeader>
          {selectedUser ? (
            <div className="space-y-4 text-sm">
              <div>
                <span className="font-medium">Username: </span>
                <span>{selectedUser.email}</span>
              </div>
              <div>
                <span className="font-medium">Name: </span>
                <span>{selectedUser.name}</span>
              </div>
              <div>
                <span className="font-medium">Status: </span>
                <span>{selectedUser.isBlocked ? "Blocked" : "Active"}</span>
              </div>
              {selectedUser.isBlocked && selectedUser.blockReason && (
                <div>
                  <span className="font-medium">Block Reason: </span>
                  <span>{selectedUser.blockReason}</span>
                </div>
              )}
              <hr className="my-2" />
              <div>
                <span className="font-medium">Branch: </span>
                <span>{selectedProfile?.branch ?? "Not available"}</span>
              </div>
              <div>
                <span className="font-medium">Semester: </span>
                <span>{selectedProfile?.semester ?? "Not available"}</span>
              </div>
              <div>
                <span className="font-medium">CGPA: </span>
                <span>{selectedProfile?.cgpa?.toFixed(1) ?? "Not available"}</span>
              </div>
              <div>
                <span className="font-medium">Interests: </span>
                <span>
                  {selectedProfile?.interestAreas?.length
                    ? selectedProfile.interestAreas.join(", ")
                    : "Not available"}
                </span>
              </div>
              <div>
                <span className="font-medium">Career Goal: </span>
                <span>{selectedProfile?.careerGoal ?? "Not available"}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={openResetPassword}
              >
                Change Password
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No student selected.</p>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Change Student Password</DialogTitle>
            <DialogDescription>
              Enter the admin password to confirm and set a new password for this student.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <div>
              <Label className="mb-1 block">Admin password</Label>
              <div className="relative">
                <Input
                  type={showResetAdmin ? "text" : "password"}
                  value={resetAdminPassword}
                  onChange={(e) => setResetAdminPassword(e.target.value)}
                  placeholder="Admin password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground"
                  onClick={() => setShowResetAdmin((v) => !v)}
                >
                  {showResetAdmin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label className="mb-1 block">New student password</Label>
              <div className="relative">
                <Input
                  type={showResetNew ? "text" : "password"}
                  value={resetNewPassword}
                  onChange={(e) => setResetNewPassword(e.target.value)}
                  placeholder="New password for student"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground"
                  onClick={() => setShowResetNew((v) => !v)}
                >
                  {showResetNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                variant="outline"
                onClick={() => {
                  setIsResetOpen(false);
                  setResetAdminPassword("");
                  setResetNewPassword("");
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
                  if (!resetAdminPassword) {
                    toast.error("Please enter the admin password");
                    return;
                  }
                  if (!resetNewPassword) {
                    toast.error("Please enter a new student password");
                    return;
                  }
                  const ok = login(current.email, resetAdminPassword, "admin");
                  if (!ok) {
                    toast.error("Incorrect admin password");
                    return;
                  }
                  if (!selectedUser) return;

                  const updated = adminResetStudentPassword(selectedUser.id, resetNewPassword);
                  if (!updated) {
                    toast.error("Unable to update password");
                    return;
                  }

                  toast.success("Student password updated successfully");
                  setIsResetOpen(false);
                  setResetAdminPassword("");
                  setResetNewPassword("");
                }}
              >
                Save Password
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isUsernameOpen} onOpenChange={setIsUsernameOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Change Username</DialogTitle>
            <DialogDescription>
              Enter the admin password to confirm and set a new username for this student.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <div>
              <Label className="mb-1 block">Admin password</Label>
              <div className="relative">
                <Input
                  type={showUsernameAdminPassword ? "text" : "password"}
                  value={usernameAdminPassword}
                  onChange={(e) => setUsernameAdminPassword(e.target.value)}
                  placeholder="Admin password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground"
                  onClick={() => setShowUsernameAdminPassword((v) => !v)}
                >
                  {showUsernameAdminPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label className="mb-1 block">New username</Label>
              <Input
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="New username"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                variant="outline"
                onClick={() => {
                  setIsUsernameOpen(false);
                  setUsernameAdminPassword("");
                  setNewUsername("");
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
                  if (!usernameAdminPassword) {
                    toast.error("Please enter the admin password");
                    return;
                  }
                  if (!newUsername.trim()) {
                    toast.error("Please enter a new username");
                    return;
                  }
                  const ok = login(current.username, usernameAdminPassword, "admin");
                  if (!ok) {
                    toast.error("Incorrect admin password");
                    return;
                  }
                  if (!selectedUser) return;

                  const updated = adminUpdateStudentUsername(selectedUser.id, newUsername.trim());
                  if (!updated) {
                    toast.error("Unable to update username (it may already be in use)");
                    return;
                  }

                  toast.success("Username updated successfully");
                  refreshAccounts();
                  setIsUsernameOpen(false);
                  setUsernameAdminPassword("");
                  setNewUsername("");
                }}
              >
                Save Username
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
