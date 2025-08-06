import React, { useState } from "react";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KeyMetrics } from "@/components/dashboard/KeyMetrics";
import { InsightTabs } from "@/components/dashboard/InsightTabs";
import * as Insights from "@/components/dashboard/insights";
import { useMusicInsights } from "@/hooks/useMusicInsights";
import type { InsightTab } from "@/types/musicInsights";

const Dashboard: React.FC = () => {
  const { insights, user, isLoading, error, handleLogout } = useMusicInsights();
  const [activeInsight, setActiveInsight] = useState<InsightTab>("genres");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 mx-auto animate-spin text-spotify-green mb-4" />
          <p className="text-xl mb-2">Analyzing your music journey...</p>
          <p className="text-gray-300">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Error: {error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-spotify-green"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!insights) {
    return null;
  }

  const renderInsightContent = () => {
    switch (activeInsight) {
      case "genres":
        return <Insights.GenresInsight insights={insights} />;
      case "artists":
        return <Insights.ArtistsInsight insights={insights} />;
      case "trends":
        return <Insights.TrendsInsight insights={insights} />;
      case "journey":
        return <Insights.JourneyInsight insights={insights} />;
      default:
        return <Insights.GenresInsight insights={insights} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader
          user={user}
          totalTracksAnalyzed={insights.totalTracksAnalyzed}
          onLogout={handleLogout}
        />

        <KeyMetrics insights={insights} />

        <InsightTabs
          activeInsight={activeInsight}
          onTabChange={setActiveInsight}
        />

        {renderInsightContent()}
      </div>
    </div>
  );
};

export default Dashboard;
