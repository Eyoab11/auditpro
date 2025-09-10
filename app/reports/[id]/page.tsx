"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import HealthScoreCard from "../../dashboard/components/HealthScoreCard";
import DetectedTagsList from "../../dashboard/components/DetectedTagsList";
import PerformanceCharts from "../../dashboard/components/PerformanceCharts";
import RecommendationsList from "../../dashboard/components/RecommendationsList";
import PdfDownloadButton from "../../dashboard/components/PdfDownloadButton";
import apiFetch from "@/utils/api";

interface PerformanceMetricSeries { current: string; data: number[]; }
interface PerformanceMetricsUI {
  loadTime: PerformanceMetricSeries;
  firstContentfulPaint: PerformanceMetricSeries;
  largestContentfulPaint: PerformanceMetricSeries;
}
interface ProcessedTagUI { name: string; status: string; icon: string }
interface RecommendationUI { type: string; title: string; description: string; impact: string }
interface LoadedReport {
  healthScore: number;
  detectedTags: ProcessedTagUI[];
  performanceMetrics: PerformanceMetricsUI;
  recommendations: RecommendationUI[];
  url: string;
  date: string;
}

// Backend response shapes (partial, only what we consume)
interface BackendPerformanceScores {
  loadTimeMs?: number; firstContentfulPaintMs?: number; largestContentfulPaintMs?: number; cumulativeLayoutShift?: number;
}
interface BackendProcessedTag { name?: string; status?: string; }
interface BackendFinding { type?: string; title?: string; description?: string; severity?: string; }
interface BackendAnalysis { processedTags?: BackendProcessedTag[]; findings?: BackendFinding[]; performanceScores?: BackendPerformanceScores; summary?: { healthScore?: number }; }
interface BackendResults {
  healthScore?: number;
  analysis?: BackendAnalysis;
  tags?: BackendProcessedTag[];
  performance?: BackendPerformanceScores;
  summary?: { url?: string; processedUrl?: string };
}

export default function ReportDetailPage() {
  const params = useParams();
  const reportId = params.id as string;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [report, setReport] = useState<LoadedReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load real audit results
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const resUnknown = await apiFetch(`/api/audit/${reportId}/results`) as unknown;
        type PossibleResponse = { data?: unknown; results?: unknown } | BackendResults | Record<string, unknown>;
        const root = resUnknown as PossibleResponse;
        const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
        let candidateUnknown: unknown = undefined;
        if (isObject(root)) {
          // Prefer data.results
          const dataVal = (root as Record<string, unknown>)['data'];
          if (isObject(dataVal)) {
            const possibleResults = dataVal['results'];
            if (possibleResults !== undefined) candidateUnknown = possibleResults;
          }
          // Fallback to root.results
          if (candidateUnknown === undefined && 'results' in root) {
            candidateUnknown = (root as Record<string, unknown>)['results'];
          }
          // Fallback to data object itself
            if (candidateUnknown === undefined && dataVal !== undefined) {
            candidateUnknown = dataVal;
          }
          // Final fallback root
          if (candidateUnknown === undefined) candidateUnknown = root;
        }
        if (!candidateUnknown || typeof candidateUnknown !== 'object') throw new Error('No results');
        const data = candidateUnknown as BackendResults;
        const healthScore = data.healthScore || data.analysis?.summary?.healthScore || 0;
        const rawTags = (data.analysis?.processedTags || data.tags || []) as BackendProcessedTag[];
        const tags: ProcessedTagUI[] = rawTags.map(t => {
          const name = String(t.name || '');
            return {
            name,
            status: t.status === 'ok' ? 'OK' : (t.status === 'warning' ? 'Warning' : 'Info'),
            icon: name.includes('Google') ? 'FaGoogle' : (name.includes('Facebook') || name.includes('Meta')) ? 'FaFacebook' : name.includes('Twitter') ? 'FaTwitter' : 'FaLinkedin'
          };
        });
        const perf = (data.analysis?.performanceScores || data.performance || {}) as BackendPerformanceScores;
        // Ensure we provide at least a couple of data points for charts so lines render
        const loadTimeMs = perf.loadTimeMs || 0;
        const fcpMs = perf.firstContentfulPaintMs || 0;
        const lcpMs = perf.largestContentfulPaintMs || 0;
        const toSecNum = (ms: number) => Number(((ms || 0) / 1000).toFixed(1));
        const perfMetrics: PerformanceMetricsUI = {
          loadTime: {
            current: `${toSecNum(loadTimeMs).toFixed(1)}s`,
            data: [toSecNum(loadTimeMs), toSecNum(loadTimeMs)]
          },
          firstContentfulPaint: {
            current: fcpMs ? `${toSecNum(fcpMs).toFixed(1)}s` : '0.0s',
            data: [toSecNum(fcpMs), toSecNum(fcpMs)]
          },
          largestContentfulPaint: {
            current: lcpMs ? `${toSecNum(lcpMs).toFixed(1)}s` : '0.0s',
            data: [toSecNum(lcpMs), toSecNum(lcpMs)]
          }
        };
        const rawFindings = (data.analysis?.findings || []).slice(0,20) as BackendFinding[];
        const recommendations: RecommendationUI[] = rawFindings.map(f => {
          const sev = (f.severity || '').toLowerCase();
          return {
            type: f.type === 'issue' ? 'issue' : (f.type === 'warning' ? 'warning' : 'info'),
            title: String(f.title || ''),
            description: String(f.description || ''),
            impact: sev === 'high' ? 'High' : sev === 'low' ? 'Low' : sev === 'medium' ? 'Medium' : 'Medium'
          };
        });
        if (!cancelled) {
          setReport({
            healthScore: healthScore || 0,
            detectedTags: tags,
            performanceMetrics: perfMetrics,
            recommendations,
            url: data.summary?.url || data.summary?.processedUrl || 'Unknown',
            date: new Date().toISOString().split('T')[0]
          });
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load report');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [reportId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-400">{error}</div>;
  }

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
          <PdfDownloadButton jobId={reportId} />
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
                  <PdfDownloadButton jobId={reportId} />
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
          <HealthScoreCard score={report.healthScore || 0} />

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
