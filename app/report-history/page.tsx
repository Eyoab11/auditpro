"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import RequireAuth from "../components/RequireAuth";
import { useAuth } from "../context/AuthContext";
import apiFetch from "../../utils/api";
import PdfDownloadButton from "../dashboard/components/PdfDownloadButton";

type AuditStatus = 'pending' | 'scanning' | 'analyzing' | 'completed' | 'failed';
interface AuditHistoryItem { jobId: string; url: string; status: AuditStatus; createdAt?: string; updatedAt?: string; score?: number; }

interface Report {
  id: string;
  date: string;
  url: string;
  score: number;
}

const mockReports: Report[] = [];

export default function ReportHistoryPage() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch('/api/audit');
        if (res?.data?.items) {
          const items: AuditHistoryItem[] = res.data.items;
          const mapped: Report[] = items.map((it) => ({
            id: it.jobId,
            date: new Date(it.createdAt || it.updatedAt || Date.now()).toISOString().split('T')[0],
            url: it.url,
            score: it.score ?? 0
          }));
          setReports(mapped);
        }
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  return (
    <RequireAuth>
  <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar */}
  <nav className="flex items-center justify-between px-8 py-6 shadow-sm bg-white border-b border-gray-200 relative">
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
          <Link href="/dashboard" className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition">
            New Audit
          </Link>
          <button onClick={logout} className="text-sm text-purple-400 hover:text-purple-300">Logout</button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50">
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
                <Link 
                  href="/dashboard" 
                  className="inline-block mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  New Audit
                </Link>
                <button onClick={logout} className="mt-2 text-sm text-purple-400 hover:text-purple-300">Logout</button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">Your Past Audits</h2>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-purple-500/30 transition">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-sm text-gray-400">{report.date}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        report.score >= 80 ? 'bg-green-500/20 text-green-400' :
                        report.score >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        Score: {report.score}
                      </span>
                    </div>
                    <p className="text-white font-medium">{report.url}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/reports/${report.id}`}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition text-sm font-medium"
                    >
                      View Report
                    </Link>
                    <PdfDownloadButton 
                      jobId={report.id} 
                      disabled={report.score === 0}
                      className="px-4 py-2 text-sm font-medium rounded-lg"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
    </RequireAuth>
  );
}
