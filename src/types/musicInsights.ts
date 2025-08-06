export interface MusicInsights {
  topGenres: Array<{ genre: string; percentage: number; count: number }>;
  genreDiversityScore: number;

  topArtists: Array<{ name: string; playCount: string; timeRange: string }>;
  artistLoyaltyScore: number;
  newArtistsDiscovered: number;

  listeningTrends: Array<{
    period: string;
    trackCount: number;
    newArtistCount: number;
  }>;
  mostActiveTimeRange: string;

  discoveryTimeline: Array<{
    period: string;
    discoveryRate: number;
    newArtists: number;
  }>;

  listeningHabits: {
    mostActiveTimeRange: string;
    diversityTrend: "increasing" | "decreasing" | "stable";
    explorationPattern: string;
  };

  genreEvolution: Array<{
    timeRange: string;
    topGenres: Array<{ genre: string; percentage: number }>;
    change: string;
  }>;

  explorationScore: number;
  comfortZonePercentage: number;

  tasteEvolution: Array<{
    timeRange: string;
    dominantGenre: string;
    change: string;
  }>;

  analysisDate: string;
  totalTracksAnalyzed: number;
}

export type InsightTab = "genres" | "artists" | "trends" | "journey";
