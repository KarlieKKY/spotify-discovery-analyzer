import React from "react";
import { Card } from "@/components/ui/card";
import { ArtistChart } from "@/components/charts";
import type { MusicInsights } from "@/types/musicInsights";

interface ArtistsInsightProps {
  insights: MusicInsights;
}

export const ArtistsInsight: React.FC<ArtistsInsightProps> = ({ insights }) => {
  return (
    <Card className="spotify-gradient border-gray-700 p-6 text-white">
      <h3 className="text-xl font-bold mb-6">Your Artist Relationships</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Artist Loyalty Chart */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-center">
            Artist Discovery vs. Loyalty
          </h4>
          <ArtistChart
            data={[
              {
                name: "Loyal Favorites",
                value: insights.artistLoyaltyScore,
                fill: "#F59E0B",
              },
              {
                name: "New Discoveries",
                value: 100 - insights.artistLoyaltyScore,
                fill: "#10B981",
              },
            ]}
            height={300}
          />
        </div>

        {/* Artist Lists */}
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3 text-spotify-green">
              Recent Favorites
            </h4>
            <div className="space-y-2">
              {insights.topArtists
                .filter((a) => a.timeRange === "Last 4 weeks")
                .map((artist, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-700/50 p-2 rounded"
                  >
                    <span className="truncate">{artist.name}</span>
                    <span className="text-xs text-gray-400 ml-2">
                      {artist.playCount}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
