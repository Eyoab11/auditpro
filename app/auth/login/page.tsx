"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login, loading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      alert((err as Error).message || 'Login failed');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
        <h1 className="text-2xl font-bold text-center mb-6">Login to AuditPro</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg font-semibold transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link href="/auth/signup" className="text-purple-600 hover:text-purple-700">
            Don&apos;t have an account? Sign Up
          </Link>
        </div>
        <div className="mt-4 text-center">
          <Link href="#" className="text-sm text-gray-600 hover:text-gray-700">
            Forgot Password?
          </Link>
        </div>
      </div>
    </main>
  );
}
