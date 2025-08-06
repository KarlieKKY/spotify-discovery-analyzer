import React from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SpotifyUser } from "@/services/spotify";

interface DashboardHeaderProps {
  user: SpotifyUser | null;
  totalTracksAnalyzed: number;
  onLogout: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  totalTracksAnalyzed,
  onLogout,
}) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold">Your Music Journey</h1>
        <p className="text-gray-300">
          Personal insights from {totalTracksAnalyzed} tracks analyzed
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center text-gray-300">
          {user?.images?.[0]?.url ? (
            <img
              src={user.images[0].url}
              alt={user.display_name}
              className="w-8 h-8 rounded-full mr-2"
            />
          ) : (
            <span className="mr-2">👤</span>
          )}
          <span className="mr-3">{user?.display_name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-gray-400 hover:text-white"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
