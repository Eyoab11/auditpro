"use client";

import { FaGoogle, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

interface Tag {
  name: string;
  status: string;
  icon: string;
}

interface DetectedTagsListProps {
  tags: Tag[];
}

const iconMap = {
  FaGoogle: FaGoogle,
  FaFacebook: FaFacebook,
  FaTwitter: FaTwitter,
  FaLinkedin: FaLinkedin,
};

export default function DetectedTagsList({ tags }: DetectedTagsListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "OK":
        return "text-green-400";
      case "Warning":
        return "text-yellow-400";
      case "Issue":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="bg-[#181818] border border-white/10 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">Detected Marketing Tags</h3>
      <div className="space-y-3">
        {tags.map((tag, index) => {
          const IconComponent = iconMap[tag.icon as keyof typeof iconMap];
          return (
            <div key={index} className="flex items-center gap-4 p-3 bg-black/20 rounded-lg">
              {IconComponent && <IconComponent className="w-6 h-6 text-purple-400" />}
              <div className="flex-1">
                <span className="text-white font-medium">{tag.name}</span>
              </div>
              <span className={`font-semibold ${getStatusColor(tag.status)}`}>{tag.status}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
