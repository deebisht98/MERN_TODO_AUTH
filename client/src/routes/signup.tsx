import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Link } from "@tanstack/react-router";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Here you would typically send this data to your backend
      // For now, we'll just log it
      console.log("Username:", username);
      console.log("Email:", email);
      console.log("Password:", password);

      toast.success("Account created successfully!");
    } catch (error) {
      toast.error("Failed to create account");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Sign Up</h1>

          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Create Your Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Name</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="flex gap-1">
                    <p>Already have an account?</p>
                    <Link
                      to="/login"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Login
                    </Link>
                  </div>
                  <Button type="submit">Sign Up</Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/signup")({
  component: Signup,
});
