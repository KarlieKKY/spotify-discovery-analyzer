import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Music, Loader } from "lucide-react";

const CallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) {
      return;
    }
    hasProcessed.current = true;

    const processCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const errorParam = urlParams.get("error");
        const code = urlParams.get("code");

        if (errorParam) {
          console.error("Spotify auth error:", errorParam);
          navigate("/connect");
          return;
        }

        if (!code) {
          console.error("No authorization code found");
          navigate("/connect");
          return;
        }

        const existingToken = localStorage.getItem("spotify_access_token");
        if (existingToken) {
          navigate("/loading");
          return;
        }

        const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
        const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
        const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: redirectUri,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Token exchange failed:", errorText);
          navigate("/connect");
          return;
        }

        const tokenData = await response.json();

        localStorage.setItem("spotify_access_token", tokenData.access_token);

        const savedToken = localStorage.getItem("spotify_access_token");
        if (savedToken) {
          navigate("/loading");
        } else {
          console.error("Failed to save token");
          navigate("/connect");
        }
      } catch (error: any) {
        console.error("Callback processing error:", error);
        navigate("/connect");
      }
    };

    setTimeout(processCallback, 500);
  }, [navigate]);

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
