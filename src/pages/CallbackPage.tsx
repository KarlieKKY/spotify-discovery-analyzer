// src/pages/CallbackPage.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Music, Loader } from "lucide-react";
import { useSpotifyAuth } from "@/hooks/useSpotifyAuth";
import { SpotifyService } from "@/services/spotify";

const CallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { handleCallback, isLoading, error } = useSpotifyAuth();

  useEffect(() => {
    const processCallback = async () => {
      const code = SpotifyService.extractCodeFromUrl(window.location.href);

      if (code) {
        try {
          await handleCallback(code);

          // Redirect to localhost version for better UX
          if (window.location.hostname === "127.0.0.1") {
            window.location.href = "http://localhost:5173/loading";
          } else {
            navigate("/loading");
          }
        } catch (err) {
          console.error("Callback processing failed:", err);
          // Redirect back to connect page on error
          navigate("/connect");
        }
      } else {
        console.error("No authorization code found");
        navigate("/connect");
      }
    };

    processCallback();
  }, [handleCallback, navigate]);

  if (error) {
    return (
      <div className="min-h-screen spotify-gradient text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Authentication Error</div>
          <div className="text-gray-300 mb-4">{error}</div>
          <button
            onClick={() => navigate("/connect")}
            className="bg-spotify-green hover:bg-spotify-green/90 text-white px-6 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen spotify-gradient text-white flex items-center justify-center">
      <div className="text-center">
        <Music className="w-16 h-16 mx-auto mb-4 text-spotify-green animate-pulse" />
        <h2 className="text-2xl font-bold mb-4">Connecting to Spotify...</h2>
        <Loader className="w-8 h-8 mx-auto animate-spin text-spotify-green" />
        <p className="text-gray-300 mt-4">
          Please wait while we set up your account
        </p>
      </div>
    </div>
  );
};

export default CallbackPage;
