import { useState, useEffect, useRef } from "react";
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
  const [isAuthenticated, setIsAuthenticated] = useState(
    spotifyService.isAuthenticated()
  );
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authCheckInProgress = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (authCheckInProgress.current) {
        console.log(
          "useSpotifyAuth: Auth check already in progress, skipping..."
        );
        return;
      }

      console.log("useSpotifyAuth: Checking authentication...");
      authCheckInProgress.current = true;

      try {
        const hasToken = spotifyService.isAuthenticated();
        if (hasToken) {
          console.log(
            "useSpotifyAuth: User is authenticated, fetching user data..."
          );
          setIsLoading(true);

          if (!user) {
            const userData = await spotifyService.getCurrentUser();
            console.log(
              "useSpotifyAuth: User data fetched:",
              userData.display_name
            );
            setUser(userData);
          }
          setIsAuthenticated(true);
        } else {
          console.log("useSpotifyAuth: User is not authenticated");
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        console.error("useSpotifyAuth: Auth check failed:", err);
        spotifyService.logout();
        setIsAuthenticated(false);
        setError("Authentication expired. Please log in again.");
      } finally {
        setIsLoading(false);
        authCheckInProgress.current = false;
      }
    };

    if (spotifyService.isAuthenticated() && !user) {
      checkAuth();
    } else if (!spotifyService.isAuthenticated()) {
      console.log("useSpotifyAuth: No authentication detected");
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const login = () => {
    console.log("useSpotifyAuth: Starting login process...");
    setError(null);
    const authUrl = spotifyService.getAuthUrl();
    window.location.href = authUrl;
  };

  const logout = () => {
    console.log("useSpotifyAuth: Logging out...");
    spotifyService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
    authCheckInProgress.current = false;
  };

  const handleCallback = async (code: string) => {
    console.log("useSpotifyAuth: Handling callback with code...");

    if (authCheckInProgress.current) {
      console.log("useSpotifyAuth: Callback already in progress, skipping...");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      authCheckInProgress.current = true;

      console.log("useSpotifyAuth: Exchanging code for token...");
      await spotifyService.exchangeCodeForToken(code);

      console.log("useSpotifyAuth: Fetching user data after token exchange...");
      const userData = await spotifyService.getCurrentUser();

      console.log("useSpotifyAuth: Authentication successful!");
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("useSpotifyAuth: Callback failed:", err);
      setError(err instanceof Error ? err.message : "Authentication failed");
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
      authCheckInProgress.current = false;
    }
  };

  console.log("useSpotifyAuth state:", {
    isAuthenticated,
    isLoading,
    hasUser: !!user,
    authCheckInProgress: authCheckInProgress.current,
  });

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
