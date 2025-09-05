"use client";

export default function PdfDownloadButton() {
  const handleDownload = () => {
    // Simulate download by opening mock data in new tab
    const data = {
      healthScore: 78,
      detectedTags: [
        { name: "Google Analytics", status: "OK" },
        { name: "Facebook Pixel", status: "Warning" },
      ],
      recommendations: [
        { title: "Optimize Images", description: "Compress images to reduce load time." },
      ],
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <button
      onClick={handleDownload}
      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition text-white"
    >
      Download PDF Report
    </button>
  );
}
