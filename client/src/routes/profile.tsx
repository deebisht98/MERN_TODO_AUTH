import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Github, Twitter, Linkedin, User } from "lucide-react";
import { NavBar } from "@/components/NavBar";

const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  avatar: "",
  role: "user",
  bio: "Full-stack developer passionate about creating beautiful user experiences",
  location: "San Francisco, CA",
  website: "https://johndoe.dev",
  socialLinks: {
    twitter: "johndoe",
    linkedin: "johndoe",
    github: "johndoe",
  },
  preferences: {
    theme: "system",
    notifications: "important",
    language: "en",
  },
};

export const Route = createFileRoute("/profile")({
  component: Profile,
});

function Profile() {
  const [user, setUser] = useState(mockUser);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // Here you would make an API call to update the user profile
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="space-y-8">
          {/* Profile Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="ml-4"
            >
              {isEditing ? "Save Changes" : "Edit Profile"}
            </Button>
          </div>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={user.name}
                    readOnly={!isEditing}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={user.location}
                    readOnly={!isEditing}
                    onChange={(e) =>
                      setUser({ ...user, location: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={user.bio}
                  readOnly={!isEditing}
                  onChange={(e) => setUser({ ...user, bio: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={user.website}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    setUser({ ...user, website: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Twitter className="h-4 w-4" /> Twitter
                  </Label>
                  <Input
                    value={user.socialLinks?.twitter || ""}
                    readOnly={!isEditing}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        socialLinks: {
                          ...user.socialLinks,
                          twitter: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </Label>
                  <Input
                    value={user.socialLinks?.linkedin || ""}
                    readOnly={!isEditing}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        socialLinks: {
                          ...user.socialLinks,
                          linkedin: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Github className="h-4 w-4" /> GitHub
                  </Label>
                  <Input
                    value={user.socialLinks?.github || ""}
                    readOnly={!isEditing}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        socialLinks: {
                          ...user.socialLinks,
                          github: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    disabled={!isEditing}
                    value={user.preferences.theme}
                    onValueChange={(value: "light" | "dark" | "system") =>
                      setUser({
                        ...user,
                        preferences: { ...user.preferences, theme: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notifications">Notifications</Label>
                  <Select
                    disabled={!isEditing}
                    value={user.preferences.notifications}
                    onValueChange={(value: "all" | "important" | "none") =>
                      setUser({
                        ...user,
                        preferences: {
                          ...user.preferences,
                          notifications: value,
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="important">Important Only</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    disabled={!isEditing}
                    value={user.preferences.language}
                    onValueChange={(value: "en" | "es" | "fr" | "de" | "zh") =>
                      setUser({
                        ...user,
                        preferences: { ...user.preferences, language: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
