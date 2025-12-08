import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { courses as initialCourses, categories, careerGoals, Course } from "@/data/seedData";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<Partial<Course>>({
    id: "",
    name: "",
    category: "",
    difficultyLevel: 3,
    careerPath: "",
    prerequisites: "",
    credits: 3,
    description: "",
  });

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || c.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSave = () => {
    if (!formData.id || !formData.name || !formData.category || !formData.careerPath) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingCourse) {
      setCourses(courses.map((c) => (c.id === editingCourse.id ? (formData as Course) : c)));
      toast.success("Course updated successfully");
    } else {
      if (courses.some((c) => c.id === formData.id)) {
        toast.error("Course ID already exists");
        return;
      }
      setCourses([...courses, formData as Course]);
      toast.success("Course created successfully");
    }

    setIsDialogOpen(false);
    setEditingCourse(null);
    resetForm();
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData(course);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id));
    toast.success("Course deleted successfully");
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      category: "",
      difficultyLevel: 3,
      careerPath: "",
      prerequisites: "",
      credits: 3,
      description: "",
    });
  };

  const getDifficultyColor = (level: number) => {
    if (level <= 2) return "bg-success";
    if (level <= 3) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Courses Management</h1>
          <p className="text-muted-foreground">Manage available elective courses</p>
        </div>
        {user?.role === "admin" && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingCourse(null); resetForm(); }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCourse ? "Edit Course" : "Add New Course"}</DialogTitle>
              <DialogDescription>Fill in the course details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Course ID *</Label>
                  <Input
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="CS401"
                    disabled={!!editingCourse}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Course Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Course Name"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Career Path *</Label>
                  <Select value={formData.careerPath} onValueChange={(val) => setFormData({ ...formData, careerPath: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select career path" />
                    </SelectTrigger>
                    <SelectContent>
                      {careerGoals.map((cg) => (
                        <SelectItem key={cg} value={cg}>{cg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Difficulty Level (1-5) *</Label>
                  <Select
                    value={formData.difficultyLevel?.toString()}
                    onValueChange={(val) => setFormData({ ...formData, difficultyLevel: parseInt(val) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((level) => (
                        <SelectItem key={level} value={level.toString()}>Level {level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Credits *</Label>
                  <Select
                    value={formData.credits?.toString()}
                    onValueChange={(val) => setFormData({ ...formData, credits: parseInt(val) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[2, 3, 4].map((credit) => (
                        <SelectItem key={credit} value={credit.toString()}>{credit} Credits</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Prerequisites</Label>
                <Input
                  value={formData.prerequisites}
                  onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
                  placeholder="e.g., Machine Learning, Linear Algebra"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief course description"
                  rows={3}
                />
              </div>

              <Button className="w-full" onClick={handleSave}>
                {editingCourse ? "Update Course" : "Create Course"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>All Courses</CardTitle>
              <CardDescription>{filteredCourses.length} elective courses</CardDescription>
            </div>
            <div className="flex gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Career Path</TableHead>
                  <TableHead>Credits</TableHead>
                  {user?.role === "admin" && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.id}</TableCell>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{course.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getDifficultyColor(course.difficultyLevel)}>
                        {course.difficultyLevel}/5
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{course.careerPath}</TableCell>
                    <TableCell>{course.credits}</TableCell>
                    {user?.role === "admin" && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(course)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(course.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
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
