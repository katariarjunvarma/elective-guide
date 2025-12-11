import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { updateUser } from "@/utils/authApi";
import { interestAreas, careerGoals } from "@/data/seedData";

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [selectedCareerGoals, setSelectedCareerGoals] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const toggleCareerGoal = (goal: string) => {
    setSelectedCareerGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setUsername((user as any).username ?? user.email);
      setInterests(user.interestAreas ?? []);
      setSelectedCareerGoals(user.careerGoals ?? []);
    }
  }, [user]);

  const handleSave = () => {
    if (!user) return;
    const updated = updateUser(user.id, {
      name,
      email,
      interestAreas: interests,
      careerGoals: selectedCareerGoals,
    });
    if (!updated) {
      toast.error("Failed to update profile");
      return;
    }
    refreshUser();
    toast.success("Profile updated");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">My Profile</h1>
        <p className="text-muted-foreground">View and update your profile details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Your personal and academic details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={username} disabled readOnly />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Academic Interests</CardTitle>
          <CardDescription>Used to personalize your recommendations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="interests">Interests / Preferred Domains</Label>
            <div className="flex flex-wrap gap-2">
              {interestAreas.map((interest) => (
                <Badge
                  key={interest}
                  variant={interests.includes(interest) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="careerGoals">Career Goals</Label>
            <div className="flex flex-wrap gap-2">
              {careerGoals.map((goal) => (
                <Badge
                  key={goal}
                  variant={selectedCareerGoals.includes(goal) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleCareerGoal(goal)}
                >
                  {goal}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave}>Save Profile</Button>
    </div>
  );
}
