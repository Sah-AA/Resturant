"use client";
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UtensilsCrossed,
  ChefHat,
  BarChart3,
  CreditCard,
  Users,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Clock,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient, signOut } from "@/lib/auth-client";

export default function LandingPage() {
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const dropdownRef = useRef(null);

  const userRole = session?.user?.role || "cashier";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDashboardPath = () => {
    const normalizedRole = userRole === "accountant" ? "account" : userRole;
    switch (normalizedRole) {
      case "admin":      return "/admin/dashboard";
      case "account":    return "/account/dashboard";
      case "cashier":
      case "user":
      default:           return "/cashier/pos";
    }
  };

  const handleDashboardClick = () => {
    if (!session) {
      navigate("/auth/login");
      return;
    }
    navigate(getDashboardPath());
  };

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      setDropdownOpen(false);
      await signOut();
      navigate("/");
    } catch (err) {
      console.error("Sign out failed:", err);
    } finally {
      setSigningOut(false);
    }
  };

  // Get first letter of user's name or email
  const getInitial = () => {
    const name = session?.user?.name || session?.user?.email || "?";
    return name.charAt(0).toUpperCase();
  };

  // Get display name
  const getDisplayName = () => {
    return session?.user?.name || session?.user?.email || "User";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cornsilk via-background to-cornsilk">

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-lg">
                <UtensilsCrossed className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-primary">Restaurant ERP</span>
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {session ? (
                /* Logged in: Avatar with dropdown */
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none group"
                  >
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-md ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all">
                      {getInitial()}
                    </div>
                  </button>

                  {/* Dropdown menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-background border border-border rounded-xl shadow-xl overflow-hidden z-50">
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-semibold text-foreground truncate">{getDisplayName()}</p>
                        <p className="text-xs text-muted-foreground capitalize">{userRole || "user"}</p>
                      </div>

                      {/* Dashboard link */}
                      <button
                        onClick={() => { navigate(getDashboardPath()); setDropdownOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-secondary/10 transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Go to Dashboard
                      </button>

                      {/* Sign out */}
                      <button
                        onClick={handleSignOut}
                        disabled={signingOut}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <LogOut className="h-4 w-4" />
                        {signingOut ? "Signing out..." : "Sign Out"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Not logged in: Sign In button */
                <Link to="/auth/login">
                  <Button variant="default" className="gap-2">
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full text-secondary mb-6">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Complete Restaurant Management Solution</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6 leading-tight">
            Manage Your Restaurant
            <br />
            <span className="text-copper">Like Never Before</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            All-in-one ERP system for restaurants. POS, inventory, accounting, staff management, and analytics — everything you need to run a successful restaurant.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="text-lg px-8 py-6 gap-2" onClick={handleDashboardClick}>
              {session ? "Open Dashboard" : "Start Free Trial"}
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Link to="#features">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">Learn More</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-primary-foreground/70">Restaurants</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-primary-foreground/70">Orders Processed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-primary-foreground/70">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-primary-foreground/70">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Powerful features designed specifically for restaurant operations</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-card border border-border hover:shadow-xl transition-shadow">
              <div className="p-3 bg-copper/10 rounded-xl w-fit mb-6">
                <CreditCard className="h-8 w-8 text-copper" />
              </div>
              <h3 className="text-xl font-bold mb-3">POS System</h3>
              <p className="text-muted-foreground">Fast, intuitive point-of-sale with table management, split bills, and multiple payment methods.</p>
            </div>
            <div className="p-8 rounded-2xl bg-card border border-border hover:shadow-xl transition-shadow">
              <div className="p-3 bg-secondary/10 rounded-xl w-fit mb-6">
                <ChefHat className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Kitchen Management</h3>
              <p className="text-muted-foreground">Real-time order tickets, kitchen display system, and inventory tracking for ingredients.</p>
            </div>
            <div className="p-8 rounded-2xl bg-card border border-border hover:shadow-xl transition-shadow">
              <div className="p-3 bg-accent/20 rounded-xl w-fit mb-6">
                <BarChart3 className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Analytics & Reports</h3>
              <p className="text-muted-foreground">Detailed sales reports, profit margins, popular items, and peak hour analysis.</p>
            </div>
            <div className="p-8 rounded-2xl bg-card border border-border hover:shadow-xl transition-shadow">
              <div className="p-3 bg-primary/10 rounded-xl w-fit mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Staff Management</h3>
              <p className="text-muted-foreground">Role-based access, attendance tracking, payroll management, and performance metrics.</p>
            </div>
            <div className="p-8 rounded-2xl bg-card border border-border hover:shadow-xl transition-shadow">
              <div className="p-3 bg-green-500/10 rounded-xl w-fit mb-6">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Accounting</h3>
              <p className="text-muted-foreground">Complete double-entry accounting, journal entries, trial balance, and financial reports.</p>
            </div>
            <div className="p-8 rounded-2xl bg-card border border-border hover:shadow-xl transition-shadow">
              <div className="p-3 bg-blue-500/10 rounded-xl w-fit mb-6">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Real-time Sync</h3>
              <p className="text-muted-foreground">All data syncs in real-time across devices. Never miss an order or transaction.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-primary">
        <div className="max-w-4xl mx-auto text-center">
          <Clock className="h-12 w-12 text-accent mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-primary-foreground mb-6">Ready to Transform Your Restaurant?</h2>
          <p className="text-xl text-primary-foreground/80 mb-10">
            Join hundreds of restaurants already using our platform to streamline operations and boost profits.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6 gap-2" onClick={handleDashboardClick}>
            {session ? "Go to Dashboard" : "Get Started Today"}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-lg">
                <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-primary">Restaurant ERP</span>
            </div>
            <p className="text-muted-foreground text-sm">© 2026 Restaurant ERP. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
