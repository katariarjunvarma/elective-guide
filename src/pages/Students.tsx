import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Plus, Pencil, Trash2, Sparkles, Search } from "lucide-react";
import { students as initialStudents, branches, semesters, timeCommitments, interestAreas, careerGoals, Student } from "@/data/seedData";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Students() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<Partial<Student>>({
    id: "",
    name: "",
    branch: "",
    semester: undefined,
    cgpa: 7.0,
    mathScore: 70,
    codingSkill: 70,
    timeCommitment: "Medium",
    interestAreas: [],
    careerGoal: "",
  });
  const navigate = useNavigate();

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.branch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    if (!formData.id || !formData.name || !formData.branch || !formData.semester) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingStudent) {
      setStudents(students.map((s) => (s.id === editingStudent.id ? (formData as Student) : s)));
      toast.success("Student updated successfully");
    } else {
      if (students.some((s) => s.id === formData.id)) {
        toast.error("Student ID already exists");
        return;
      }
      setStudents([...students, formData as Student]);
      toast.success("Student created successfully");
    }

    setIsDialogOpen(false);
    setEditingStudent(null);
    resetForm();
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData(student);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setStudents(students.filter((s) => s.id !== id));
    toast.success("Student deleted successfully");
  };

  const handleGetRecommendations = (student: Student) => {
    // In a real app, we'd pass this data via state or context
    navigate("/recommendations");
    toast.info(`Ready to generate recommendations for ${student.name}`);
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      branch: "",
      semester: undefined,
      cgpa: 7.0,
      mathScore: 70,
      codingSkill: 70,
      timeCommitment: "Medium",
      interestAreas: [],
      careerGoal: "",
    });
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interestAreas: prev.interestAreas?.includes(interest)
        ? prev.interestAreas.filter((i) => i !== interest)
        : [...(prev.interestAreas || []), interest],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Students Management</h1>
          <p className="text-muted-foreground">Manage student profiles and view their details</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingStudent(null); resetForm(); }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingStudent ? "Edit Student" : "Add New Student"}</DialogTitle>
              <DialogDescription>Fill in the student's academic profile</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Student ID *</Label>
                  <Input
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="ST001"
                    disabled={!!editingStudent}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Student Name"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Branch *</Label>
                  <Select value={formData.branch} onValueChange={(val) => setFormData({ ...formData, branch: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((b) => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Semester *</Label>
                  <Select
                    value={formData.semester?.toString()}
                    onValueChange={(val) => setFormData({ ...formData, semester: parseInt(val) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesters.map((s) => (
                        <SelectItem key={s} value={s.toString()}>Semester {s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>CGPA: {formData.cgpa?.toFixed(1)}</Label>
                <Slider
                  value={[formData.cgpa || 7.0]}
                  onValueChange={([val]) => setFormData({ ...formData, cgpa: val })}
                  min={0}
                  max={10}
                  step={0.1}
                  className="py-4"
                />
              </div>

              <div className="space-y-2">
                <Label>Math Score: {formData.mathScore}</Label>
                <Slider
                  value={[formData.mathScore || 70]}
                  onValueChange={([val]) => setFormData({ ...formData, mathScore: val })}
                  min={0}
                  max={100}
                  step={5}
                  className="py-4"
                />
              </div>

              <div className="space-y-2">
                <Label>Coding Skill: {formData.codingSkill}</Label>
                <Slider
                  value={[formData.codingSkill || 70]}
                  onValueChange={([val]) => setFormData({ ...formData, codingSkill: val })}
                  min={0}
                  max={100}
                  step={5}
                  className="py-4"
                />
              </div>

              <div className="space-y-2">
                <Label>Time Commitment</Label>
                <Select
                  value={formData.timeCommitment}
                  onValueChange={(val) => setFormData({ ...formData, timeCommitment: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeCommitments.map((tc) => (
                      <SelectItem key={tc} value={tc}>{tc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Interest Areas (Select multiple)</Label>
                <div className="flex flex-wrap gap-2">
                  {interestAreas.map((interest) => (
                    <Badge
                      key={interest}
                      variant={formData.interestAreas?.includes(interest) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Career Goal</Label>
                <Select
                  value={formData.careerGoal}
                  onValueChange={(val) => setFormData({ ...formData, careerGoal: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select career goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {careerGoals.map((cg) => (
                      <SelectItem key={cg} value={cg}>{cg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full" onClick={handleSave}>
                {editingStudent ? "Update Student" : "Create Student"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Students</CardTitle>
              <CardDescription>{filteredStudents.length} student profiles</CardDescription>
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
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>CGPA</TableHead>
                  <TableHead>Interests</TableHead>
                  <TableHead>Career Goal</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.id}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.branch}</TableCell>
                    <TableCell>{student.semester}</TableCell>
                    <TableCell>{student.cgpa.toFixed(1)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {student.interestAreas.slice(0, 2).map((interest) => (
                          <Badge key={interest} variant="secondary" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                        {student.interestAreas.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{student.interestAreas.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{student.careerGoal}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleGetRecommendations(student)}
                          title="Get Recommendations"
                        >
                          <Sparkles className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(student)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(student.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
