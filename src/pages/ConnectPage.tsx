// src/pages/ConnectPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Music, Shield, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSpotifyAuth } from "@/hooks/useSpotifyAuth";

const ConnectPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useSpotifyAuth();

  const handleBack = () => {
    console.log("Navigating back to landing");
    navigate("/");
  };

  const handleSpotifyConnect = () => {
    console.log("Starting Spotify authentication...");
    login(); // This will redirect to Spotify's auth page
  };

  return (
    <div className="min-h-screen spotify-gradient text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header with Back Button */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="mr-4 p-2 hover:bg-white/10 rounded-lg text-white hover:text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-2xl font-bold">DiscoverTrue</h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-md mx-auto mb-6">
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-center">
              <p className="text-red-200">{error}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-md mx-auto">
          <Card className="bg-black/50 backdrop-blur-sm border border-spotify-green/20 p-8">
            <div className="text-center">
              {/* Spotify Icon */}
              <div className="w-16 h-16 bg-spotify-green rounded-full flex items-center justify-center mx-auto mb-6">
                <Music className="w-8 h-8 text-white" />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold mb-6 text-white">
                Connect Your Spotify
              </h2>

              {/* Features List */}
              <div className="text-left mb-8 space-y-4">
                <p className="text-lg mb-4 text-white">We'll analyze your:</p>
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-center">
                    <Eye className="w-5 h-5 text-spotify-green mr-3 flex-shrink-0" />
                    <span>Current Discover Weekly playlist</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-spotify-green mr-3 flex-shrink-0" />
                    <span>Your recent listening history</span>
                  </div>
                  <div className="flex items-center">
                    <Music className="w-5 h-5 text-spotify-green mr-3 flex-shrink-0" />
                    <span>Your top artists (last 6 months)</span>
                  </div>
                </div>
              </div>

              {/* Connect Button */}
              <Button
                onClick={handleSpotifyConnect}
                disabled={isLoading}
                className="w-full bg-spotify-green hover:bg-spotify-green/90 text-white py-3 rounded-lg font-semibold transition-colors text-lg disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>🟢 Connect with Spotify</>
                )}
              </Button>

              {/* Security Info */}
              <div className="mt-6 text-sm text-gray-400 space-y-2">
                <div className="flex items-center justify-center">
                  <Shield className="w-4 h-4 mr-2" />
                  <span>Your data stays private and secure</span>
                </div>
                <div>We never modify your playlists</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ConnectPage;
