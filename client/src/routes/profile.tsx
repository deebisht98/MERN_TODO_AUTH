import { createFileRoute } from "@tanstack/react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { LogOut, User, Twitter, Linkedin, Github } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";
import { useUpdateSettings } from "@/hooks/useUpdateSettings";
import type { UserSettings } from "@/api/userApi";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z
    .string()
    .max(500, "Bio must be less than 500 characters")
    .optional()
    .nullable(),
  location: z.string().optional().nullable(),
  website: z
    .string()
    .optional()
    .nullable()
    .refine((value) => {
      if (value) {
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      }
      return true;
    }, "Please enter a valid URL"),
  socialLinks: z
    .object({
      twitter: z
        .string()
        .optional()
        .nullable()
        .refine((value) => {
          if (value) {
            try {
              new URL(value);
              return true;
            } catch {
              return false;
            }
          }
          return true;
        }, "Please enter a valid URL"),
      linkedin: z
        .string()
        .optional()
        .nullable()
        .refine((value) => {
          if (value) {
            try {
              new URL(value);
              return true;
            } catch {
              return false;
            }
          }
          return true;
        }, "Please enter a valid URL"),
      github: z
        .string()
        .optional()
        .nullable()
        .refine((value) => {
          if (value) {
            try {
              new URL(value);
              return true;
            } catch {
              return false;
            }
          }
          return true;
        }, "Please enter a valid URL"),
    })
    .optional(),
  preferences: z
    .object({
      theme: z.enum(["light", "dark", "system"]).optional(),
      notifications: z.enum(["all", "important", "none"]).optional(),
      language: z.enum(["en", "es", "fr", "de", "zh"]).optional(),
    })
    .optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

function Profile() {
  const { user, logout } = useAuth();
  const { setTheme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    reset({
      name: user?.name || "",
      bio: user?.bio || "",
      location: user?.location || "",
      socialLinks: {
        twitter: user?.socialLinks?.twitter || "",
        linkedin: user?.socialLinks?.linkedin || "",
        github: user?.socialLinks?.github || "",
      },
      preferences: {
        theme: user?.preferences?.theme || "system",
        notifications: user?.preferences?.notifications || "all",
        language: user?.preferences?.language || "en",
      },
    });
  }, [user, reset]);

  const updateSettingsMutation = useUpdateSettings();

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      await updateSettingsMutation.mutateAsync(data as UserSettings);
      toast.success("Profile updated successfully!");
      reset(data);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    try {
      // API call to logout from all devices
      await logout();
      toast.success("Logged out from all devices");
    } catch (error) {
      toast.error("Failed to logout from all devices");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <NavBar />

      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.avatar || ""} />
                <AvatarFallback>
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{user?.name || ""}</h1>
                <p className="text-muted-foreground">{user?.email || ""}</p>
              </div>
            </div>
          </div>

          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  {...register("name")}
                  className="h-11 bg-white"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  {...register("bio")}
                  className="min-h-[100px] bg-white"
                  placeholder="Tell us about yourself"
                />
                {errors.bio && (
                  <p className="text-red-500 text-sm">{errors.bio.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  {...register("location")}
                  className="h-11 bg-white"
                  placeholder="City, Country"
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Twitter */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Twitter className="h-4 w-4" /> Twitter
                  </Label>
                  <Input
                    {...register("socialLinks.twitter")}
                    className="h-11 bg-white"
                    placeholder="@username"
                  />
                </div>
                {/* LinkedIn */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </Label>
                  <Input
                    {...register("socialLinks.linkedin")}
                    className="h-11 bg-white"
                    placeholder="Profile URL"
                  />
                </div>
                {/* GitHub */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Github className="h-4 w-4" /> GitHub
                  </Label>
                  <Input
                    {...register("socialLinks.github")}
                    className="h-11 bg-white"
                    placeholder="Username"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Theme */}
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Controller
                    name="preferences.theme"
                    control={control}
                    defaultValue={user?.preferences?.theme || "system"}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => {
                          setTheme(value);
                          field.onChange(value);
                        }}
                        value={field.value}
                      >
                        <SelectTrigger className="h-11 bg-white">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                {/* Notifications */}
                <div className="space-y-2">
                  <Label htmlFor="notifications">Notifications</Label>
                  <Controller
                    name="preferences.notifications"
                    control={control}
                    defaultValue={user?.preferences?.notifications || "all"}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="h-11 bg-white">
                          <SelectValue placeholder="Select notifications" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="important">
                            Important Only
                          </SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                {/* Language */}
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Controller
                    name="preferences.language"
                    control={control}
                    defaultValue={user?.preferences?.language || "en"}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="h-11 bg-white">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="zh">Chinese</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between pt-4">
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout from All Devices
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will log you out from all devices where you're
                    currently signed in.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogoutAllDevices}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Yes, logout from all devices
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </form>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/profile")({
  component: Profile,
});
