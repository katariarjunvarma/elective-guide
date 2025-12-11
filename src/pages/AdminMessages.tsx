import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { listStudents, User } from "@/utils/authApi";
import { addMessageForUser, loadAllMessages, UserMessage } from "@/utils/messagesStorage";
import { toast } from "sonner";

export default function AdminMessages() {
  const [students, setStudents] = useState<User[]>([]);
  const [mode, setMode] = useState<"single" | "multiple" | "all">("all");
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [history, setHistory] = useState<UserMessage[]>([]);

  useEffect(() => {
    const allStudents = listStudents();
    setStudents(allStudents);
    setHistory(loadAllMessages());
  }, []);

  const handleSend = () => {
    if (!title.trim() || !body.trim()) {
      toast.error("Please enter a title and message");
      return;
    }

    let targets: User[] = [];

    if (mode === "all") {
      targets = students;
    } else if (mode === "single") {
      if (!selectedStudentId) {
        toast.error("Please select a student");
        return;
      }
      const target = students.find((s) => s.id === selectedStudentId);
      if (!target) {
        toast.error("Selected student not found");
        return;
      }
      targets = [target];
    } else {
      if (selectedIds.length === 0) {
        toast.error("Please select at least one student");
        return;
      }
      targets = students.filter((s) => selectedIds.includes(s.id));
      if (targets.length === 0) {
        toast.error("Please select valid students");
        return;
      }
    }

    setIsSending(true);
    try {
      const trimmedTitle = title.trim();
      const trimmedBody = body.trim();
      const batchId = `batch-${Date.now()}`;
      targets.forEach((t) => addMessageForUser(t, trimmedTitle, trimmedBody, batchId));
      toast.success(
        targets.length === 1 ? "Message sent to student" : `Message sent to ${targets.length} students`,
      );
      setTitle("");
      setBody("");
      setSelectedIds([]);
      setHistory(loadAllMessages());
    } finally {
      setIsSending(false);
    }
  };

  const groupedHistory = history
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .reduce<{ key: string; first: UserMessage; recipientIds: string[] }[]>((acc, msg) => {
      const key = msg.batchId || msg.id;
      const existing = acc.find((g) => g.key === key);
      if (existing) {
        if (!existing.recipientIds.includes(msg.userId)) {
          existing.recipientIds.push(msg.userId);
        }
      } else {
        acc.push({ key, first: msg, recipientIds: [msg.userId] });
      }
      return acc;
    }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Send Message</h1>
        <p className="text-muted-foreground">Send notification messages to students.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <Card>
          <CardHeader>
            <CardTitle>New Message</CardTitle>
            <CardDescription>Choose recipients and compose your message.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Recipients</Label>
              <div className="flex flex-wrap gap-2 text-xs">
                <Button
                  type="button"
                  variant={mode === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode("all")}
                >
                  All students
                </Button>
                <Button
                  type="button"
                  variant={mode === "multiple" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode("multiple")}
                >
                  Multiple students
                </Button>
                <Button
                  type="button"
                  variant={mode === "single" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMode("single")}
                >
                  Single student
                </Button>
              </div>
              {mode === "single" && (
                <div className="mt-3">
                  <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {mode === "multiple" && (
                <div className="mt-3 max-h-40 overflow-y-auto rounded-md border p-2 space-y-1 text-sm">
                  {students.map((s) => {
                    const checked = selectedIds.includes(s.id);
                    return (
                      <label key={s.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="h-3 w-3"
                          checked={checked}
                          onChange={(e) => {
                            setSelectedIds((prev) =>
                              e.target.checked ? [...prev, s.id] : prev.filter((id) => id !== s.id),
                            );
                          }}
                        />
                        <span>{s.name}</span>
                      </label>
                    );
                  })}
                  {students.length === 0 && (
                    <p className="text-xs text-muted-foreground">No students available.</p>
                  )}
                </div>
              )}
              {mode === "all" && (
                <p className="mt-3 text-xs text-muted-foreground">
                  This message will be sent to all students.
                </p>
              )}
            </div>
          <div className="space-y-2">
            <Label htmlFor="msg-title">Title</Label>
            <Input
              id="msg-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter message title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="msg-body">Message</Label>
            <Textarea
              id="msg-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              placeholder="Enter message content"
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSend} disabled={isSending}>
              {isSending ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </CardContent>
        </Card>

        <Card className="max-h-[480px] overflow-hidden">
          <CardHeader>
            <CardTitle>Sent Messages</CardTitle>
            <CardDescription>Recent messages and their recipients.</CardDescription>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto space-y-2 text-sm">
            {groupedHistory.length === 0 ? (
              <p className="text-muted-foreground text-sm">No messages have been sent yet.</p>
            ) : (
              groupedHistory.map((group) => {
                const { first, recipientIds } = group;
                const allNames = recipientIds
                  .map((id) => students.find((s) => s.id === id)?.name || id)
                  .filter(Boolean);

                let toLabel = "";
                if (students.length > 0 && recipientIds.length === students.length) {
                  toLabel = "All students";
                } else if (allNames.length === 1) {
                  toLabel = allNames[0];
                } else {
                  toLabel = allNames.join(", ");
                }

                return (
                  <div key={group.key} className="border rounded-md p-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium truncate">{first.title}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {new Date(first.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">To: {toLabel}</div>
                    {first.body && (
                      <div className="mt-1 text-xs text-muted-foreground line-clamp-2">{first.body}</div>
                    )}
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
