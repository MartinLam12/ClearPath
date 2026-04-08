"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { useUser } from "@/lib/user-context";
import { ArrowRight } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUser({ name, email, businessName });
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <span className="text-xl font-bold text-surface-900">ClearPath</span>
          </Link>
          <h1 className="text-2xl font-bold text-surface-900 mb-2">
            Create your account
          </h1>
          <p className="text-surface-500">
            Start your free AI readiness assessment
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-surface-200 shadow-soft-md p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Work Email"
              type="email"
              placeholder="john@yourbusiness.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Business Name"
              type="text"
              placeholder="Your Business Name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Create a strong password"
              hint="At least 8 characters"
              required
            />

            <Button
              type="submit"
              size="lg"
              className="w-full mt-2"
              loading={loading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Create Account
            </Button>
          </form>

          <p className="text-xs text-surface-400 text-center mt-4">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-brand-600 hover:underline">Terms</a> and{" "}
            <a href="#" className="text-brand-600 hover:underline">Privacy Policy</a>
          </p>
        </div>

        <p className="text-center text-sm text-surface-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-600 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
