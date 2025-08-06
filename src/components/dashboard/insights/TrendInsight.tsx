import React from "react";
import { Card } from "@/components/ui/card";
import { PopularityChart, ArtistChart } from "@/components/charts";
import type { MusicInsights } from "@/types/musicInsights";

interface TrendsInsightProps {
  insights: MusicInsights;
}

export const TrendsInsight: React.FC<TrendsInsightProps> = ({ insights }) => {
  return (
    <div className="space-y-6">
      {/* Discovery Timeline */}
      <Card className="spotify-gradient border-gray-700 p-6 text-white">
        <h3 className="text-xl font-bold mb-6">Music Discovery Timeline</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4 text-center">
              Discovery Rate Over Time
            </h4>
            <PopularityChart
              data={insights.discoveryTimeline.map((item) => ({
                name: item.period.replace("Last ", "").replace(" months", "mo"),
                value: item.discoveryRate,
              }))}
              height={280}
            />
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Discovery Breakdown</h4>
            <div className="space-y-4">
              {insights.discoveryTimeline.map((item, index) => (
                <div key={index} className="bg-gray-700/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{item.period}</span>
                    <span className="text-spotify-green font-bold">
                      {item.discoveryRate}%
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {item.newArtists} new artists discovered
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Listening Habits */}
      <Card className="spotify-gradient border-gray-700 p-6 text-white">
        <h3 className="text-xl font-bold mb-6">Your Listening Habits</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-900/30 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">🕒</div>
            <div className="font-semibold mb-1">Most Active Period</div>
            <div className="text-blue-300">
              {insights.listeningHabits.mostActiveTimeRange}
            </div>
          </div>
          <div className="bg-purple-900/30 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">
              {insights.listeningHabits.diversityTrend === "increasing"
                ? "📈"
                : insights.listeningHabits.diversityTrend === "decreasing"
                ? "📉"
                : "➖"}
            </div>
            <div className="font-semibold mb-1">Diversity Trend</div>
            <div className="text-purple-300 capitalize">
              {insights.listeningHabits.diversityTrend}
            </div>
          </div>
          <div className="bg-green-900/30 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">
              {insights.listeningHabits.explorationPattern.includes(
                "Adventurous"
              )
                ? "🚀"
                : insights.listeningHabits.explorationPattern.includes(
                    "Comfort"
                  )
                ? "🏠"
                : "⚖️"}
            </div>
            <div className="font-semibold mb-1">Listening Style</div>
            <div className="text-green-300">
              {insights.listeningHabits.explorationPattern}
            </div>
          </div>
        </div>
      </Card>

      {/* Genre Evolution */}
      <Card className="spotify-gradient border-gray-700 p-6 text-white">
        <h3 className="text-xl font-bold mb-6">Genre Evolution</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4 text-center">
              Genre Shift Timeline
            </h4>
            <div className="space-y-4">
              {insights.genreEvolution.map((evolution, index) => (
                <div
                  key={index}
                  className="border-l-4 border-spotify-green pl-4"
                >
                  <div className="font-semibold text-spotify-green">
                    {evolution.timeRange}
                  </div>
                  <div className="text-sm text-gray-400 mb-2">
                    {evolution.change}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {evolution.topGenres.map((genre, gIndex) => (
                      <span
                        key={gIndex}
                        className="px-2 py-1 bg-gray-700 rounded text-xs"
                      >
                        {genre.genre} ({genre.percentage}%)
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-center">
              Current Genre Split
            </h4>
            <ArtistChart
              data={
                insights.genreEvolution[0]?.topGenres.map((genre, index) => ({
                  name: genre.genre,
                  value: genre.percentage,
                  fill: ["#10B981", "#F59E0B", "#3B82F6"][index] || "#EF4444",
                })) || []
              }
              height={280}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
