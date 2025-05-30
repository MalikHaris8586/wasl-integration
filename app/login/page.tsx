"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PartnershipLogo } from "@/components/partnership-logo";

import { useAppDispatch, useAppSelector } from "../redux/reduxhook/Hook";
import { loginUser, saveToken, saveUserData } from "../redux/auth/authSlice";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // ====== Manual Toast system =======
  // Toast container ref, created on mount
  useEffect(() => {
    if (!document.getElementById("manual-toast-container")) {
      const container = document.createElement("div");
      container.id = "manual-toast-container";
      Object.assign(container.style, {
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: "9999",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        pointerEvents: "none",
      });
      document.body.appendChild(container);
    }
  }, []);

  function showManualToast({
    title,
    description,
    type = "success",
    duration = 2000,
  }: {
    title: string;
    description?: string;
    type?: "success" | "error";
    duration?: number;
  }) {
    const container = document.getElementById("manual-toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "manual-toast";
    toast.style.pointerEvents = "auto"; // enable clicks on toast

    // Basic styling (you can move this to global CSS)
    Object.assign(toast.style, {
      minWidth: "250px",
      backgroundColor: type === "success" ? "#22c55e" : "#ef4444",
      color: "white",
      padding: "12px 20px",
      borderRadius: "6px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
      opacity: "0",
      transform: "translateX(100%)",
      transition: "opacity 0.3s ease, transform 0.3s ease",
      fontFamily: "sans-serif",
      userSelect: "none",
    });

    toast.innerHTML = `
      <strong>${title}</strong><br />
      <small>${description || ""}</small>
    `;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateX(0)";
    });

    // Animate out & remove after duration
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      setTimeout(() => {
        container.removeChild(toast);
      }, 300);
    }, duration);
  }
  // ====== End manual toast system =======

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const resultAction = await dispatch(loginUser(values));
    console.log("Login result:", resultAction);

    if (loginUser.fulfilled.match(resultAction)) {
      const data = resultAction.payload?.data;
      console.log("Full API Response:", resultAction.payload);
      console.log("Login data structure:", JSON.stringify(data, null, 2));
      console.log("User object structure:", JSON.stringify(data.user, null, 2));

      dispatch(saveUserData(data.user));
      dispatch(saveToken(data.token));

      // Store token in cookie
      document.cookie = `token=${data.token}; path=/; max-age=2592000`; // 30 days expiry

      showManualToast({
        title: "Success",
        description: "Login successful!",
        type: "success",
      });

      // Check if user has admin role in roles array
      const userRoles = data.user?.roles || [];
      console.log("User roles array:", userRoles);
      
      const isAdmin = userRoles.some((role: any) => 
        role.name === "admin" || role.name === "Admin" || role === "admin" || role === "Admin"
      );
      
      console.log("Role check - Is admin?:", isAdmin);
      
      // Redirect based on role
      if (isAdmin) {
        console.log("Redirecting to admin dashboard");
        router.push("/admin/dashboard");
      } else {
        console.log("Redirecting to customer dashboard");
        router.push("/customer/dashboard");
      }
    } else {
      showManualToast({
        title: "Error",
        description: "Login failed. Please check your credentials.",
        type: "error",
      });
    }

    setIsLoading(false);
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Link href="/">
            <PartnershipLogo size={60} className="mb-2" />
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to sign in
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-wialon-blue hover:bg-wialon-darkBlue"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="underline underline-offset-4 text-wialon-blue hover:text-wialon-darkBlue"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
