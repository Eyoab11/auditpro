"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import UrlInput from "./components/UrlInput";
import HealthScoreCard from "./components/HealthScoreCard";
import DetectedTagsList from "./components/DetectedTagsList";
import PerformanceCharts from "./components/PerformanceCharts";
import RecommendationsList from "./components/RecommendationsList";
// Removed mockData import – no longer used
import { useAuth } from "../context/AuthContext";
import RequireAuth from "../components/RequireAuth";
import apiFetch from "../../utils/api";

interface AuditHistoryItem {
  jobId: string;
  url: string;
  status: 'pending' | 'scanning' | 'analyzing' | 'completed' | 'failed';
  createdAt?: string;
  updatedAt?: string;
  score?: number;
}

interface ProcessedTag {
  name?: string;
  id?: string;
  type?: string;
  status?: string;
  [key: string]: unknown;
}

interface Finding {
  type?: string;
  severity?: string;
  title?: string;
  message?: string;
  id?: string;
  description?: string;
  details?: string;
  [key: string]: unknown;
}

interface PerformanceScores {
  overallScore?: number;
  loadTimeMs?: number;
  firstContentfulPaintMs?: number;
  largestContentfulPaintMs?: number;
  cumulativeLayoutShift?: number;
  [key: string]: unknown;
}

interface BackendResultsShape {
  healthScore?: number;
  analysis?: {
    performanceScores?: PerformanceScores;
    processedTags?: ProcessedTag[];
    findings?: Finding[]; // some variants may use 'findings'
    auditFindings?: Finding[]; // alternate naming from python
  };
  performance?: {
    loadTimeMs?: number;
    firstContentfulPaintMs?: number;
    largestContentfulPaintMs?: number;
    [key: string]: unknown;
  };
  tags?: ProcessedTag[];
  [key: string]: unknown;
}

interface AuditDisplayData {
  healthScore: number;
  detectedTags: { name: string; status: string; icon: string }[];
  performanceMetrics: {
    loadTime: { current: string; data: number[] };
    firstContentfulPaint: { current: string; data: number[] };
    largestContentfulPaint: { current: string; data: number[] };
  };
  recommendations: { type: string; title: string; description: string; impact: string }[];
}

export default function Dashboard() {
  const [audited, setAudited] = useState(false);
  const { user, logout } = useAuth();
  const [history, setHistory] = useState<AuditHistoryItem[]>([]);

  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [auditStatus, setAuditStatus] = useState<'idle' | 'submitting' | 'pending' | 'completed' | 'failed'>('idle');
  const [failureReason, setFailureReason] = useState<string | null>(null);
  const [auditData, setAuditData] = useState<AuditDisplayData | null>(null);
  const pollTimer = useRef<NodeJS.Timeout | null>(null);
  const pollStart = useRef<number | null>(null);

  async function loadHistory() {
    try {
      const res = await apiFetch('/api/audit');
      if (res?.data?.items) {
        const items: AuditHistoryItem[] = res.data.items;
        setHistory(items);
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }
  }

  useEffect(() => { loadHistory(); }, []);

  const mapResultsToDisplay = useCallback((results: BackendResultsShape): AuditDisplayData => {
    const performanceScores = results.analysis?.performanceScores;
    const healthScore = results.healthScore || performanceScores?.overallScore || 0;

    const rawTags: ProcessedTag[] = results.analysis?.processedTags || results.tags || [];
    const detectedTags = rawTags.slice(0, 25).map((t: ProcessedTag) => ({
      name: (t.name || t.id || t.type || 'Tag') as string,
      status: (t.status === 'ok' ? 'OK' : (t.status ? (t.status[0]?.toUpperCase() + t.status.slice(1)) : 'OK')),
      icon: 'FaGoogle'
    }));

    const perf = results.performance || {};
    const ps = performanceScores || {};

    const loadTimeMs = (ps.loadTimeMs || perf.loadTimeMs || 0) as number;
    const fcpMs = (ps.firstContentfulPaintMs || perf.firstContentfulPaintMs || 0) as number;
    const lcpMs = (ps.largestContentfulPaintMs || perf.largestContentfulPaintMs || 0) as number;

    const toSecString = (ms: number) => ms ? (ms/1000).toFixed(1)+'s' : '0.0s';

    const performanceMetrics = {
      loadTime: { current: toSecString(loadTimeMs), data: [loadTimeMs, loadTimeMs].map(v => Number((v/1000).toFixed(1))) },
      firstContentfulPaint: { current: toSecString(fcpMs), data: [fcpMs, fcpMs].map(v => Number((v/1000).toFixed(1))) },
      largestContentfulPaint: { current: toSecString(lcpMs), data: [lcpMs, lcpMs].map(v => Number((v/1000).toFixed(1))) }
    };

    const findingsSource: Finding[] = results.analysis?.findings || results.analysis?.auditFindings || [];
    const recommendations = findingsSource.slice(0, 20).map((f: Finding) => ({
      type: (f.type || f.severity || 'info') as string,
      title: (f.title || f.message || f.id || 'Recommendation') as string,
      description: (f.description || f.details || 'No description provided.') as string,
      impact: f.severity ? (f.severity[0].toUpperCase() + f.severity.slice(1)) : 'Medium'
    }));

    return {
      healthScore: Math.max(0, Math.min(100, Math.round(healthScore))),
      detectedTags,
      performanceMetrics,
      recommendations
    };
  }, []);

  const fetchResults = useCallback(async (jobId: string) => {
    try {
      const res = await apiFetch(`/api/audit/${jobId}/results`);
      if (res?.data) {
        const mapped = mapResultsToDisplay((res.data.results || res.data) as BackendResultsShape);
        setAuditData(mapped);
        setAuditStatus('completed');
        loadHistory();
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('not yet available') || err.message.includes('status is')) {
          return; // still processing
        }
        console.error('Failed to fetch results', err.message);
      } else {
        console.error('Failed to fetch results (unknown error)');
      }
      setAuditStatus('failed');
    }
  }, [mapResultsToDisplay]);

  const pollStatus = useCallback(async () => {
    if (!currentJobId) return;
    try {
      const res = await apiFetch(`/api/audit/${currentJobId}/status`);
      const status: AuditHistoryItem['status'] | undefined = res?.data?.status;
      const errMsg: string | undefined = res?.data?.errorMessage;
      if (status === 'completed') {
        await fetchResults(currentJobId);
        if (pollTimer.current) { clearTimeout(pollTimer.current); pollTimer.current = null; }
        return;
      }
      if (status === 'failed') {
        setFailureReason(errMsg || 'Audit failed');
        setAuditStatus('failed');
        if (pollTimer.current) { clearTimeout(pollTimer.current); pollTimer.current = null; }
        return;
      }
      if (pollStart.current && Date.now() - pollStart.current > 120000) {
        setFailureReason('Timed out waiting for completion');
        setAuditStatus('failed');
        return;
      }
      pollTimer.current = setTimeout(pollStatus, 2500);
    } catch (e) {
      console.error('Status poll error', e);
      pollTimer.current = setTimeout(pollStatus, 4000);
    }
  }, [currentJobId, fetchResults]);

  useEffect(() => {
    if (currentJobId && auditStatus === 'pending') {
      pollStart.current = Date.now();
      pollStatus();
    }
    return () => { if (pollTimer.current) clearTimeout(pollTimer.current); };
  }, [currentJobId, auditStatus, pollStatus]);

  const handleAudit = (url: string, jobId?: string) => {
    setAudited(true);
    setAuditData(null);
    setFailureReason(null);
    if (jobId) {
      setCurrentJobId(jobId);
      setAuditStatus('pending');
    } else {
      setAuditStatus('failed');
    }
  };

  const renderSpinner = () => (
    <div className="px-6 pb-8 animate-pulse">
      <div className="bg-[#181818] border border-white/10 rounded-xl p-8 flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-4 border-purple-600 border-t-transparent animate-spin" aria-label="Loading" />
        <p className="text-gray-400 text-sm">Processing audit... This may take up to a minute.</p>
        {currentJobId && <p className="text-xs text-gray-500">Job ID: {currentJobId}</p>}
      </div>
    </div>
  );

  const dataToShow: AuditDisplayData | null = auditData || null;

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
        <div className="hidden md:flex items-center gap-4">
          <span className="text-gray-400">Welcome, {user?.name || 'User'}</span>
          <button onClick={logout} className="text-sm text-purple-400 hover:text-purple-300">Logout</button>
        </div>
      </nav>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto">
          <UrlInput onAudit={handleAudit} />

          {audited && (
            <div className="px-6 pb-8 space-y-8">
              {auditStatus === 'pending' && renderSpinner()}
              {auditStatus === 'failed' && !auditData && (
                <div className="bg-[#181818] border border-white/10 rounded-xl p-6 text-sm">
                  <p className="text-red-400 font-medium mb-1">Audit failed</p>
                  <p className="text-red-300/80">{failureReason || 'Audit failed or timed out. Please retry.'}</p>
                  {currentJobId && <p className="text-xs text-gray-500 mt-2">Job ID: {currentJobId}</p>}
                </div>
              )}
              {auditStatus === 'completed' && dataToShow && (
                <>
                  <HealthScoreCard score={dataToShow.healthScore} />
                  <div className="grid lg:grid-cols-2 gap-8">
                    <DetectedTagsList tags={dataToShow.detectedTags} />
                    <PerformanceCharts metrics={dataToShow.performanceMetrics} />
                  </div>
                  <RecommendationsList recommendations={dataToShow.recommendations} />
                </>
              )}

              {/* Recent History */}
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
