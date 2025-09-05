"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function SettingsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 shadow-sm bg-[#181818] border-b border-white/10 relative">
        <div className="flex items-center gap-2">
          <Image src="/globe.svg" alt="AuditPro Logo" width={32} height={32} />
          <span className="font-bold text-xl tracking-tight">AuditPro</span>
        </div>
        
        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-8 text-base font-medium">
          <li><Link href="/dashboard" className="hover:text-purple-600 transition">Dashboard</Link></li>
          <li><Link href="/report-history" className="hover:text-purple-600 transition">History</Link></li>
          <li><Link href="/settings" className="hover:text-purple-600 transition">Settings</Link></li>
        </ul>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-white/10 transition"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-4">
          <span className="text-gray-400">Welcome, User</span>
          <Link href="/dashboard" className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition">
            Back to Dashboard
          </Link>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#181818] border-b border-white/10 shadow-lg z-50">
            <div className="px-8 py-4 space-y-4">
              <Link 
                href="/dashboard" 
                className="block py-2 hover:text-purple-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                href="/report-history" 
                className="block py-2 hover:text-purple-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                History
              </Link>
              <Link 
                href="/settings" 
                className="block py-2 hover:text-purple-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Settings
              </Link>
              <div className="pt-4 border-t border-white/10">
                <span className="block py-2 text-gray-400">Welcome, User</span>
                <Link 
                  href="/dashboard" 
                  className="inline-block mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-[#181818] border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
            <div className="space-y-4">
              <button className="w-full text-left px-4 py-3 bg-black/20 rounded-lg hover:bg-black/30 transition">
                Change Password
              </button>
              <button className="w-full text-left px-4 py-3 bg-black/20 rounded-lg hover:bg-black/30 transition">
                Update Profile
              </button>
            </div>
          </div>

          <div className="bg-[#181818] border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Email Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Audit Report Notifications</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span>Weekly Summary</span>
                <input type="checkbox" className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span>Marketing Updates</span>
                <input type="checkbox" className="rounded" />
              </div>
            </div>
          </div>

          <div className="bg-[#181818] border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Privacy & Security</h3>
            <div className="space-y-4">
              <button className="w-full text-left px-4 py-3 bg-black/20 rounded-lg hover:bg-black/30 transition">
                Download My Data
              </button>
              <button className="w-full text-left px-4 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
