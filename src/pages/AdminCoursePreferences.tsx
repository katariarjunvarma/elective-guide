import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  loadCoursePreferences,
  setAllCoursePreferenceStatus,
  updateCoursePreferenceChoices,
  updateCoursePreferenceStatus,
  deleteCoursePreferenceSubmission,
  CoursePreferenceSubmission,
} from "@/utils/coursePreferencesStorage";
import { loadCourses } from "@/utils/courseStorage";
import { courses as seedCourses, Course } from "@/data/seedData";
import { listStudents } from "@/utils/authApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AdminCoursePreferences() {
  const [submissions, setSubmissions] = useState<CoursePreferenceSubmission[]>(() => loadCoursePreferences());
  const [editing, setEditing] = useState<CoursePreferenceSubmission | null>(null);
  const [editingPrefs, setEditingPrefs] = useState<(string | undefined)[]>([undefined, undefined, undefined, undefined, undefined]);
  const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
  const [pendingPrefs, setPendingPrefs] = useState<string[] | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState<string | null>(null);
  const courses = useMemo(() => {
    try {
      return loadCourses();
    } catch {
      return seedCourses;
    }
  }, []);

  const courseMap = useMemo(() => {
    const map = new Map<string, string>();
    courses.forEach((c) => {
      map.set(c.id, `${c.id} - ${c.name}`);
    });
    return map;
  }, [courses]);

  const usernameMap = useMemo(() => {
    const map = new Map<string, string>();
    const students = listStudents();
    students.forEach((s) => {
      map.set(s.id, s.username || s.email || s.id);
    });
    return map;
  }, []);

  const handleApprove = (id: string) => {
    const updated = updateCoursePreferenceStatus(id, "approved");
    setSubmissions(updated);
  };

  const handleApproveAll = () => {
    const updated = setAllCoursePreferenceStatus("approved");
    setSubmissions(updated);
  };

  const handleDisapproveAll = () => {
    const updated = setAllCoursePreferenceStatus("disapproved");
    setSubmissions(updated);
  };

  const openEdit = (sub: CoursePreferenceSubmission) => {
    setEditing(sub);
    setEditingPrefs([
      sub.preferences[0],
      sub.preferences[1],
      sub.preferences[2],
      sub.preferences[3],
      sub.preferences[4],
    ]);
  };

  const updateEditingPref = (index: number, value: string) => {
    setEditingPrefs((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleSaveEdit = () => {
    if (!editing) return;
    const selected = editingPrefs.filter((p): p is string => !!p);
    const unique = Array.from(new Set(selected));
    setPendingPrefs(unique);
    setReasonDialogOpen(true);
  };

  const reasons = [
    "Student requested to change submitted preferences",
    "Student submitted previous preferences by mistake",
    "Student changed their mind about course choices",
    "Course alignment with student's profile or career goal updated",
    "Curriculum or policy change",
    "Seat availability or capacity adjustment",
    "Prerequisite or eligibility issue",
    "Other academic or administrative reason",
  ];

  const handleConfirmReason = () => {
    if (!editing || !pendingPrefs) return;
    if (!selectedReason) {
      // Simple guard: require a selection
      return;
    }
    const updated = updateCoursePreferenceChoices(editing.id, pendingPrefs);
    setSubmissions(updated);
    setReasonDialogOpen(false);
    setEditing(null);
    setPendingPrefs(null);
    setSelectedReason("");
  };

  const handleDelete = (id: string) => {
    setSubmissionToDelete(id);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Submitted Preferences</h1>
        <p className="text-muted-foreground">View and adjust students' submitted course preferences</p>
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Submissions</CardTitle>
            <CardDescription>
              {submissions.length === 0 ? "No preferences have been submitted yet" : `${submissions.length} submissions`}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Submitted At</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Preferences (in order)</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>{sub.name}</TableCell>
                    <TableCell>{usernameMap.get(sub.userId) ?? sub.username ?? sub.userId}</TableCell>
                    <TableCell>{new Date(sub.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="capitalize text-sm">{sub.submittedBy}</TableCell>
                    <TableCell>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                        {sub.preferences.map((id) => (
                          <li key={id}>{courseMap.get(id) ?? id}</li>
                        ))}
                      </ol>
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(sub)}>
                        Edit Preferences
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(sub.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {submissions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                      No preferences found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Preferences</DialogTitle>
            <DialogDescription>
              Update the top 5 course preferences for this student.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="space-y-4 mt-2">
              {editingPrefs.map((value, index) => (
                <div key={index} className="space-y-2">
                  <Label>Preference {index + 1}</Label>
                  <Select
                    value={value}
                    onValueChange={(val) => updateEditingPref(index, val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course: Course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.id} - {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          )}
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={(open) => !open && setDeleteDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Submitted Preferences</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this student's submitted preferences? They will need to submit again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setSubmissionToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!submissionToDelete) return;
                const updated = deleteCoursePreferenceSubmission(submissionToDelete);
                setSubmissions(updated);
                setDeleteDialogOpen(false);
                setSubmissionToDelete(null);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={reasonDialogOpen} onOpenChange={(open) => !open && setReasonDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reason for Updating Preferences</DialogTitle>
            <DialogDescription>
              Select the reason for modifying this student's submitted preferences.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 mt-2">
            {reasons.map((reason) => (
              <button
                key={reason}
                type="button"
                onClick={() => setSelectedReason(reason)}
                className={`w-full text-left px-3 py-2 rounded-md border text-sm ${
                  selectedReason === reason
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:bg-muted"
                }`}
              >
                {reason}
              </button>
            ))}
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setReasonDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmReason} disabled={!selectedReason}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
