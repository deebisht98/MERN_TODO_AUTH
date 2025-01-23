import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

const avatars = [
  "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Aneka",
  "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=John",
  "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Jane",
];

const CompleteProfileModal = () => {
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    name: string;
    bio: string;
    theme: "light" | "dark" | "system";
  }>();

  const onSubmit = (data: {
    name: string;
    bio: string;
    theme: "light" | "dark" | "system";
  }) => {
    // Handle form submission, e.g., make an API call to update the user profile
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold">Complete Your Profile</h1>
            <p className="text-gray-600 mt-2">Tell us more about yourself</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    {...register("name", { required: "Name is required" })}
                    className="h-11 bg-white"
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm font-medium">
                    Bio
                  </Label>
                  <Input
                    id="bio"
                    {...register("bio")}
                    className="h-11 bg-white"
                    placeholder="Tell us about yourself"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme" className="text-sm font-medium">
                    Theme
                  </Label>
                  <Select {...register("theme")} defaultValue="system">
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
                  <Label className="text-sm font-medium">
                    Choose an Avatar
                  </Label>
                  <div className="flex space-x-4">
                    {avatars.map((avatar) => (
                      <div
                        key={avatar}
                        className={`cursor-pointer ${selectedAvatar === avatar ? "ring-2 ring-blue-500" : ""}`}
                        onClick={() => setSelectedAvatar(avatar)}
                      >
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={avatar} />
                          <AvatarFallback>
                            <User className="h-8 w-8" />
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
                  >
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfileModal;
