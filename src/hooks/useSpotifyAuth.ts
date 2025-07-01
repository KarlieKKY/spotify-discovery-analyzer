import { useState, useEffect } from "react";
import { spotifyService, type SpotifyUser } from "@/services/spotify";

interface UseSpotifyAuthReturn {
  isAuthenticated: boolean;
  user: SpotifyUser | null;
  isLoading: boolean;
  error: string | null;
  login: () => void;
  logout: () => void;
  handleCallback: (code: string) => Promise<void>;
}

export const useSpotifyAuth = (): UseSpotifyAuthReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (spotifyService.isAuthenticated()) {
          const userData = await spotifyService.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        spotifyService.logout();
        setError("Authentication expired. Please log in again.");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = () => {
    const authUrl = spotifyService.getAuthUrl();
    window.location.href = authUrl;
  };

  const logout = () => {
    spotifyService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
  };

  const handleCallback = async (code: string) => {
    try {
      setIsLoading(true);
      setError(null);

      await spotifyService.exchangeCodeForToken(code);
      const userData = await spotifyService.getCurrentUser();

      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Auth callback failed:", err);
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isAuthenticated,
    user,
    isLoading,
    error,
    login,
    logout,
    handleCallback,
  };
};
