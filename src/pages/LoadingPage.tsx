// src/pages/LoadingPage.tsx (Updated for Music Insights)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Music, CheckCircle, Loader } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { spotifyService } from "@/services/spotify";

interface LoadingStep {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  loading: boolean;
}

const LoadingPage: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [steps, setSteps] = useState<LoadingStep[]>([
    {
      id: "fetch-profile",
      label: "Loading your profile",
      description: "Getting your Spotify account information",
      completed: false,
      loading: true,
    },
    {
      id: "analyze-top-artists",
      label: "Analyzing your favorite artists",
      description:
        "Gathering your listening history across different time periods",
      completed: false,
      loading: false,
    },
    {
      id: "analyze-genres",
      label: "Mapping your genre preferences",
      description: "Calculating your musical diversity and patterns",
      completed: false,
      loading: false,
    },
    {
      id: "generate-insights",
      label: "Generating personal insights",
      description: "Creating your musical journey analysis",
      completed: false,
      loading: false,
    },
  ]);

  // Helper method to make API requests
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

  // Generate music insights
  const generateMusicInsights = async () => {
    console.log("Generating comprehensive music insights...");

    // Get user's listening data across different time ranges
    const [shortTerm, mediumTerm, longTerm] = await Promise.all([
      makeApiRequest("/me/top/artists?limit=50&time_range=short_term"),
      makeApiRequest("/me/top/artists?limit=50&time_range=medium_term"),
      makeApiRequest("/me/top/artists?limit=50&time_range=long_term"),
    ]);

    const [shortTermTracks, mediumTermTracks, longTermTracks] =
      await Promise.all([
        makeApiRequest("/me/top/tracks?limit=50&time_range=short_term"),
        makeApiRequest("/me/top/tracks?limit=50&time_range=medium_term"),
        makeApiRequest("/me/top/tracks?limit=50&time_range=long_term"),
      ]);

    // Analyze genres
    const allGenres: { [key: string]: number } = {};
    [shortTerm, mediumTerm, longTerm].forEach((data) => {
      data.items.forEach((artist: any) => {
        artist.genres.forEach((genre: string) => {
          allGenres[genre] = (allGenres[genre] || 0) + 1;
        });
      });
    });

    const sortedGenres = Object.entries(allGenres)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    const totalGenreInstances = Object.values(allGenres).reduce(
      (sum, count) => sum + count,
      0
    );

    const topGenres = sortedGenres.map(([genre, count]) => ({
      genre: genre,
      count: count,
      percentage: Math.round((count / totalGenreInstances) * 100),
    }));

    // Calculate diversity score
    const counts = Object.values(allGenres);
    const total = counts.reduce((sum, count) => sum + count, 0);
    const diversity = counts.reduce((entropy, count) => {
      if (count === 0) return entropy;
      const p = count / total;
      return entropy - p * Math.log2(p);
    }, 0);
    const genreDiversityScore = Math.min(100, Math.round(diversity * 20));

    // Analyze artist patterns
    const shortTermArtists = new Set(shortTerm.items.map((a: any) => a.id));
    const longTermArtists = new Set(longTerm.items.map((a: any) => a.id));

    const loyalArtists = [...shortTermArtists].filter((id) =>
      longTermArtists.has(id)
    );
    const artistLoyaltyScore = Math.round(
      (loyalArtists.length / shortTermArtists.size) * 100
    );
    const newArtistsDiscovered = [...shortTermArtists].filter(
      (id) => !longTermArtists.has(id)
    ).length;

    const explorationScore = 100 - artistLoyaltyScore;

    const topArtists = [
      ...shortTerm.items.slice(0, 5).map((artist: any) => ({
        name: artist.name,
        playCount: "Recent favorite",
        timeRange: "Last 4 weeks",
      })),
      ...longTerm.items.slice(0, 3).map((artist: any) => ({
        name: artist.name,
        playCount: "All-time favorite",
        timeRange: "Long-term",
      })),
    ];

    // Create insights
    const insights = {
      topGenres,
      genreDiversityScore,
      topArtists,
      artistLoyaltyScore,
      newArtistsDiscovered,
      explorationScore,
      comfortZonePercentage: artistLoyaltyScore,
      listeningTrends: [
        {
          period: "Last 4 weeks",
          trackCount: shortTermTracks.items.length,
          newArtistCount: newArtistsDiscovered,
        },
        {
          period: "Last 6 months",
          trackCount: mediumTermTracks.items.length,
          newArtistCount: mediumTermTracks.items.length,
        },
        {
          period: "All time",
          trackCount: longTermTracks.items.length,
          newArtistCount: longTermTracks.items.length,
        },
      ],
      mostActiveTimeRange: "Last 4 weeks",
      tasteEvolution: [
        {
          timeRange: "Recently",
          dominantGenre: getTopGenreFromArtists(shortTerm.items),
          change: "Current focus",
        },
        {
          timeRange: "6 months ago",
          dominantGenre: getTopGenreFromArtists(mediumTerm.items),
          change: "Previous interest",
        },
        {
          timeRange: "Long-term",
          dominantGenre: getTopGenreFromArtists(longTerm.items),
          change: "Historical preference",
        },
      ],
      analysisDate: new Date().toISOString(),
      totalTracksAnalyzed:
        shortTermTracks.items.length +
        mediumTermTracks.items.length +
        longTermTracks.items.length,
    };

    return insights;
  };

  const getTopGenreFromArtists = (artists: any[]): string => {
    const genreCounts: { [key: string]: number } = {};

    artists.forEach((artist) => {
      artist.genres.forEach((genre: string) => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });

    const topGenre = Object.entries(genreCounts).sort(
      ([, a], [, b]) => b - a
    )[0];

    return topGenre ? topGenre[0] : "Unknown";
  };

  useEffect(() => {
    const performMusicAnalysis = async () => {
      try {
        if (!spotifyService.isAuthenticated()) {
          navigate("/connect");
          return;
        }

        const cachedData = localStorage.getItem("music_insights_data");
        const cacheTimestamp = localStorage.getItem("music_insights_timestamp");

        if (cachedData && cacheTimestamp) {
          const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;
          if (parseInt(cacheTimestamp) > thirtyMinutesAgo) {
            console.log("📋 Using recent cached insights");
            await simulateStepsAndRedirect();
            return;
          }
        }

        console.log("🎵 Starting fresh music insights analysis...");

        await updateStep(0, 1000);
        const userProfile = await spotifyService.getCurrentUser();
        console.log(`✅ Profile loaded: ${userProfile.display_name}`);

        await updateStep(1, 1500);

        await updateStep(2, 1500);

        setSteps((prev) => {
          const updated = [...prev];
          updated[3].loading = true;
          return updated;
        });
        setCurrentStepIndex(3);
        setProgress(75);

        const insights = await generateMusicInsights();

        localStorage.setItem("music_insights_data", JSON.stringify(insights));
        localStorage.setItem("music_insights_timestamp", Date.now().toString());

        setSteps((prev) => {
          const updated = [...prev];
          updated[3].completed = true;
          updated[3].loading = false;
          return updated;
        });
        setProgress(100);

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } catch (err: any) {
        console.error("Music insights analysis failed:", err);
        setError(err.message);

        localStorage.removeItem("music_insights_data");
        localStorage.removeItem("music_insights_timestamp");
      }
    };

    const updateStep = (stepIndex: number, delay: number): Promise<void> => {
      return new Promise((resolve) => {
        if (stepIndex > 0) {
          setSteps((prev) => {
            const updated = [...prev];
            updated[stepIndex - 1].completed = true;
            updated[stepIndex - 1].loading = false;
            return updated;
          });
        }

        setSteps((prev) => {
          const updated = [...prev];
          updated[stepIndex].loading = true;
          return updated;
        });

        setCurrentStepIndex(stepIndex);
        setProgress((stepIndex + 1) * 25);

        setTimeout(resolve, delay);
      });
    };

    const simulateStepsAndRedirect = async () => {
      for (let i = 0; i < steps.length; i++) {
        await updateStep(i, 300);
      }

      setSteps((prev) => {
        const updated = [...prev];
        updated[steps.length - 1].completed = true;
        updated[steps.length - 1].loading = false;
        return updated;
      });
      setProgress(100);

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    };

    performMusicAnalysis();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen spotify-gradient text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-red-400 text-6xl mb-4">❌</div>
          <h2 className="text-xl font-bold mb-4 text-red-400">
            Analysis Failed
          </h2>
          <p className="text-gray-300 mb-6 text-sm leading-relaxed">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/demo")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Try Demo Instead
            </button>
            <button
              onClick={() => navigate("/connect")}
              className="w-full bg-spotify-green hover:bg-spotify-green/90 text-white px-6 py-2 rounded-lg"
            >
              Back to Connect
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("music_insights_data");
                localStorage.removeItem("music_insights_timestamp");
                window.location.reload();
              }}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen spotify-gradient text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Your Music Journey</h1>
          <div className="flex items-center text-gray-300">
            <span className="mr-2">👤</span>
            <span>Analyzing...</span>
          </div>
        </div>

        {/* Loading Content */}
        <div className="max-w-md mx-auto text-center">
          {/* Loading Icon */}
          <div className="mb-8">
            <Music className="w-16 h-16 mx-auto mb-4 text-spotify-green animate-pulse" />
            <h2 className="text-2xl font-bold mb-4">
              Discovering Your Musical DNA...
            </h2>
            <p className="text-green-400 text-sm">
              Analyzing your personal listening patterns and preferences
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <Progress value={progress} className="mb-4 h-3" />
            <div className="text-lg font-semibold">
              {Math.round(progress)}% Complete
            </div>
          </div>

          {/* Steps List */}
          <Card className="bg-black/30 border-gray-700 p-6 mb-8">
            <div className="space-y-4 text-left">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-start">
                  <div className="flex-shrink-0 mr-3 mt-0.5">
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5 text-spotify-green" />
                    ) : step.loading ? (
                      <Loader className="w-5 h-5 animate-spin text-yellow-400" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div
                      className={`font-medium ${
                        step.completed
                          ? "text-white"
                          : step.loading
                          ? "text-yellow-400"
                          : "text-gray-500"
                      }`}
                    >
                      {step.label}
                      {step.completed && " ✓"}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {step.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Time Estimate */}
          <div className="text-center text-gray-400">
            <div className="text-sm">This may take up to 30 seconds</div>
          </div>

          {/* Updated Fun Fact */}
          <Card className="mt-8 bg-blue-900/30 border-blue-500/20 p-4">
            <div className="flex items-center justify-center mb-2">
              <span className="mr-2">💡</span>
              <span className="font-semibold">Crunching your data...</span>
            </div>
            <div className="text-sm text-gray-300">
              We're analyzing your listening history across different time
              periods to understand your musical journey and preferences
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
