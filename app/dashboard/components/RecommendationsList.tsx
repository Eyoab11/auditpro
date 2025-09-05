"use client";

interface Recommendation {
  type: string;
  title: string;
  description: string;
  impact: string;
}

interface RecommendationsListProps {
  recommendations: Recommendation[];
}

export default function RecommendationsList({ recommendations }: RecommendationsListProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "warning":
        return "border-yellow-400 bg-yellow-400/10";
      case "issue":
        return "border-red-400 bg-red-400/10";
      default:
        return "border-gray-400 bg-gray-400/10";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "text-red-400";
      case "Medium":
        return "text-yellow-400";
      case "Low":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="bg-[#181818] border border-white/10 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">Key Findings & Recommendations</h3>
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div key={index} className={`p-4 rounded-lg border ${getTypeColor(rec.type)}`}>
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-lg font-semibold text-white">{rec.title}</h4>
              <span className={`font-medium ${getImpactColor(rec.impact)}`}>{rec.impact} Impact</span>
            </div>
            <p className="text-gray-300">{rec.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
