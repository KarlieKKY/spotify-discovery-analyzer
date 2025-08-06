import React from "react";
import { Card } from "@/components/ui/card";
import { PopularityChart } from "@/components/charts";
import type { MusicInsights } from "@/types/musicInsights";

interface GenresInsightProps {
  insights: MusicInsights;
}

export const GenresInsight: React.FC<GenresInsightProps> = ({ insights }) => {
  return (
    <Card className="spotify-gradient border-gray-700 p-6 text-white">
      <h3 className="text-xl font-bold mb-6">Your Genre Landscape</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Genre Chart */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-center">
            Genre Distribution
          </h4>
          <PopularityChart
            data={insights.topGenres.map((genre) => ({
              name: genre.genre,
              value: genre.count,
            }))}
            height={300}
          />
        </div>

        {/* Genre List */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Top Genres</h4>
          <div className="space-y-3">
            {insights.topGenres.map((genre, index) => (
              <div
                key={genre.genre}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold text-spotify-green">
                    #{index + 1}
                  </span>
                  <span className="font-medium capitalize">{genre.genre}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-spotify-green h-2 rounded-full"
                      style={{ width: `${genre.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-400 w-10 text-right">
                    {genre.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
