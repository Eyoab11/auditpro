"use client";

import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-gray-100 border-t border-gray-200 text-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-12 grid gap-10 md:grid-cols-3">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Image src="/globe.svg" alt="AuditPro" width={28} height={28} />
            <span className="font-bold text-lg tracking-tight">AuditPro</span>
          </div>
          <p className="text-sm text-gray-600">
            AI-powered auditing to discover tags, improve performance, and report clear results.
          </p>
        </div>

        {/* Links */}
        <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-6 md:gap-10">
          <ul className="space-y-2 text-sm">
            <li className="text-gray-700 font-semibold">Product</li>
            <li><a className="hover:text-purple-600" href="#features">Features</a></li>
            <li><a className="hover:text-purple-600" href="#">Pricing</a></li>
            <li><a className="hover:text-purple-600" href="#">Documentation</a></li>
          </ul>
          <ul className="space-y-2 text-sm">
            <li className="text-gray-700 font-semibold">Company</li>
            <li><a className="hover:text-purple-600" href="#">Careers</a></li>
          </ul>
        </nav>

        {/* Social */}
        <div>
          <p className="text-sm text-gray-700 mb-3">Follow</p>
          <div className="flex items-center gap-3">
            <a
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 ring-1 ring-gray-300"
              href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.486 11.24H16.29l-5.37-7.02-6.142 7.02H1.47l7.73-8.84L1 2.25h7.02l4.846 6.42 5.378-6.42Zm-1.158 19.5h1.833L7.005 3.19H5.05l12.036 18.56Z"/>
              </svg>
            </a>
            <a
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 ring-1 ring-gray-300"
              href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M4.983 3.5a2.25 2.25 0 1 1 0 4.5 2.25 2.25 0 0 1 0-4.5ZM3.75 9h2.466v11.25H3.75V9Zm6.03 0h2.363v1.536h.034c.329-.623 1.133-1.279 2.333-1.279 2.494 0 2.954 1.642 2.954 3.776v6.217h-2.466v-5.515c0-1.316-.025-3.01-1.836-3.01-1.84 0-2.122 1.437-2.122 2.92v5.605H9.78V9Z"/>
              </svg>
            </a>
            <a
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 ring-1 ring-gray-300"
              href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M12 2a10 10 0 0 0-3.162 19.492c.5.092.682-.217.682-.48 0-.236-.009-.866-.014-1.7-2.776.603-3.362-1.34-3.362-1.34-.454-1.154-1.11-1.462-1.11-1.462-.907-.62.069-.607.069-.607 1.003.07 1.53 1.03 1.53 1.03.892 1.529 2.342 1.088 2.91.833.091-.646.35-1.088.636-1.339-2.218-.252-4.555-1.109-4.555-4.939 0-1.09.39-1.984 1.03-2.683-.103-.253-.447-1.27.098-2.646 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.852.004 1.711.115 2.512.337 1.909-1.294 2.748-1.025 2.748-1.025.546 1.376.202 2.393.1 2.646.64.699 1.028 1.593 1.028 2.683 0 3.84-2.34 4.684-4.566 4.932.36.31.68.92.68 1.854 0 1.337-.012 2.414-.012 2.742 0 .266.18.577.688.479A10 10 0 0 0 12 2Z" clipRule="evenodd"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <p>© {year} AuditPro. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a className="hover:text-purple-600" href="#">Privacy</a>
            <a className="hover:text-purple-600" href="#">Terms</a>
            <a className="hover:text-purple-600" href="#">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
