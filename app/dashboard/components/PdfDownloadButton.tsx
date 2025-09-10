"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

interface Props { jobId: string; disabled?: boolean; className?: string; }

export default function PdfDownloadButton({ jobId, disabled, className }: Props) {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!jobId) return;
    setLoading(true);
    setError(null);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const res = await fetch(`${base}/api/audit/${jobId}/pdf`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include'
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-${jobId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      if (e instanceof Error) setError(e.message || 'Failed to download PDF');
      else setError('Failed to download PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="flex flex-col gap-2">
      <button
        onClick={handleDownload}
        disabled={loading || disabled || !token}
        className={`${className || 'px-6 py-3 rounded-lg font-semibold'} ${loading ? 'bg-purple-400 cursor-wait' : 'bg-purple-600 hover:bg-purple-700'} text-white transition disabled:opacity-50`}
      >
        {loading ? 'Generating...' : 'Download PDF Report'}
      </button>
      {error && <span className="text-xs text-red-400">{error}</span>}
      {!token && <span className="text-xs text-gray-400">Login required</span>}
    </div>
  );
}
