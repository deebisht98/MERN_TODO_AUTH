import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Here you would typically send this data to your backend
      // For now, we'll just log it
      console.log("Email:", email);
      console.log("Password:", password);

      toast.success("Logged in successfully!");
    } catch (error) {
      toast.error("Failed to log in");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Login</h1>

          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Enter Your Credentials</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                    <p>Don't have an account?</p>
                    <Link
                      to="/signup"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Sign Up
                    </Link>
                  </div>
                  <Button type="submit">Log In</Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/login")({
  component: Signup,
});
