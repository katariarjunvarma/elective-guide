import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Filter } from "lucide-react";
import { courses, branches, semesters, timeCommitments, interestAreas, careerGoals, categories } from "@/data/seedData";
import { generateRecommendations, RecommendationResult } from "@/utils/recommendationEngine";
import { Student } from "@/data/seedData";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Recommendations() {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  useEffect(() => {
    if (!user) return;
    setFormData((prev) => ({
      ...prev,
      id: (user as any).username ?? user.email,
      name: user.name,
    }));
  }, [user]);

  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState<RecommendationResult[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<number[]>([1, 5]);
  const [sortBy, setSortBy] = useState<string>("match");

  const handleGenerate = () => {
    if (!formData.name || !formData.branch || !formData.semester) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.interestAreas || formData.interestAreas.length === 0) {
      toast.error("Please select at least one interest area");
      return;
    }

    if (!formData.careerGoal) {
      toast.error("Please select a career goal");
      return;
    }

    const results = generateRecommendations(formData, courses);
    setRecommendations(results);
    setFilteredRecommendations(results);
    toast.success(`Generated ${results.length} recommendations!`);
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interestAreas: prev.interestAreas?.includes(interest)
        ? prev.interestAreas.filter((i) => i !== interest)
        : [...(prev.interestAreas || []), interest],
    }));
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...recommendations];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((rec) => selectedCategories.includes(rec.course.category));
    }

    filtered = filtered.filter(
      (rec) => rec.course.difficultyLevel >= difficultyFilter[0] && rec.course.difficultyLevel <= difficultyFilter[1]
    );

    if (sortBy === "match") {
      filtered.sort((a, b) => b.matchScore - a.matchScore);
    } else if (sortBy === "difficulty-low") {
      filtered.sort((a, b) => a.course.difficultyLevel - b.course.difficultyLevel);
    } else if (sortBy === "difficulty-high") {
      filtered.sort((a, b) => b.course.difficultyLevel - a.course.difficultyLevel);
    }

    setFilteredRecommendations(filtered);
  };

  // Apply filters whenever filter state changes
  useState(() => {
    applyFilters();
  });

  const getDifficultyColor = (level: number) => {
    if (level <= 2) return "bg-success";
    if (level <= 3) return "bg-warning";
    return "bg-destructive";
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Get Elective Recommendations</h1>
        <p className="text-muted-foreground">
          Fill in your profile to receive personalized course suggestions
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Student Profile</CardTitle>
            <CardDescription>Enter your academic details and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID *</Label>
                <Input
                  id="studentId"
                  value={formData.id}
                  placeholder="Student ID from profile"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  placeholder="Your Name"
                  disabled
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="branch">Branch *</Label>
                <Select value={formData.branch} onValueChange={(val) => setFormData({ ...formData, branch: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semester *</Label>
                <Select
                  value={formData.semester?.toString()}
                  onValueChange={(val) => setFormData({ ...formData, semester: parseInt(val) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((s) => (
                      <SelectItem key={s} value={s.toString()}>
                        Semester {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>CGPA: {formData.cgpa?.toFixed(1)}</Label>
              <Slider
                value={[formData.cgpa ?? 7.0]}
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
                value={[formData.mathScore ?? 70]}
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
                value={[formData.codingSkill ?? 70]}
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
                    <SelectItem key={tc} value={tc}>
                      {tc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Interest Areas * (Select multiple)</Label>
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
              <Label>Career Goal *</Label>
              <Select
                value={formData.careerGoal}
                onValueChange={(val) => setFormData({ ...formData, careerGoal: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select career goal" />
                </SelectTrigger>
                <SelectContent>
                  {careerGoals.map((cg) => (
                    <SelectItem key={cg} value={cg}>
                      {cg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full" onClick={handleGenerate}>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Recommendations
            </Button>
          </CardContent>
        </Card>

        {/* Right: Recommendations */}
        <div className="space-y-4">
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Select Course Preferences</CardTitle>
              <CardDescription>
                Submit your top 5 course choices so your admin can view your preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline" onClick={() => navigate("/course-preferences")}>
                Choose Preferences
              </Button>
            </CardContent>
          </Card>

          {recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters & Sort
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Filter by Category</Label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <Badge
                        key={cat}
                        variant={selectedCategories.includes(cat) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          toggleCategory(cat);
                          setTimeout(applyFilters, 0);
                        }}
                      >
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>
                    Difficulty Range: {difficultyFilter[0]} - {difficultyFilter[1]}
                  </Label>
                  <Slider
                    value={difficultyFilter}
                    onValueChange={(vals) => {
                      setDifficultyFilter(vals);
                      setTimeout(applyFilters, 0);
                    }}
                    min={1}
                    max={5}
                    step={1}
                    className="py-4"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Sort By</Label>
                  <Select
                    value={sortBy}
                    onValueChange={(val) => {
                      setSortBy(val);
                      setTimeout(applyFilters, 0);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="match">Best Match</SelectItem>
                      <SelectItem value="difficulty-low">Lowest Difficulty</SelectItem>
                      <SelectItem value="difficulty-high">Highest Difficulty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Top Elective Recommendations</CardTitle>
              <CardDescription>
                {filteredRecommendations.length > 0
                  ? `Showing ${filteredRecommendations.length} matching courses`
                  : "Your recommendations will appear here"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredRecommendations.length > 0 ? (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {filteredRecommendations.map((rec) => (
                    <Card key={rec.course.id} className="border-2 hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{rec.course.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{rec.course.id}</p>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${getMatchColor(rec.matchScore)}`}>
                              {rec.matchScore}%
                            </div>
                            <p className="text-xs text-muted-foreground">match</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Progress value={rec.matchScore} className="h-2" />

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">{rec.course.category}</Badge>
                          <Badge variant="outline">{rec.course.careerPath}</Badge>
                          <Badge className={getDifficultyColor(rec.course.difficultyLevel)}>
                            Difficulty: {rec.course.difficultyLevel}/5
                          </Badge>
                        </div>

                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>📚 {rec.course.credits} credits</span>
                          {rec.course.prerequisites && <span>Prerequisites: {rec.course.prerequisites}</span>}
                        </div>

                        <p className="text-sm text-muted-foreground italic">{rec.explanation}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : recommendations.length > 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No courses match your current filters. Try adjusting the filters above.
                </p>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Fill in your profile and click "Generate Recommendations" to see suggestions.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
