import React from "react";
import { Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PopularityChart from "@/components/charts/PopularityChart";
import { mockChartData } from "@/utils/constants";

interface LandingPageProps {
  onConnect: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onConnect }) => {
  return (
    <div className="min-h-screen spotify-gradient text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-center mb-6">
            <Music className="w-12 h-12 text-spotify-green mr-3" />
            <h1 className="text-5xl font-bold">DiscoverTrue</h1>
          </div>

          {/* Subtitle */}
          <h2 className="text-2xl md:text-3xl mb-8 text-gray-300">
            "Is Your Discover Weekly Actually Discovering Anything?"
          </h2>

          {/* Preview Section */}
          <Card className="bg-black/50 backdrop-blur-sm border border-spotify-green/20 p-8 mb-8">
            <h3 className="text-xl mb-6 text-spotify-green">Preview Results</h3>

            {/* Stats Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">67%</div>
                <div className="text-sm text-gray-400">Popular Songs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">43%</div>
                <div className="text-sm text-gray-400">Known Artists</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">27%</div>
                <div className="text-sm text-gray-400">True Discovery</div>
              </div>
            </div>

            {/* Chart Preview */}
            <div className="h-48">
              <PopularityChart data={mockChartData} height={192} />
            </div>
          </Card>

          {/* CTA */}
          <Button
            onClick={onConnect}
            size="lg"
            className="bg-spotify-green hover:bg-spotify-green/90 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            <Music className="w-6 h-6 mr-2" />
            Connect Spotify to Start
          </Button>

          <p className="mt-4 text-gray-400 text-sm">
            Safe & secure - we only read your playlists
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
