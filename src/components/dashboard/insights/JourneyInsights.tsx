import React from "react";
import { Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ArtistChart } from "@/components/charts";
import type { MusicInsights } from "@/types/musicInsights";

interface JourneyInsightProps {
  insights: MusicInsights;
}

export const JourneyInsight: React.FC<JourneyInsightProps> = ({ insights }) => {
  return (
    <Card className="spotify-gradient border-gray-700 p-6 text-white">
      <h3 className="text-xl font-bold mb-6">Your Musical Evolution</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Evolution Chart */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-center">
            Exploration vs. Comfort Zone
          </h4>
          <ArtistChart
            data={[
              {
                name: "Comfort Zone",
                value: insights.comfortZonePercentage,
                fill: "#EF4444",
              },
              {
                name: "Exploration",
                value: insights.explorationScore,
                fill: "#10B981",
              },
            ]}
            height={300}
          />
        </div>

        {/* Evolution Timeline */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Musical Timeline</h4>
          <div className="space-y-6">
            {insights.tasteEvolution.map((evolution, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-16 text-center">
                  <Clock className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                  <span className="text-xs text-gray-400">
                    {evolution.timeRange}
                  </span>
                </div>
                <div className="flex-1 bg-gray-700/50 p-3 rounded-lg">
                  <div className="font-medium capitalize text-sm">
                    {evolution.dominantGenre}
                  </div>
                  <div className="text-xs text-gray-400">
                    {evolution.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
