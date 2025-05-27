"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle, ChevronRight, MapPin, Shield, Truck, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PartnershipLogo } from "@/components/partnership-logo"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <PartnershipLogo size={40} />
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              <Link href="#features" className="text-sm font-medium hover:text-wialon-blue transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm font-medium hover:text-wialon-blue transition-colors">
                How It Works
              </Link>
              <Link href="#step-by-step" className="text-sm font-medium hover:text-wialon-blue transition-colors">
                Step-by-Step Guide
              </Link>
              <Link href="#testimonials" className="text-sm font-medium hover:text-wialon-blue transition-colors">
                Testimonials
              </Link>
              <Link href="#faq" className="text-sm font-medium hover:text-wialon-blue transition-colors">
                FAQ
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/login" passHref>
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register" passHref>
                <Button className="bg-wialon-blue hover:bg-wialon-darkBlue">Register</Button>
              </Link>
            </div>
          </div>
          <div className="md:hidden">
            <Button variant="ghost" size="icon" className="h-8 w-8">
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
                className="h-4 w-4"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
          <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,transparent)] dark:bg-grid-slate-700/25"></div>
          <div className="container relative pt-20 pb-24 md:pt-24 md:pb-32">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="flex flex-col justify-center space-y-6">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-wialon-red/10 text-wialon-red hover:bg-wialon-red/20 w-fit">
                  <span>Official WASL Integration Partner</span>
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Streamline Your <span className="gradient-text">WASL Compliance</span> with Wialon
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Automate the registration of companies, drivers, and vehicles with the WASL platform to meet
                    regulatory compliance in Saudi Arabia with our powerful integration.
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row">
                  <Link href="/register" passHref>
                    <Button size="lg" className="bg-wialon-blue hover:bg-wialon-darkBlue">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#step-by-step" passHref>
                    <Button variant="outline" size="lg">
                      View Step-by-Step Guide
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                    <span>Easy Setup</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                    <span>24/7 Support</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                    <span>Secure Platform</span>
                  </div>
                </div>
              </div>
              <div className="relative flex items-center justify-center lg:justify-end">
                <div className="relative w-full max-w-[600px] overflow-hidden rounded-lg shadow-xl">
                  <Image
                    src="/images/fleet-tracking-mobile.jpeg"
                    alt="Fleet Tracking System"
                    width={600}
                    height={400}
                    className="w-full object-cover rounded-lg border border-gray-200"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">Comprehensive WASL Integration</h2>
              <p className="max-w-[700px] mx-auto text-gray-500 md:text-xl dark:text-gray-400">
                Our platform offers a complete solution for WASL compliance with powerful features designed for fleet
                operators in Saudi Arabia
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-900">
                <CardContent className="p-6">
                  <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-wialon-blue/10">
                    <Users className="h-6 w-6 text-wialon-blue" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Company Registration</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Register your companies with WASL to ensure compliance with Saudi regulations. Manage all your
                    company profiles in one place.
                  </p>
                  <Link
                    href="/register"
                    className="text-wialon-blue hover:text-wialon-darkBlue font-medium inline-flex items-center"
                  >
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-900">
                <CardContent className="p-6">
                  <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-wialon-red/10">
                    <Truck className="h-6 w-6 text-wialon-red" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Vehicle Management</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Register and manage your fleet of vehicles with WASL integration. Track registration status and
                    compliance in real-time.
                  </p>
                  <Link
                    href="/register"
                    className="text-wialon-red hover:text-wialon-darkRed font-medium inline-flex items-center"
                  >
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-900">
                <CardContent className="p-6">
                  <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-wialon-blue/10">
                    <MapPin className="h-6 w-6 text-wialon-blue" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Location Tracking</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Track and report vehicle locations to WASL in real-time. Ensure continuous compliance with location
                    reporting requirements.
                  </p>
                  <Link
                    href="/register"  
                    className="text-wialon-blue hover:text-wialon-darkBlue font-medium inline-flex items-center"
                  >
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-900">
                <CardContent className="p-6">
                  <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-wialon-red/10">
                    <Shield className="h-6 w-6 text-wialon-red" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Compliance Monitoring</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Stay compliant with Saudi regulations with real-time monitoring and alerts. Never miss a compliance
                    deadline again.
                  </p>
                  <Link
                    href="/register"
                    className="text-wialon-red hover:text-wialon-darkRed font-medium inline-flex items-center"
                  >
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-900">
                <CardContent className="p-6">
                  <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-wialon-blue/10">
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
                      className="h-6 w-6 text-wialon-blue"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Secure API Integration</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Connect securely to WASL APIs with our robust integration. Ensure data security and reliability at
                    all times.
                  </p>
                  <Link
                    href="/register"
                    className="text-wialon-blue hover:text-wialon-darkBlue font-medium inline-flex items-center"
                  >
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white dark:bg-gray-900">
                <CardContent className="p-6">
                  <div className="mb-4 rounded-full w-12 h-12 flex items-center justify-center bg-wialon-red/10">
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
                      className="h-6 w-6 text-wialon-red"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                      <path d="M12 8v4" />
                      <path d="M12 16h.01" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Automated Reporting</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Generate automated reports for compliance and fleet management. Get insights into your WASL
                    compliance status.
                  </p>
                  <Link
                    href="/register"
                    className="text-wialon-red hover:text-wialon-darkRed font-medium inline-flex items-center"
                  >
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">How It Works</h2>
              <p className="max-w-[700px] mx-auto text-gray-500 md:text-xl dark:text-gray-400">
                Our streamlined process makes WASL compliance simple and efficient
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full bg-wialon-blue flex items-center justify-center text-white font-bold text-xl">
                    1
                  </div>
                  <div className="absolute top-1/2 left-full h-1 w-full bg-wialon-blue/20 hidden md:block"></div>
                </div>
                <h3 className="text-xl font-bold mb-2">Register Your Account</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Create your account and connect your Wialon tracking system to our platform.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full bg-wialon-blue flex items-center justify-center text-white font-bold text-xl">
                    2
                  </div>
                  <div className="absolute top-1/2 left-full h-1 w-full bg-wialon-blue/20 hidden md:block"></div>
                </div>
                <h3 className="text-xl font-bold mb-2">Configure Your Fleet</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Add your companies, drivers, and vehicles to the platform for WASL registration.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full bg-wialon-blue flex items-center justify-center text-white font-bold text-xl">
                    3
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Automated Compliance</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Our system automatically handles WASL compliance, including location tracking and reporting.
                </p>
              </div>
            </div>

            <div className="mt-16 text-center">
              <Link href="#step-by-step" passHref>
                <Button size="lg" className="bg-wialon-blue hover:bg-wialon-darkBlue">
                  See Detailed Step-by-Step Guide
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Step-by-Step Guide Section */}
        <section id="step-by-step" className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">
                Step-by-Step WASL Integration Guide
              </h2>
              <p className="max-w-[700px] mx-auto text-gray-500 md:text-xl dark:text-gray-400">
                Follow our comprehensive guide to set up and manage your WASL compliance
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Step 1 */}
              <div className="relative">
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg">
                  <div className="relative h-[300px] w-full">
                    <Image
                      src="https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=2070&auto=format&fit=crop"
                      alt="Account Registration"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-wialon-blue text-white font-bold text-lg mb-2">
                        1
                      </span>
                      <h3 className="text-2xl font-bold text-white mb-1">Account Registration</h3>
                      <p className="text-white/90">Create your account on the WASL integration platform</p>
                    </div>
                  </div>
                  <div className="p-6 bg-white dark:bg-gray-900">
                    <ol className="space-y-4 list-decimal list-inside text-gray-700 dark:text-gray-300">
                      <li>
                        <span className="font-medium">Visit the registration page</span> - Click the "Register" button
                        at the top of this page
                      </li>
                      <li>
                        <span className="font-medium">Fill in your company details</span> - Provide your company name,
                        contact information, and Genesis Session Key
                      </li>
                      <li>
                        <span className="font-medium">Create login credentials</span> - Set up your email and password
                        for secure access
                      </li>
                      <li>
                        <span className="font-medium">Verify your account</span> - Confirm your email address to
                        activate your account
                      </li>
                    </ol>
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-bold text-wialon-blue mb-2 flex items-center">
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
                          className="h-5 w-5 mr-2"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="m9 12 2 2 4-4"></path>
                        </svg>
                        Pro Tip
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Have your Genesis Session Key ready before starting registration. You can obtain this from your
                        Wialon account settings.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg">
                  <div className="relative h-[300px] w-full">
                    <Image
                      src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop"
                      alt="Company Registration"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-wialon-red text-white font-bold text-lg mb-2">
                        2
                      </span>
                      <h3 className="text-2xl font-bold text-white mb-1">Company Registration</h3>
                      <p className="text-white/90">Register your company with WASL through our platform</p>
                    </div>
                  </div>
                  <div className="p-6 bg-white dark:bg-gray-900">
                    <ol className="space-y-4 list-decimal list-inside text-gray-700 dark:text-gray-300">
                      <li>
                        <span className="font-medium">Navigate to Companies section</span> - Access the Companies tab in
                        your dashboard
                      </li>
                      <li>
                        <span className="font-medium">Click "Register New Company"</span> - Start the company
                        registration process
                      </li>
                      <li>
                        <span className="font-medium">Enter company details</span> - Provide the required information
                        including company name, contact details, and identity number
                      </li>
                      <li>
                        <span className="font-medium">Submit for WASL registration</span> - Our system will
                        automatically submit your company details to WASL
                      </li>
                    </ol>
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <h4 className="font-bold text-wialon-red mb-2 flex items-center">
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
                          className="h-5 w-5 mr-2"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="m9 12 2 2 4-4"></path>
                        </svg>
                        Important Note
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Ensure your company identity number is accurate as it will be verified by WASL. Incorrect
                        information will result in registration failure.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg">
                  <div className="relative h-[300px] w-full">
                    <Image
                      src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop"
                      alt="Driver Registration"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-wialon-blue text-white font-bold text-lg mb-2">
                        3
                      </span>
                      <h3 className="text-2xl font-bold text-white mb-1">Driver Registration</h3>
                      <p className="text-white/90">Register your drivers with WASL through our platform</p>
                    </div>
                  </div>
                  <div className="p-6 bg-white dark:bg-gray-900">
                    <ol className="space-y-4 list-decimal list-inside text-gray-700 dark:text-gray-300">
                      <li>
                        <span className="font-medium">Navigate to Drivers section</span> - Access the Drivers tab in
                        your dashboard
                      </li>
                      <li>
                        <span className="font-medium">Click "Register New Driver"</span> - Start the driver registration
                        process
                      </li>
                      <li>
                        <span className="font-medium">Select company</span> - Choose which registered company this
                        driver belongs to
                      </li>
                      <li>
                        <span className="font-medium">Enter driver details</span> - Provide the required information
                        including name, mobile number, and identity number
                      </li>
                      <li>
                        <span className="font-medium">Submit for WASL registration</span> - Our system will
                        automatically submit your driver details to WASL
                      </li>
                    </ol>
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-bold text-wialon-blue mb-2 flex items-center">
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
                          className="h-5 w-5 mr-2"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="m9 12 2 2 4-4"></path>
                        </svg>
                        Pro Tip
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Ensure all driver mobile numbers are in the correct Saudi format (+966) to avoid registration
                        issues with WASL.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg">
                  <div className="relative h-[300px] w-full">
                    <Image
                      src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1964&auto=format&fit=crop"
                      alt="Vehicle Registration"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-wialon-red text-white font-bold text-lg mb-2">
                        4
                      </span>
                      <h3 className="text-2xl font-bold text-white mb-1">Vehicle Registration</h3>
                      <p className="text-white/90">Register your vehicles with WASL through our platform</p>
                    </div>
                  </div>
                  <div className="p-6 bg-white dark:bg-gray-900">
                    <ol className="space-y-4 list-decimal list-inside text-gray-700 dark:text-gray-300">
                      <li>
                        <span className="font-medium">Navigate to Vehicles section</span> - Access the Vehicles tab in
                        your dashboard
                      </li>
                      <li>
                        <span className="font-medium">Click "Register New Vehicle"</span> - Start the vehicle
                        registration process
                      </li>
                      <li>
                        <span className="font-medium">Select company</span> - Choose which registered company this
                        vehicle belongs to
                      </li>
                      <li>
                        <span className="font-medium">Enter vehicle details</span> - Provide the required information
                        including vehicle name, IMEI number, sequence number, and activity type
                      </li>
                      <li>
                        <span className="font-medium">Submit for WASL registration</span> - Our system will
                        automatically submit your vehicle details to WASL
                      </li>
                    </ol>
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <h4 className="font-bold text-wialon-red mb-2 flex items-center">
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
                          className="h-5 w-5 mr-2"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="m9 12 2 2 4-4"></path>
                        </svg>
                        Important Note
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        The IMEI number must match the GPS device installed in the vehicle. Double-check this number to
                        ensure accurate tracking.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="relative">
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg">
                  <div className="relative h-[300px] w-full">
                    <Image
                      src="https://images.unsplash.com/photo-1604357209793-fca5dca89f97?q=80&w=2064&auto=format&fit=crop"
                      alt="Location Tracking"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-wialon-blue text-white font-bold text-lg mb-2">
                        5
                      </span>
                      <h3 className="text-2xl font-bold text-white mb-1">Location Tracking</h3>
                      <p className="text-white/90">Set up automated location tracking for WASL compliance</p>
                    </div>
                  </div>
                  <div className="p-6 bg-white dark:bg-gray-900">
                    <ol className="space-y-4 list-decimal list-inside text-gray-700 dark:text-gray-300">
                      <li>
                        <span className="font-medium">Navigate to Vehicle Locations section</span> - Access the Vehicle
                        Locations tab in your dashboard
                      </li>
                      <li>
                        <span className="font-medium">Configure tracking settings</span> - Set up the frequency of
                        location updates to WASL
                      </li>
                      <li>
                        <span className="font-medium">Verify tracking status</span> - Ensure all vehicles are properly
                        reporting their locations
                      </li>
                      <li>
                        <span className="font-medium">Monitor compliance</span> - View the status of location updates
                        being sent to WASL
                      </li>
                    </ol>
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-bold text-wialon-blue mb-2 flex items-center">
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
                          className="h-5 w-5 mr-2"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="m9 12 2 2 4-4"></path>
                        </svg>
                        Pro Tip
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Our system automatically handles location updates to WASL, but you can manually post locations
                        if needed for testing or to resolve any reporting issues.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 6 */}
              <div className="relative">
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg">
                  <div className="relative h-[300px] w-full">
                    <Image
                      src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
                      alt="Compliance Monitoring"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-wialon-red text-white font-bold text-lg mb-2">
                        6
                      </span>
                      <h3 className="text-2xl font-bold text-white mb-1">Compliance Monitoring</h3>
                      <p className="text-white/90">Monitor and maintain your WASL compliance status</p>
                    </div>
                  </div>
                  <div className="p-6 bg-white dark:bg-gray-900">
                    <ol className="space-y-4 list-decimal list-inside text-gray-700 dark:text-gray-300">
                      <li>
                        <span className="font-medium">Access the Dashboard</span> - View your compliance overview on the
                        main dashboard
                      </li>
                      <li>
                        <span className="font-medium">Check compliance status</span> - Monitor the status of all your
                        registered entities
                      </li>
                      <li>
                        <span className="font-medium">Review error reports</span> - Address any compliance issues
                        flagged by the system
                      </li>
                      <li>
                        <span className="font-medium">Generate compliance reports</span> - Create reports for your
                        records or regulatory requirements
                      </li>
                    </ol>
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <h4 className="font-bold text-wialon-red mb-2 flex items-center">
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
                          className="h-5 w-5 mr-2"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="m9 12 2 2 4-4"></path>
                        </svg>
                        Important Note
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Set up email alerts for compliance issues to ensure you're immediately notified of any problems
                        that require attention.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Ready to streamline your WASL compliance process with our step-by-step guidance?
              </p>
              <Link href="/register" passHref>
                <Button size="lg" className="bg-wialon-blue hover:bg-wialon-darkBlue">
                  Get Started Today <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">What Our Customers Say</h2>
              <p className="max-w-[700px] mx-auto text-gray-500 md:text-xl dark:text-gray-400">
                Hear from fleet operators who have transformed their WASL compliance with our platform
              </p>
            </div>

            <Tabs defaultValue="tab1" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
                <TabsTrigger value="tab1">Logistics</TabsTrigger>
                <TabsTrigger value="tab2">Transport</TabsTrigger>
                <TabsTrigger value="tab3">Delivery</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="mr-4 rounded-full overflow-hidden w-12 h-12 bg-gray-200">
                          <Image
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
                            alt="Customer"
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold">Ahmed Al-Saud</h4>
                          <p className="text-sm text-gray-500">Fleet Manager, Saudi Logistics Co.</p>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 italic">
                        "The Wialon WASL integration has transformed our compliance process. What used to take days now
                        happens automatically. Our fleet of 150 vehicles is now fully compliant with minimal effort."
                      </p>
                      <div className="mt-4 flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="#FFD700"
                            stroke="#FFD700"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="mr-4 rounded-full overflow-hidden w-12 h-12 bg-gray-200">
                          <Image
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
                            alt="Customer"
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold">Fatima Al-Qahtani</h4>
                          <p className="text-sm text-gray-500">Operations Director, Gulf Shipping</p>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 italic">
                        "We were struggling with WASL compliance until we found this platform. The integration with our
                        existing Wialon system was seamless, and the support team was exceptional throughout the setup."
                      </p>
                      <div className="mt-4 flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="#FFD700"
                            stroke="#FFD700"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="tab2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="mr-4 rounded-full overflow-hidden w-12 h-12 bg-gray-200">
                          <Image
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
                            alt="Customer"
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold">Khalid Al-Otaibi</h4>
                          <p className="text-sm text-gray-500">CEO, Riyadh Transport</p>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 italic">
                        "As a passenger transport company, WASL compliance is critical for our business. This platform
                        has made it simple and reliable. The real-time tracking integration is particularly valuable."
                      </p>
                      <div className="mt-4 flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="#FFD700"
                            stroke="#FFD700"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="mr-4 rounded-full overflow-hidden w-12 h-12 bg-gray-200">
                          <Image
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
                            alt="Customer"
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold">Mohammed Al-Ghamdi</h4>
                          <p className="text-sm text-gray-500">Operations Manager, Jeddah Bus Lines</p>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 italic">
                        "Managing a large bus fleet requires robust compliance solutions. This platform has exceeded our
                        expectations with its reliability and ease of use. The dashboard gives us a clear view of our
                        compliance status."
                      </p>
                      <div className="mt-4 flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="#FFD700"
                            stroke="#FFD700"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="tab3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="mr-4 rounded-full overflow-hidden w-12 h-12 bg-gray-200">
                          <Image
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
                            alt="Customer"
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold">Noura Al-Shammari</h4>
                          <p className="text-sm text-gray-500">Logistics Director, Fast Delivery Co.</p>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 italic">
                        "Our delivery fleet needs to be compliant at all times. This platform has streamlined our WASL
                        compliance process and saved us countless hours of administrative work. Highly recommended!"
                      </p>
                      <div className="mt-4 flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="#FFD700"
                            stroke="#FFD700"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="mr-4 rounded-full overflow-hidden w-12 h-12 bg-gray-200">
                          <Image
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
                            alt="Customer"
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold">Saad Al-Dosari</h4>
                          <p className="text-sm text-gray-500">CEO, Express Courier</p>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 italic">
                        "The integration between Wialon and WASL has been a game-changer for our courier business. The
                        automated location tracking ensures we're always compliant without any manual intervention."
                      </p>
                      <div className="mt-4 flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="#FFD700"
                            stroke="#FFD700"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-1"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">Frequently Asked Questions</h2>
              <p className="max-w-[700px] mx-auto text-gray-500 md:text-xl dark:text-gray-400">
                Find answers to common questions about our WASL integration platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div>
                <h3 className="text-xl font-bold mb-2">What is WASL?</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  WASL is the Saudi Arabian regulatory platform for vehicle tracking and compliance. It requires all
                  commercial vehicles to be registered and tracked according to specific regulations.
                </p>

                <h3 className="text-xl font-bold mb-2">How does the integration work?</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Our platform connects your Wialon tracking system directly to the WASL API, automating the
                  registration and location reporting process for your entire fleet.
                </p>

                <h3 className="text-xl font-bold mb-2">Is my data secure?</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Yes, we use enterprise-grade encryption and security measures to protect all your data. Our platform
                  is fully compliant with Saudi data protection regulations.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2">How long does setup take?</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Most customers are fully set up within 24-48 hours. Our support team will guide you through the entire
                  process to ensure a smooth integration.
                </p>

                <h3 className="text-xl font-bold mb-2">What if I need help?</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  We offer 24/7 support via phone, email, and chat. Our team of experts is always available to help you
                  with any questions or issues.
                </p>

                <h3 className="text-xl font-bold mb-2">Can I try before I buy?</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Yes, we offer a free 14-day trial so you can experience the full benefits of our platform before
                  making a commitment.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-4">Still have questions?</p>
              <Button variant="outline" size="lg">
                Contact Our Support Team
              </Button>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4">Our Technology Partners</h2>
              <p className="max-w-[700px] mx-auto text-gray-500 md:text-xl dark:text-gray-400">
                We work with leading technology providers to ensure seamless integration and reliable service
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=2065&auto=format&fit=crop"
                    alt="GPS Tracking Technology"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">GPS Tracking</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  High-precision GPS tracking technology for accurate vehicle location monitoring
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
                    alt="Cloud Infrastructure"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">Cloud Infrastructure</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Reliable cloud infrastructure ensuring 99.9% uptime and data security
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2034&auto=format&fit=crop"
                    alt="API Integration"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">API Integration</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Seamless API integration with WASL and other third-party services
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
          <div className="container">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-wialon-blue to-wialon-red p-8 md:p-12">
              <style jsx global>{`
                .text-shadow-sm {
                  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
                }
              `}</style>
              <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]"></div>
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl mb-4 text-white">
                  Ready to Streamline Your WASL Compliance?
                </h2>
                <p className="text-white/90 mb-6 text-lg">
                  Join hundreds of fleet operators who have simplified their WASL compliance with our platform. Get
                  started today and experience the difference.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/register" passHref>
                    <Button size="lg" className="bg-white text-wialon-blue hover:bg-gray-100">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white/10 font-semibold text-shadow-sm"
                  >
                    Schedule a Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 md:py-16 bg-white dark:bg-gray-950">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <Link href="/">
                <PartnershipLogo size={40} />
              </Link>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Streamlining WASL compliance for fleet operators across Saudi Arabia.
              </p>
              <div className="mt-4 flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-wialon-blue">
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
                    className="h-5 w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-wialon-blue">
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
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-wialon-blue">
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
                    className="h-5 w-5"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-wialon-blue">
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
                    className="h-5 w-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect width="4" height="12" x="2" y="9"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4">Product</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#features" className="text-gray-500 hover:text-wialon-blue">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-wialon-blue">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-wialon-blue">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-wialon-blue">
                    Integration
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4">Resources</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="text-gray-500 hover:text-wialon-blue">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#step-by-step" className="text-gray-500 hover:text-wialon-blue">
                    Step-by-Step Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-wialon-blue">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-gray-500 hover:text-wialon-blue">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4">Company</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="text-gray-500 hover:text-wialon-blue">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-wialon-blue">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-wialon-blue">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-500 hover:text-wialon-blue">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © 2025 Tracking KSA & Wialon. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-sm text-gray-500 hover:text-wialon-blue">
                  Privacy Policy
                </a>
                <a href="#" className="text-sm text-gray-500 hover:text-wialon-blue">
                  Terms of Service
                </a>
                <a href="#" className="text-sm text-gray-500 hover:text-wialon-blue">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
