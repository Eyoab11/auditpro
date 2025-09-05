"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import HealthScoreCard from "../../dashboard/components/HealthScoreCard";
import DetectedTagsList from "../../dashboard/components/DetectedTagsList";
import PerformanceCharts from "../../dashboard/components/PerformanceCharts";
import RecommendationsList from "../../dashboard/components/RecommendationsList";
import PdfDownloadButton from "../../dashboard/components/PdfDownloadButton";

// Mock data for different reports
const mockReports = {
  "1": {
    healthScore: 78,
    detectedTags: [
      { name: "Google Analytics", status: "OK", icon: "FaGoogle" },
      { name: "Facebook Pixel", status: "Warning", icon: "FaFacebook" },
    ],
    performanceMetrics: {
      loadTime: { current: "2.8s", data: [3.2, 3.0, 2.9, 2.8, 2.7, 2.6, 2.5] },
      firstContentfulPaint: { current: "1.5s", data: [2.0, 1.9, 1.8, 1.7, 1.6, 1.5, 1.4] },
      largestContentfulPaint: { current: "3.2s", data: [4.0, 3.8, 3.6, 3.4, 3.2, 3.0, 2.8] },
    },
    recommendations: [
      { type: "warning", title: "Optimize Images", description: "Compress images to reduce load time.", impact: "High" },
    ],
    url: "https://example.com",
    date: "2025-09-05",
  },
  "2": {
    healthScore: 85,
    detectedTags: [
      { name: "Google Analytics", status: "OK", icon: "FaGoogle" },
      { name: "Twitter Conversion", status: "OK", icon: "FaTwitter" },
    ],
    performanceMetrics: {
      loadTime: { current: "2.2s", data: [2.8, 2.6, 2.4, 2.3, 2.2, 2.1, 2.0] },
      firstContentfulPaint: { current: "1.2s", data: [1.8, 1.6, 1.5, 1.4, 1.3, 1.2, 1.1] },
      largestContentfulPaint: { current: "2.8s", data: [3.5, 3.2, 3.0, 2.9, 2.8, 2.7, 2.6] },
    },
    recommendations: [
      { type: "issue", title: "Fix Broken Links", description: "Several links are returning 404 errors.", impact: "Medium" },
    ],
    url: "https://testsite.com",
    date: "2025-09-04",
  },
  // Add more reports as needed
};

export default function ReportDetailPage() {
  const params = useParams();
  const reportId = params.id as string;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const report = mockReports[reportId as keyof typeof mockReports];

  if (!report) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Report Not Found</h1>
          <Link href="/report-history" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition">
            Back to History
          </Link>
        </div>
      </div>
    );
  }

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
          <PdfDownloadButton />
          <Link href="/report-history" className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition">
            Back to History
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
                <div className="mt-2 space-y-2">
                  <PdfDownloadButton />
                  <Link 
                    href="/report-history" 
                    className="inline-block px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Back to History
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Health Score */}
          <HealthScoreCard score={report.healthScore} />

          {/* Detected Tags and Performance */}
          <div className="grid lg:grid-cols-2 gap-8">
            <DetectedTagsList tags={report.detectedTags} />
            <PerformanceCharts metrics={report.performanceMetrics} />
          </div>

          {/* Recommendations */}
          <RecommendationsList recommendations={report.recommendations} />
        </div>
      </main>
    </div>
  );
}
