"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { motion } from "framer-motion"

import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from '../redux/store'
import { registerUser } from '../redux/auth/authSlice'

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PartnershipLogo } from "@/components/partnership-logo"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const formSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
    phoneNumber: z.string().min(10, { message: "Phone number must be at least 10 characters." }),
    ipAddress: z.string().optional(),
    genesisSessionKey: z.string().min(1, { message: "Genesis Session Key is required." }),
    url: z.string().url({ message: "Please enter a valid URL." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export default function RegisterPage() {
  const router = useRouter()
  // const { toast } = useToast()  <-- remove this since we use manual toast now
  const dispatch = useDispatch<AppDispatch>()
  const { registerLoading, registerError } = useSelector((state: RootState) => state.auth)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      ipAddress: "",
      genesisSessionKey: "",
      url: "",
    },
  })

  // Toast state: array of toast messages
  const [toasts, setToasts] = useState<
    { id: number; title: string; description: string; variant?: "default" | "destructive" }[]
  >([])

  // Add a toast to the list
  function showToast({
    title,
    description,
    variant = "default",
    duration = 3000,
  }: {
    title: string
    description: string
    variant?: "default" | "destructive"
    duration?: number
  }) {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, title, description, variant }])
    // Remove toast after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const resultAction = await dispatch(registerUser(values))

    if (registerUser.fulfilled.match(resultAction)) {
      showToast({
        title: "Registration successful",
        description: "You have successfully registered. Please login to continue.",
      })
      router.push("/login")
    } else {
      showToast({
        title: "Registration failed",
        description: resultAction.payload || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      {/* Toast container */}
      <div
        aria-live="assertive"
        className="fixed top-5 right-5 z-50 flex flex-col space-y-3 max-w-xs"
      >
        {toasts.map(({ id, title, description, variant }) => (
          <div
            key={id}
            className={`rounded-md p-4 shadow-lg border ${
              variant === "destructive"
                ? "bg-red-600 text-white border-red-700"
                : "bg-green-700 text-white border-green-600"
            }`}
            style={{
              animation: "toastSlideIn 0.4s ease forwards",
            }}
          >
            <strong className="block font-semibold">{title}</strong>
            <p className="mt-1 text-sm">{description}</p>
          </div>
        ))}
      </div>

      {/* Your existing page UI */}
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Left side - Image and branding */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20 z-10"></div>
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/fleet-tracking-mobile.jpeg"
              alt="Fleet tracking system"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="relative z-20 flex flex-col justify-center items-center w-full h-full text-white p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <PartnershipLogo size={80} className="mb-6" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl font-bold mb-4"
            >
              Join Our Platform
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-center max-w-md"
            >
              Connect your fleet to our advanced tracking and management system
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.8 }}
              className="mt-12 grid grid-cols-2 gap-6 w-full max-w-md"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-3">
                  {/* SVG Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-truck"
                  >
                    <path d="M10 17h4V5H2v12h3" />
                    <path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5" />
                    <path d="M14 17h1" />
                    <circle cx="7.5" cy="17.5" r="2.5" />
                    <circle cx="17.5" cy="17.5" r="2.5" />
                  </svg>
                </div>
                <p className="text-sm font-medium">Vehicle Tracking</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-3">
                  {/* SVG Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-user-check"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <polyline points="16 11 18 13 22 9" />
                  </svg>
                </div>
                <p className="text-sm font-medium">Driver Management</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right side - Registration form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="md:hidden flex justify-center mb-6">
              <PartnershipLogo size={80} />
            </div>

            <Card className="w-full shadow-md">
              <CardHeader>
                <CardTitle className="text-center text-2xl font-bold">Create Account</CardTitle>
                <CardDescription className="text-center">Start your free trial today.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    {/* ... your form fields ... */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@example.com" {...field} />
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
                            <Input type="password" placeholder="********" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="********" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1234567890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ipAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>IP Address (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 192.168.0.1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="genesisSessionKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Genesis Session Key</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your session key" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website URL</FormLabel>
                          <FormControl>
                            <Input type="url" placeholder="https://yourwebsite.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={registerLoading}>
                      {registerLoading ? "Registering..." : "Register"}
                    </Button>
                  </form>
                </Form>
                <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link href="/login" className="text-blue-600 hover:underline">
                    Login
                  </Link>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  )
}
