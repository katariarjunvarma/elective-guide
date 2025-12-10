import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { courses as seedCourses, Course } from "@/data/seedData";
import { loadCourses } from "@/utils/courseStorage";
import { addCoursePreferenceSubmission, loadCoursePreferences, CoursePreferenceSubmission } from "@/utils/coursePreferencesStorage";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function CoursePreferences() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [existingSubmission, setExistingSubmission] = useState<CoursePreferenceSubmission | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const allCourses: Course[] = useMemo(() => {
    try {
      return loadCourses();
    } catch {
      return seedCourses;
    }
  }, []);

  const [prefs, setPrefs] = useState<(string | undefined)[]>([undefined, undefined, undefined, undefined, undefined]);

  if (!user) {
    return null;
  }

  useEffect(() => {
    if (!user) return;
    const allPrefs = loadCoursePreferences();
    const mine = allPrefs.find((p) => p.userId === user.id);
    if (mine) {
      setExistingSubmission(mine);
      const initialPrefs: (string | undefined)[] = [
        mine.preferences[0],
        mine.preferences[1],
        mine.preferences[2],
        mine.preferences[3],
        mine.preferences[4],
      ];
      setPrefs(initialPrefs);
    }
  }, [user]);

  const handleChange = (index: number, courseId: string) => {
    if (existingSubmission) return;
    setPrefs((prev) => {
      const next = [...prev];
      next[index] = courseId;
      return next;
    });
  };

  const handleSubmit = () => {
    if (existingSubmission) {
      toast.error("You have already submitted your preferences");
      return;
    }

    const selected = prefs.filter((p): p is string => !!p);
    const unique = Array.from(new Set(selected));

    if (unique.length === 0) {
      toast.error("Please select at least one course preference");
      return;
    }

    setSaving(true);
    try {
      const submission = addCoursePreferenceSubmission(user as any, unique);
      setExistingSubmission(submission);
      toast.success("Preferences submitted successfully");
    } catch {
      toast.error("Failed to submit preferences");
    } finally {
      setSaving(false);
    }
  };

  const remainingOptions = (currentIndex: number) => {
    const chosen = new Set(prefs.filter(Boolean) as string[]);
    return allCourses.filter((course) => !chosen.has(course.id) || prefs[currentIndex] === course.id);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Select Course Preferences</h1>
        <p className="text-muted-foreground">
          Choose up to 5 courses in order of preference. These preferences will be visible to your administrator.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top 5 Preferences</CardTitle>
          <CardDescription>
            {existingSubmission
              ? "You have already submitted your preferences. They are shown below."
              : "Select your preferred courses in order"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {prefs.map((value, index) => (
            <div key={index} className="space-y-2">
              <Label>Preference {index + 1}</Label>
              <Select
                value={value}
                onValueChange={(val) => handleChange(index, val)}
                disabled={!!existingSubmission}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {remainingOptions(index).map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.id} - {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}

          <Button
            className="w-full"
            onClick={() => {
              if (existingSubmission) {
                toast.error("You have already submitted your preferences");
                return;
              }
              setConfirmOpen(true);
            }}
            disabled={saving || !!existingSubmission}
          >
            Submit Preferences
          </Button>
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={(open) => !open && setConfirmOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Preferences</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your course preferences? You will not be able to edit them later unless an admin resets them.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setConfirmOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setConfirmOpen(false);
                handleSubmit();
              }}
            >
              Yes, Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {existingSubmission && (
        <Card>
          <CardHeader>
            <CardTitle>Your Submitted Preferences</CardTitle>
            <CardDescription>
              These are the preferences you submitted on {new Date(existingSubmission.createdAt).toLocaleString()}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              {existingSubmission.preferences.map((id) => {
                const course = allCourses.find((c) => c.id === id);
                return (
                  <li key={id}>
                    {course ? `${course.id} - ${course.name}` : id}
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
