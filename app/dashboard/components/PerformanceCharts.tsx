"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Metric {
  current: string;
  data: number[];
}

interface PerformanceChartsProps {
  metrics: {
    loadTime: Metric;
    firstContentfulPaint: Metric;
    largestContentfulPaint: Metric;
  };
}

export default function PerformanceCharts({ metrics }: PerformanceChartsProps) {
  const chartData = metrics.loadTime.data.map((value, index) => ({
    day: `Day ${index + 1}`,
    loadTime: value,
    fcp: metrics.firstContentfulPaint.data[index],
    lcp: metrics.largestContentfulPaint.data[index],
  }));

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Metrics</h3>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">{metrics.loadTime.current}</p>
          <p className="text-sm text-gray-600">Load Time</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-teal-600">{metrics.firstContentfulPaint.current}</p>
          <p className="text-sm text-gray-600">First Contentful Paint</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">{metrics.largestContentfulPaint.current}</p>
          <p className="text-sm text-gray-600">Largest Contentful Paint</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="day" stroke="#6b7280" />
          {/* Ensure domain isn't collapsed when values are equal/zero */}
          <YAxis stroke="#6b7280" domain={[0, 'dataMax + 1']} allowDecimals />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          />
          <Line type="monotone" dataKey="loadTime" stroke="#a855f7" strokeWidth={2} dot={{ r: 2 }} />
          <Line type="monotone" dataKey="fcp" stroke="#14b8a6" strokeWidth={2} dot={{ r: 2 }} />
          <Line type="monotone" dataKey="lcp" stroke="#f97316" strokeWidth={2} dot={{ r: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
