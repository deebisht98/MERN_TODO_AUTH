import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignupMutation } from "@/hooks/useSignupMutation";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const calculatePasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 25;
  if (/[^A-Za-z0-9]/.test(password)) strength += 25;
  return strength;
};

const getPasswordStrengthColor = (strength: number): string => {
  if (strength <= 25) return "text-red-500";
  if (strength <= 50) return "text-orange-500";
  if (strength <= 75) return "text-yellow-500";
  return "text-green-500";
};

const schema = z
  .object({
    email: z
      .string()
      .nonempty("Email is required")
      .email("Invalid email address"),
    password: z
      .string()
      .nonempty("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string().nonempty("Please confirm your password"),
  })
  .refine(
    (data) => {
      if (!data.password || !data.confirmPassword) {
        return false;
      }
      return data.password === data.confirmPassword;
    },
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }
  );

const Signup = () => {
  const [passwordStrength, setPasswordStrength] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{
    email: string;
    password: string;
    confirmPassword: string;
  }>({
    resolver: zodResolver(schema),
  });

  const password = watch("password");

  useEffect(() => {
    if (password) {
      setPasswordStrength(calculatePasswordStrength(password));
    }
  }, [password]);

  const mutation = useSignupMutation();

  const onSubmit = (data: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    if (passwordStrength <= 50) {
      toast.error("Weak Password", {
        description: "Please choose a stronger password to continue",
      });
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.error("Password Mismatch", {
        description: "The passwords you entered don't match.",
      });
      return;
    }

    mutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
      <div className="container px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-gray-600 mt-2">Join us and start your journey</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Sign Up</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    {...register("email")}
                    className="h-11 bg-white"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                    className="h-11 bg-white"
                    placeholder="Create a password"
                  />
                  {password && (
                    <div className="space-y-2">
                      <Progress value={passwordStrength} className="h-2" />
                      <div
                        className={`text-xs ${getPasswordStrengthColor(passwordStrength)}`}
                      >
                        Password Strength:{" "}
                        {passwordStrength <= 25
                          ? "Weak"
                          : passwordStrength <= 50
                            ? "Fair"
                            : passwordStrength <= 75
                              ? "Good"
                              : "Strong"}
                      </div>
                    </div>
                  )}
                  {errors.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium"
                  >
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword")}
                    className="h-11 bg-white"
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating account...
                      </div>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>

                  <div className="text-center text-sm">
                    <span className="text-gray-600">
                      Already have an account?{" "}
                    </span>
                    <Link
                      to="/login"
                      className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
                    >
                      Log In
                    </Link>
                  </div>
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
