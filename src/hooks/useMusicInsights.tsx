import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { spotifyService, type SpotifyUser } from "@/services/spotify";
import { MusicAnalysisService } from "@/services/musicAnalysis";
import type { MusicInsights } from "@/types/musicInsights";

export const useMusicInsights = () => {
  const navigate = useNavigate();
  const [insights, setInsights] = useState<MusicInsights | null>(null);
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const makeApiRequest = async (endpoint: string): Promise<any> => {
    const token = spotifyService.getAccessToken();
    if (!token) {
      throw new Error("No access token available");
    }

    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        spotifyService.logout();
        throw new Error("Spotify session expired. Please log in again.");
      }
      const errorText = await response.text();
      throw new Error(`Spotify API error (${response.status}): ${errorText}`);
    }

    return await response.json();
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        if (!spotifyService.isAuthenticated()) {
          navigate("/connect");
          return;
        }

        const userProfile = await spotifyService.getCurrentUser();
        setUser(userProfile);

        const musicInsights = await MusicAnalysisService.generateMusicInsights(
          makeApiRequest
        );
        setInsights(musicInsights);
      } catch (error: any) {
        console.error("Dashboard initialization failed:", error);
        if (
          error.response?.status === 401 ||
          error.message.includes("expired")
        ) {
          spotifyService.logout();
          navigate("/connect");
        } else {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeDashboard();
  }, [navigate]);

  const handleLogout = () => {
    spotifyService.logout();
    navigate("/");
  };

  return {
    insights,
    user,
    isLoading,
    error,
    handleLogout,
  };
};
