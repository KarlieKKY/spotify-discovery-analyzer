import React from "react";
import { TrendingUp, Users, Star, BarChart3 } from "lucide-react";
import { StatCard } from "@/components/common";
import type { MusicInsights } from "@/types/musicInsights";

interface KeyMetricsProps {
  insights: MusicInsights;
}

export const KeyMetrics: React.FC<KeyMetricsProps> = ({ insights }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={<BarChart3 className="w-6 h-6 text-white" />}
        percentage={insights.genreDiversityScore}
        label="Genre Diversity"
        description={
          insights.genreDiversityScore > 70
            ? "Very diverse"
            : insights.genreDiversityScore > 40
            ? "Moderately diverse"
            : "Focused taste"
        }
        color="bg-purple-500"
        trend={insights.genreDiversityScore > 50 ? "higher" : "lower"}
      />
      <StatCard
        icon={<Users className="w-6 h-6 text-white" />}
        percentage={insights.artistLoyaltyScore}
        label="Artist Loyalty"
        description={
          insights.artistLoyaltyScore > 60 ? "Very loyal" : "Explorer"
        }
        color="bg-blue-500"
        trend={insights.artistLoyaltyScore > 50 ? "higher" : "lower"}
      />
      <StatCard
        icon={<TrendingUp className="w-6 h-6 text-white" />}
        percentage={insights.explorationScore}
        label="Exploration Score"
        description={
          insights.explorationScore > 60 ? "Adventurous" : "Comfort zone"
        }
        color="bg-green-500"
        trend={insights.explorationScore > 50 ? "higher" : "lower"}
      />
      <StatCard
        icon={<Star className="w-6 h-6 text-white" />}
        percentage={100 - insights.comfortZonePercentage}
        label="New Territory"
        description={`${insights.newArtistsDiscovered} new artists`}
        color="bg-yellow-500"
        trend="higher"
      />
    </div>
  );
};
