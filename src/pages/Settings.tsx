import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [minMatchScore, setMinMatchScore] = useState(50);
  const [appDescription, setAppDescription] = useState(
    "The Elective Recommendation System helps university students choose the best elective courses based on their academic profile, interests, and career goals. Using intelligent scoring algorithms, it provides personalized course suggestions to enhance your academic journey."
  );

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Configure application preferences and parameters</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how the app looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Enable dark mode for better viewing at night
              </p>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommendation Settings</CardTitle>
          <CardDescription>Configure recommendation algorithm parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Minimum Match Score Threshold</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Only show courses with a match score above this value (0-100)
            </p>
            <Input
              type="number"
              min={0}
              max={100}
              value={minMatchScore}
              onChange={(e) => setMinMatchScore(parseInt(e.target.value) || 0)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About This App</CardTitle>
          <CardDescription>Description and information about the system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>App Description</Label>
            <Textarea
              value={appDescription}
              onChange={(e) => setAppDescription(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Technical details about the system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Version</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Updated</span>
            <span className="font-medium">November 2024</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Developer</span>
            <span className="font-medium">B.Tech CSE (AI & ML) Student</span>
          </div>
        </CardContent>
      </Card>

      <Button className="w-full" onClick={handleSave}>
        Save Settings
      </Button>
    </div>
  );
}
