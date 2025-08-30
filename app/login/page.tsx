"use client"

import { useState, useEffect } from "react"
import { Zap, Smartphone, Clock, TrendingUp, Shield, Star, Check, Menu, X, Loader2 } from "lucide-react"
import Link from "next/link"
import { supabase } from "../../utils/supabase/client"
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  useEffect(() => {
    // Preveri, če je uporabnik že prijavljen
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        console.log("Uporabnik je že prijavljen, preusmerjam na dashboard")
        router.push("/dashboard")
      }
    }
    
    checkAuth()
    
    // Poslušaj spremembe avtentikacije
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        console.log("Uspešna prijava, preusmerjam na dashboard")
        router.push("/dashboard")
      }
    })
    
    return () => subscription.unsubscribe()
  }, [router])

  const signInWithGoogle = async () => {
    try {
      setLoginLoading(true)
      setLoginError(null)
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        throw error
      }
    } catch (err: any) {
      setLoginError(err.message || 'An error occurred during sign in')
    } finally {
      setLoginLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/fitflow-logo.svg" alt="FitFlow Logo" className="w-10 h-10" />
              <span className="text-2xl font-black text-foreground font-montserrat">FitFlow</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
                Reviews
              </a>
              <button
                onClick={signInWithGoogle}
                disabled={loginLoading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 shadow-lg border-2 border-primary/20"
              >
                {loginLoading ? 'Signing in...' : 'Login'}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-foreground">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

                      {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
                <div className="flex flex-col gap-4">
                  <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                    Features
                  </a>
                  <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                    Pricing
                  </a>
                  <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
                    Reviews
                  </a>
                  <button
                    onClick={signInWithGoogle}
                    disabled={loginLoading}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors text-center disabled:opacity-50 shadow-lg border-2 border-primary/20"
                  >
                    {loginLoading ? 'Signing in...' : 'Login'}
                  </button>
                </div>
              </div>
            )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-black text-foreground font-montserrat leading-tight drop-shadow-lg">
                  Your Daily Workout,{" "}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-md">
                    Ready in One Click
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground font-inter leading-relaxed drop-shadow-sm">
                  No planning, no stress — just follow a structured, AI-powered workout every day. Perfect for busy
                  people who want effective results without the hassle.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={signInWithGoogle}
                  disabled={loginLoading}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-xl border-2 border-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loginLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Login
                    </>
                  )}
                </button>
                <button className="border-2 border-border hover:border-primary text-foreground px-8 py-4 rounded-xl font-medium text-lg transition-colors bg-background/80 backdrop-blur-sm">
                  Watch Demo
                </button>
              </div>

              {loginError && (
                <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg max-w-md">
                  <p className="text-destructive text-sm">{loginError}</p>
                </div>
              )}

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  7-day free trial
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img
                  src="/app-interface.svg"
                  alt="FitFlow App Interface"
                  className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-3xl transform scale-110" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-foreground font-montserrat mb-6 drop-shadow-lg">
              Everything You Need to Stay Fit
            </h2>
            <p className="text-xl text-muted-foreground font-inter max-w-3xl mx-auto drop-shadow-sm">
              Our AI-powered platform takes care of the planning so you can focus on what matters most — getting
              stronger.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "AI-Generated Workouts",
                description:
                  "Fresh, personalized circular workouts with main part, rounds, and finisher every single day.",
              },
              {
                icon: <Smartphone className="w-8 h-8" />,
                title: "Accessible Anywhere",
                description:
                  "Train on mobile or desktop. Your workout is always ready, whether you're at home or traveling.",
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Google Login",
                description:
                  "Get started instantly with secure Google authentication. No lengthy sign-up process required.",
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Track Your Progress",
                description:
                  "Complete history of past workouts to monitor consistency and celebrate your fitness journey.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-8 shadow-lg border border-border hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="w-16 h-16 bg-primary/15 rounded-xl flex items-center justify-center text-primary mb-6 shadow-md">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-card-foreground font-montserrat mb-4 drop-shadow-sm">{feature.title}</h3>
                <p className="text-muted-foreground font-inter leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <img
                src="/people-exercising.svg"
                alt="People exercising"
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl lg:text-5xl font-black text-foreground font-montserrat drop-shadow-lg">Why Choose FitFlow?</h2>

              <div className="space-y-6">
                {[
                  {
                    title: "Save Time",
                    description:
                      "No more searching for workouts or creating plans. Your daily routine is ready when you are.",
                  },
                  {
                    title: "Stay Consistent",
                    description:
                      "Fresh workouts every day keep you motivated and prevent boredom from derailing your progress.",
                  },
                  {
                    title: "Boost Motivation",
                    description:
                      "Simple, engaging design makes working out feel less like a chore and more like an achievement.",
                  },
                ].map((benefit, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground font-montserrat mb-2 drop-shadow-sm">{benefit.title}</h3>
                      <p className="text-muted-foreground font-inter leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted/50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-foreground font-montserrat mb-6 drop-shadow-lg">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground font-inter drop-shadow-sm">
              Choose the plan that works best for your fitness journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Monthly Plan */}
            <div className="bg-gradient-to-br from-card to-muted/30 rounded-2xl p-8 shadow-lg border border-border hover:shadow-xl transition-all duration-300">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-card-foreground font-montserrat mb-4 drop-shadow-sm">Monthly</h3>
                <div className="text-5xl font-black text-foreground font-montserrat mb-2 drop-shadow-md">$9.99</div>
                <p className="text-muted-foreground">per month</p>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  "Daily AI-generated workouts",
                  "Mobile & desktop access",
                  "Workout history tracking",
                  "Google login integration",
                  "24/7 customer support",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-card-foreground font-inter">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/login"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-xl font-semibold text-center transition-colors block shadow-lg hover:shadow-xl"
              >
                Login
              </Link>
            </div>

            {/* Annual Plan */}
            <div className="bg-gradient-to-br from-primary/5 via-card to-secondary/5 rounded-2xl p-8 shadow-2xl border-2 border-primary relative hover:shadow-3xl transition-all duration-300">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
                <span className="bg-white text-secondary px-6 py-3 rounded-full text-sm font-semibold shadow-xl border-2 border-secondary/30">
                  Most Popular
                </span>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-card-foreground font-montserrat mb-4 drop-shadow-sm">Annual</h3>
                <div className="mb-4">
                  <span className="text-2xl text-muted-foreground line-through">$119.88</span>
                  <div className="text-5xl font-black text-foreground font-montserrat drop-shadow-md">$71.99</div>
                  <p className="text-muted-foreground">per year</p>
                </div>
                <div className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-semibold inline-block shadow-md">
                  Save 40%
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  "Daily AI-generated workouts",
                  "Mobile & desktop access",
                  "Workout history tracking",
                  "Google login integration",
                  "24/7 customer support",
                  "Priority feature access",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-card-foreground font-inter">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/login"
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground py-4 rounded-xl font-semibold text-center transition-colors block shadow-lg hover:shadow-xl"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-foreground font-montserrat mb-6 drop-shadow-lg">
              Loved by Fitness Enthusiasts
            </h2>
            <p className="text-xl text-muted-foreground font-inter drop-shadow-sm">
              Join thousands who have transformed their fitness routine with FitFlow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Busy Professional",
                content:
                  "FitFlow has been a game-changer for my hectic schedule. I love that I don't have to think about what workout to do - it's just ready for me every morning!",
                rating: 5,
              },
              {
                name: "Mike Chen",
                role: "Remote Worker",
                content:
                  "The variety keeps me motivated. Every day is different, and the AI really understands what I need. Best fitness investment I've made.",
                rating: 5,
              },
              {
                name: "Emma Rodriguez",
                role: "New Mom",
                content:
                  "As a new mom, I barely have time to think. FitFlow makes it so easy to stay active - just open the app and go. Perfect for my lifestyle.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-card rounded-2xl p-8 shadow-lg border border-border hover:shadow-xl transition-all duration-300">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-card-foreground font-inter leading-relaxed mb-6">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-card-foreground font-montserrat drop-shadow-sm">{testimonial.name}</div>
                  <div className="text-muted-foreground text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-8 font-inter drop-shadow-sm">Trusted and Secure</p>
            <div className="flex justify-center items-center gap-8 flex-wrap">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Google Secure Login</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Supabase Protected</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-5 h-5" />
                <span className="font-medium">SSL Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white font-montserrat mb-6 drop-shadow-2xl">
            Your Personal Workout Companion, Always Ready
          </h2>
          <p className="text-xl text-white/95 font-inter mb-8 leading-relaxed drop-shadow-lg">
            Stop wasting time planning workouts. Start your fitness transformation today with AI-powered daily routines.
          </p>
          <Link
            href="/login"
            className="bg-white hover:bg-white/95 text-primary px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-2xl inline-flex items-center gap-3 border-2 border-white/20"
          >
            <Zap className="w-5 h-5" />
            Login
          </Link>
          <p className="text-white/90 mt-4 font-inter drop-shadow-md">7-day free trial • No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src="/fitflow-logo.svg" alt="FitFlow Logo" className="w-10 h-10" />
                <span className="text-2xl font-black text-card-foreground font-montserrat">FitFlow</span>
              </div>
              <p className="text-muted-foreground font-inter leading-relaxed max-w-md">
                Your daily workout companion powered by AI. No planning, no stress — just effective fitness results.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-card-foreground font-montserrat mb-4 drop-shadow-sm">Product</h3>
              <ul className="space-y-2 text-muted-foreground font-inter">
                <li>
                  <a href="#features" className="hover:text-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <Link href="/login" className="hover:text-foreground transition-colors">
                    Login
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-card-foreground font-montserrat mb-4 drop-shadow-sm">Support</h3>
              <ul className="space-y-2 text-muted-foreground font-inter">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground font-inter">
            <p>&copy; 2024 FitFlow. All rights reserved. Your fitness journey starts here.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
