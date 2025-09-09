"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import UrlInput from "./components/UrlInput";
import HealthScoreCard from "./components/HealthScoreCard";
import DetectedTagsList from "./components/DetectedTagsList";
import PerformanceCharts from "./components/PerformanceCharts";
import RecommendationsList from "./components/RecommendationsList";
import PdfDownloadButton from "./components/PdfDownloadButton";
import mockData from "./mockAuditData.json";
import { useAuth } from "../context/AuthContext";
import RequireAuth from "../components/RequireAuth";
import apiFetch from "../../utils/api";

export default function Dashboard() {
  const [audited, setAudited] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const [history, setHistory] = useState<any[]>([]);

  async function loadHistory() {
    try {
      const res = await apiFetch('/api/audit');
      if (res?.data?.items) setHistory(res.data.items);
    } catch (e) {
      console.error('Failed to load history', e);
    }
  }

  useEffect(() => { loadHistory(); }, []);

  const handleAudit = async (url: string) => {
    console.log("Auditing URL:", url);
    setAudited(true);
    setTimeout(loadHistory, 1500); // refresh shortly after submitting
  };

  return (
    <RequireAuth>
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
          <span className="text-gray-400">Welcome, {user?.name || 'User'}</span>
          <PdfDownloadButton />
          <button onClick={logout} className="text-sm text-purple-400 hover:text-purple-300">Logout</button>
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
                <span className="block py-2 text-gray-400">Welcome, {user?.name || 'User'}</span>
                <div className="mt-2">
                  <PdfDownloadButton />
                </div>
                <button onClick={logout} className="mt-2 text-sm text-purple-400 hover:text-purple-300">Logout</button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto">
          {/* URL Input */}
          <UrlInput onAudit={handleAudit} />

          {audited && (
            <div className="px-6 pb-8 space-y-8">
              {/* Health Score */}
              <HealthScoreCard score={mockData.healthScore} />

              {/* Detected Tags and Performance */}
              <div className="grid lg:grid-cols-2 gap-8">
                <DetectedTagsList tags={mockData.detectedTags} />
                <PerformanceCharts metrics={mockData.performanceMetrics} />
              </div>

              {/* Recommendations */}
              <RecommendationsList recommendations={mockData.recommendations} />
              {/* Recent History (subset) */}
              <div className="bg-[#181818] border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Audits</h3>
                <ul className="space-y-2 text-sm">
                  {history.slice(0,5).map(item => (
                    <li key={item.jobId} className="flex justify-between">
                      <span className="truncate max-w-xs">{item.url}</span>
                      <span className="text-gray-400">{item.status}</span>
                    </li>
                  ))}
                  {history.length === 0 && <li className="text-gray-500">No audits yet.</li>}
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
    </RequireAuth>
  );
}
