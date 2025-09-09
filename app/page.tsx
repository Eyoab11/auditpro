"use client";
import Image from "next/image";
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { useMemo, useRef } from 'react';
import Carousel from './components/Carousel';
import Footer from './components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

function SnowField({ count = 1500 }: { count?: number }) {
  // Use a loose type to avoid dependency on three type import here while still avoiding 'any'
  // Points from three.js extends Object3D; we only access geometry safely.
  const pointsRef = useRef<{ geometry?: { attributes: { position: { array: unknown; needsUpdate: boolean } } } } | null>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3 + 0] = (Math.random() - 0.5) * 20; // x
      arr[i3 + 1] = (Math.random() - 0.5) * 20; // y
      arr[i3 + 2] = (Math.random() - 0.5) * 20; // z
    }
    return arr;
  }, [count]);
  const speeds = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) arr[i] = 0.02 + Math.random() * 0.08;
    return arr;
  }, [count]);

  useFrame(() => {
    const geo = pointsRef.current?.geometry;
    if (!geo) return;
    const pos = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3 + 1] -= speeds[i];
      if (pos[i3 + 1] < -10) {
        pos[i3 + 1] = 10;
        pos[i3 + 0] = (Math.random() - 0.5) * 20;
        pos[i3 + 2] = (Math.random() - 0.5) * 20;
      }
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.05} sizeAttenuation opacity={0.9} transparent />
    </points>
  );
}

export default function Home() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 shadow-sm relative">
        <div className="flex items-center gap-2">
          <Image src="/globe.svg" alt="AuditPro Logo" width={32} height={32} />
          <span className="font-bold text-xl tracking-tight">AuditPro</span>
        </div>
        
        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-8 text-base font-medium">
          <li><a href="#features" className="hover:text-purple-600 transition">Features</a></li>
          <li><a href="#about" className="hover:text-purple-600 transition">About</a></li>
          <li><a href="#contact" className="hover:text-purple-600 transition">Contact</a></li>
          <li><Link href="/report-history" className="hover:text-purple-600 transition">History</Link></li>
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
        <Link href="/auth/signup" className="hidden md:inline-block px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition">Get Started</Link>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-50 border-t">
            <div className="px-8 py-4 space-y-4">
              <a 
                href="#features" 
                className="block py-2 hover:text-purple-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#about" 
                className="block py-2 hover:text-purple-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>
              <a 
                href="#contact" 
                className="block py-2 hover:text-purple-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
              <Link 
                href="/report-history" 
                className="block py-2 hover:text-purple-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                History
              </Link>
              <div className="pt-4 border-t border-gray-200">
                <Link 
                  href="/auth/signup" 
                  className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
  <section className="relative flex flex-col items-center px-4 min-h-screen w-full overflow-hidden pt-36" style={{ minHeight: '100vh' }}>
        {/* Gradient layers behind Canvas for color depth */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-gradient-to-tr from-blue-700 via-blue-400 to-purple-500 opacity-35 blur-[120px]" />
          <div className="absolute left-1/4 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-500 via-pink-400 to-blue-400 opacity-25 blur-[90px]" />
        </div>

        {/* 3D Canvas Background with Framer Motion (Snow-like particles) */}
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
        >
          <Canvas className="w-full h-full" style={{ width: '100%', height: '100%' }} gl={{ alpha: true, antialias: true }} camera={{ position: [0, 0, 8], fov: 55 }}>
            {/* Points don't need lights; keep background transparent */}
            <SnowField count={1600} />
          </Canvas>
        </motion.div>
        <motion.div
          className="w-full max-w-2xl text-center relative z-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Simplify Your Audits<br />With <span className="text-purple-600">AuditPro</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-700 dark:text-gray-300">
            Streamline your audit process, improve accuracy, and save time with our modern audit management platform.
          </p>
          {/* Search field with side button */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push('/auth/login');
            }}
            className="mx-auto mb-6 w-full max-w-3xl"
            aria-label="Website scan"
          >
            {/* Gradient border wrapper to emulate neon outline */}
            <div className="rounded-2xl bg-gradient-to-r from-purple-500/60 to-purple-500/20 p-[2px] shadow-[0_0_25px_rgba(139,92,246,0.25)]">
        <div className="flex items-center overflow-hidden rounded-2xl bg-black/40 backdrop-blur-sm ring-1 ring-inset ring-purple-500/20">
                <input
                  type="url"
                  inputMode="url"
                  placeholder="Enter your website URL (e.g., https://example.com)"
          className="w-full h-11 bg-transparent px-4 text-left text-base text-white/90 placeholder:text-white/50 focus:outline-none"
                  aria-label="Website URL"
                />
                <button
                  type="submit"
                  className="group flex items-center gap-1 rounded-l-none rounded-2xl bg-purple-600 px-5 h-11 text-white font-medium text-sm shadow hover:bg-purple-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
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
                  <span className="whitespace-nowrap">Scan Now</span>
                </button>
              </div>
            </div>
          </form>
          <Link href="/auth/signup" className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition font-semibold text-lg">Get Started</Link>
        </motion.div>
      </section>
      {/* Features Section */}
      <section className="w-full bg-[#181818] py-24 flex flex-col items-center justify-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-3">Why Choose AuditPro</h2>
        <p className="text-base text-center text-gray-300 mb-8">Powerful features designed to transform your website performance</p>
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center w-full max-w-5xl mx-auto">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            whileHover={{ scale: 1.06, boxShadow: "0 0 32px 0 #a855f7, 0 2px 16px #000" }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="flex-1 min-w-[260px] bg-[#181818] border border-purple-700/30 rounded-xl p-10 flex flex-col items-center shadow-lg cursor-pointer"
          >
            <div className="mb-6 flex items-center justify-center">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-900/30">
                {/* Chip Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-purple-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6v6H9V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9h2m2-6v2m10-2v2m2 4h2m-2 10v2m-10 2v-2m-2-4H3m16-4h2" />
                </svg>
              </span>
            </div>
            <span className="text-xl font-bold text-white mb-2 text-center">Automated Tag Auditing</span>
            <p className="text-sm text-gray-400 text-center mb-6">Instantly detect and analyze all tracking tags, pixels, and scripts on your website with AI-powered precision.</p>
            <a href="#" className="inline-flex items-center gap-2 px-5 py-2 rounded-lg border border-purple-500 text-purple-500 font-medium hover:bg-purple-900/20 transition">
              Learn More
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>
          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            whileHover={{ scale: 1.06, boxShadow: "0 0 32px 0 #14b8a6, 0 2px 16px #000" }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="flex-1 min-w-[260px] bg-[#181818] border border-teal-600/30 rounded-xl p-10 flex flex-col items-center shadow-lg cursor-pointer"
          >
            <div className="mb-6 flex items-center justify-center">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-900/30">
                {/* Lightning Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-teal-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </span>
            </div>
            <span className="text-xl font-bold text-white mb-2 text-center">Performance Optimization</span>
            <p className="text-sm text-gray-400 text-center mb-6">Identify bottlenecks and receive actionable recommendations to boost your website&apos;s speed and user experience.</p>
            <a href="#" className="inline-flex items-center gap-2 px-5 py-2 rounded-lg border border-teal-400 text-teal-400 font-medium hover:bg-teal-900/20 transition">
              Learn More
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>
          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            whileHover={{ scale: 1.06, boxShadow: "0 0 32px 0 #f97316, 0 2px 16px #000" }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="flex-1 min-w-[260px] bg-[#181818] border border-orange-600/30 rounded-xl p-10 flex flex-col items-center shadow-lg cursor-pointer relative"
          >
            <div className="mb-6 flex items-center justify-center">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-900/30">
                {/* Bulb Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-orange-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a7 7 0 0 1 7 7c0 2.386-1.28 4.434-3.2 5.6A2.5 2.5 0 0 1 14 18v1a2 2 0 1 1-4 0v-1a2.5 2.5 0 0 1-1.8-3.4A7.001 7.001 0 0 1 5 9a7 7 0 0 1 7-7z" />
                </svg>
              </span>
            </div>
            <span className="text-xl font-bold text-white mb-2 text-center">Actionable AI Recommendations</span>
            <p className="text-sm text-gray-400 text-center mb-6">Get intelligent, prioritized suggestions powered by machine learning to fix issues and improve your site.</p>
            <a href="#" className="inline-flex items-center gap-2 px-5 py-2 rounded-lg border border-orange-500 text-orange-500 font-medium hover:bg-orange-900/20 transition">
              Learn More
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>
      {/* Impact Section */}
      <section className="w-full bg-[#181818] py-24 flex flex-col items-center justify-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-3">AuditPro Impact</h2>
        <p className="text-base text-center text-gray-300 mb-8">Real results from our AI-powered website auditing platform</p>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center w-full max-w-4xl mx-auto">
          {/* Stat 1 */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            whileHover={{ scale: 1.06, boxShadow: "0 0 32px 0 #a855f7, 0 2px 16px #000" }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="flex-1 min-w-[180px] bg-[#181818] border border-purple-700/30 rounded-lg p-6 flex flex-col items-center shadow-md cursor-pointer"
          >
            <span className="text-2xl md:text-3xl font-extrabold text-purple-500 mb-1">1.3M+</span>
            <span className="text-base font-bold text-white mb-1">Websites Scanned</span>
            <span className="text-sm text-gray-400">Comprehensive audits completed</span>
          </motion.div>
          {/* Stat 2 */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            whileHover={{ scale: 1.06, boxShadow: "0 0 32px 0 #14b8a6, 0 2px 16px #000" }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="flex-1 min-w-[180px] bg-[#181818] border border-teal-600/30 rounded-lg p-6 flex flex-col items-center shadow-md cursor-pointer"
          >
            <span className="text-2xl md:text-3xl font-extrabold text-teal-400 mb-1">8.7M+</span>
            <span className="text-base font-bold text-white mb-1">Issues Identified</span>
            <span className="text-sm text-gray-400">Problems detected and analyzed</span>
          </motion.div>
          {/* Stat 3 */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            whileHover={{ scale: 1.06, boxShadow: "0 0 32px 0 #f97316, 0 2px 16px #000" }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="flex-1 min-w-[180px] bg-[#181818] border border-orange-600/30 rounded-lg p-6 flex flex-col items-center shadow-md cursor-pointer"
          >
            <span className="text-2xl md:text-3xl font-extrabold text-orange-500 mb-1">Up to 70%</span>
            <span className="text-base font-bold text-white mb-1">Optimization Achieved</span>
            <span className="text-sm text-gray-400">Performance improvement potential</span>
          </motion.div>
        </div>
      </section>
      {/* Testimonials / Value Carousel Section */}
      <section className="w-full bg-[#0f0f0f] py-24 flex items-center justify-center">
        <div className="w-full max-w-5xl px-4">
          <h3 className="text-3xl md:text-4xl font-extrabold text-center mb-4">What Teams Achieve</h3>
          <p className="text-base text-center text-gray-300 mb-10">Results and customer quotes rotating every 10 seconds, with manual controls</p>
          <Carousel
            ariaLabel="AuditPro results carousel"
            heightClass="h-64 md:h-72"
            items={[
              (
                <div key="carousel-1" className="grid md:grid-cols-[1.1fr_1fr] gap-8 items-center w-full">
                  <div className="space-y-3">
                    <h4 className="text-2xl font-bold">70% Faster Tag Audits</h4>
                    <p className="text-gray-300">Automate discovery of pixels, marketing tags, and scripts across your pages. Focus on insights, not manual checks.</p>
                    <ul className="text-sm text-gray-400 list-disc pl-5">
                      <li>Auto-detect misfired events</li>
                      <li>Map vendors and data flows</li>
                      <li>One-click export</li>
                    </ul>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/30 p-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-extrabold text-purple-500">70%</span>
                      <span className="text-sm text-gray-400">avg. time saved</span>
                    </div>
                    <p className="mt-4 text-sm text-gray-300">“AuditPro cut our audit from days to hours.” — GrowthOps Lead</p>
                  </div>
                </div>
              ),
              (
                <div key="carousel-2" className="grid md:grid-cols-[1.1fr_1fr] gap-8 items-center w-full">
                  <div className="space-y-3">
                    <h4 className="text-2xl font-bold">Performance You Can Feel</h4>
                    <p className="text-gray-300">Pinpoint render-blockers and heavy scripts with prioritized fixes.</p>
                    <ul className="text-sm text-gray-400 list-disc pl-5">
                      <li>Script impact scoring</li>
                      <li>Lazy-load recommendations</li>
                      <li>Immediate wins highlighted</li>
                    </ul>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/30 p-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-extrabold text-teal-400">+18</span>
                      <span className="text-sm text-gray-400">Lighthouse points</span>
                    </div>
                    <p className="mt-4 text-sm text-gray-300">“Our LCP improved within a week.” — Web Perf Engineer</p>
                  </div>
                </div>
              ),
              (
                <div key="carousel-3" className="grid md:grid-cols-[1.1fr_1fr] gap-8 items-center w-full">
                  <div className="space-y-3">
                    <h4 className="text-2xl font-bold">Proof for Stakeholders</h4>
                    <p className="text-gray-300">Share concise reports with deltas and clear next steps.</p>
                    <ul className="text-sm text-gray-400 list-disc pl-5">
                      <li>Executive summaries</li>
                      <li>Issue owners and status</li>
                      <li>Audit history and trends</li>
                    </ul>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/30 p-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-extrabold text-orange-500">95%</span>
                      <span className="text-sm text-gray-400">stakeholder clarity</span>
                    </div>
                    <p className="mt-4 text-sm text-gray-300">“The reports make adoption easy.” — Marketing Analytics Director</p>
                  </div>
                </div>
              ),
            ]}
          />
        </div>
      </section>
  <Footer />
    </main>
  );
}
