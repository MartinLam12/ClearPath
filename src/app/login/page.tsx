"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { useUser } from "@/lib/user-context";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { user, updateUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // If no stored profile, create a minimal one from the email
    if (!user.name) {
      const namePart = email.split("@")[0].replace(/[._-]/g, " ");
      const capitalized = namePart
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      updateUser({ name: capitalized, email });
    }
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
            Welcome back
          </h1>
          <p className="text-surface-500">
            Log in to your ClearPath account
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-surface-200 shadow-soft-md p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@yourbusiness.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-surface-600">
                <input type="checkbox" className="rounded border-surface-300" />
                Remember me
              </label>
              <a href="#" className="text-sm text-brand-600 hover:underline">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full mt-2"
              loading={loading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Log In
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-surface-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-brand-600 font-medium hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
