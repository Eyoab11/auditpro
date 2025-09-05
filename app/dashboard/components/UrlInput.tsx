"use client";

import { useState } from "react";

interface UrlInputProps {
  onAudit: (url: string) => void;
}

export default function UrlInput({ onAudit }: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
      onAudit(url);
    }, 3000);
  };

  return (
    <section className="relative flex flex-col items-center px-4 py-16 w-full overflow-hidden">
      {/* Gradient layers behind */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-700 via-blue-400 to-purple-500 opacity-25 blur-[100px]" />
        <div className="absolute left-1/4 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-purple-500 via-pink-400 to-blue-400 opacity-20 blur-[80px]" />
      </div>

      <div className="w-full max-w-4xl text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
          Audit Your Website<br />With <span className="text-purple-600">AuditPro</span>
        </h2>
        <p className="text-lg md:text-xl mb-8 text-gray-300">
          Enter your website URL below to start a comprehensive audit and get actionable insights.
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto" aria-label="Website audit">
          {/* Gradient border wrapper to emulate neon outline */}
          <div className="rounded-2xl bg-gradient-to-r from-purple-500/60 to-purple-500/20 p-[2px] shadow-[0_0_25px_rgba(139,92,246,0.25)]">
            <div className="flex items-center overflow-hidden rounded-2xl bg-black/40 backdrop-blur-sm ring-1 ring-inset ring-purple-500/20">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter your website URL (e.g., https://example.com)"
                className="w-full h-12 bg-transparent px-4 text-left text-base text-white/90 placeholder:text-white/50 focus:outline-none"
                aria-label="Website URL"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="group flex items-center gap-2 rounded-l-none rounded-2xl bg-purple-600 px-6 h-12 text-white font-medium text-sm shadow hover:bg-purple-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 disabled:opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" d="M10.5 3a7.5 7.5 0 1 0 4.773 13.39l3.669 3.668a.75.75 0 1 0 1.06-1.06l-3.668-3.67A7.5 7.5 0 0 0 10.5 3Zm-6 7.5a6 6 0 1 1 12 0 6 6 0 0 1-12 0Z" clipRule="evenodd" />
                </svg>
                <span className="whitespace-nowrap">{loading ? "Auditing..." : "Audit Now"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
