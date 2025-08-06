import React from "react";
import { Calendar, Music, BarChart3, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { InsightTab } from "@/types/musicInsights";

interface InsightTabsProps {
  activeInsight: InsightTab;
  onTabChange: (tab: InsightTab) => void;
}

export const InsightTabs: React.FC<InsightTabsProps> = ({
  activeInsight,
  onTabChange,
}) => {
  const tabs = [
    { id: "genres" as const, label: "Genres", icon: Music },
    { id: "artists" as const, label: "Artists", icon: Users },
    { id: "trends" as const, label: "Trends", icon: BarChart3 },
    { id: "journey" as const, label: "Journey", icon: Calendar },
  ];

  return (
    <div className="flex space-x-4 mb-6">
      {tabs.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          variant={activeInsight === id ? "default" : "outline"}
          onClick={() => onTabChange(id)}
          className={`${
            activeInsight === id
              ? "bg-spotify-green hover:bg-spotify-green/90"
              : "border-gray-600 hover:bg-gray-700 text-white"
          }`}
        >
          <Icon className="w-4 h-4 mr-2" />
          {label}
        </Button>
      ))}
    </div>
  );
};
