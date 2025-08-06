import type { MusicInsights } from "@/types/musicInsights";

export class MusicAnalysisService {
  static async generateMusicInsights(
    makeApiRequest: (endpoint: string) => Promise<any>
  ): Promise<MusicInsights> {
    console.log("Generating comprehensive music insights...");

    try {
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

      const artistsData = [shortTerm, mediumTerm, longTerm];
      const tracksData = [shortTermTracks, mediumTermTracks, longTermTracks];

      const genreAnalysis = this.analyzeGenres(artistsData);
      const artistAnalysis = this.analyzeArtistPatterns(
        shortTerm,
        mediumTerm,
        longTerm
      );
      const trendAnalysis = this.analyzeTrends(
        shortTermTracks,
        mediumTermTracks,
        longTermTracks
      );
      const explorationAnalysis = this.analyzeExploration(shortTerm, longTerm);
      const tasteEvolution = this.analyzeTasteEvolution(
        shortTerm,
        mediumTerm,
        longTerm
      );
      const discoveryTimeline = this.analyzeDiscoveryTimeline(
        shortTerm,
        mediumTerm,
        longTerm
      );
      const listeningHabits = this.analyzeListeningHabits(
        shortTerm,
        mediumTerm,
        longTerm,
        genreAnalysis
      );
      const genreEvolution = this.analyzeGenreEvolution(
        shortTerm,
        mediumTerm,
        longTerm
      );

      return {
        topGenres: genreAnalysis.topGenres,
        genreDiversityScore: genreAnalysis.diversityScore,
        topArtists: artistAnalysis.topArtists,
        artistLoyaltyScore: artistAnalysis.loyaltyScore,
        newArtistsDiscovered: artistAnalysis.newArtistsDiscovered,
        listeningTrends: trendAnalysis.trends,
        mostActiveTimeRange: trendAnalysis.mostActive,
        discoveryTimeline,
        listeningHabits,
        genreEvolution,
        explorationScore: explorationAnalysis.explorationScore,
        comfortZonePercentage: explorationAnalysis.comfortZonePercentage,
        tasteEvolution,
        analysisDate: new Date().toISOString(),
        totalTracksAnalyzed:
          shortTermTracks.items.length +
          mediumTermTracks.items.length +
          longTermTracks.items.length,
      };
    } catch (error) {
      console.error("Error generating music insights:", error);
      throw new Error("Failed to analyze your music data. Please try again.");
    }
  }

  private static analyzeGenres(artistsData: any[]): {
    topGenres: any[];
    diversityScore: number;
  } {
    const allGenres: { [key: string]: number } = {};

    artistsData.forEach((data) => {
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

    const diversityScore = this.calculateGenreDiversity(allGenres);
    return { topGenres, diversityScore };
  }

  private static calculateGenreDiversity(genres: {
    [key: string]: number;
  }): number {
    const counts = Object.values(genres);
    const total = counts.reduce((sum, count) => sum + count, 0);

    if (total === 0) return 0;

    const diversity = counts.reduce((entropy, count) => {
      if (count === 0) return entropy;
      const p = count / total;
      return entropy - p * Math.log2(p);
    }, 0);

    return Math.min(100, Math.round(diversity * 20));
  }

  private static analyzeArtistPatterns(
    shortTerm: any,
    mediumTerm: any,
    longTerm: any
  ) {
    const shortTermArtists = new Set(shortTerm.items.map((a: any) => a.id));
    const longTermArtists = new Set(longTerm.items.map((a: any) => a.id));

    const loyalArtists = [...shortTermArtists].filter((id) =>
      longTermArtists.has(id)
    );
    const loyaltyScore = Math.round(
      (loyalArtists.length / shortTermArtists.size) * 100
    );

    const newArtistsDiscovered = [...shortTermArtists].filter(
      (id) => !longTermArtists.has(id)
    ).length;

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

    return { topArtists, loyaltyScore, newArtistsDiscovered };
  }

  private static analyzeTrends(shortTerm: any, mediumTerm: any, longTerm: any) {
    const trends = [
      {
        period: "Last 4 weeks",
        trackCount: shortTerm.items.length,
        newArtistCount: shortTerm.items.length,
      },
      {
        period: "Last 6 months",
        trackCount: mediumTerm.items.length,
        newArtistCount: mediumTerm.items.length,
      },
      {
        period: "All time",
        trackCount: longTerm.items.length,
        newArtistCount: longTerm.items.length,
      },
    ];

    return { trends, mostActive: "Last 4 weeks" };
  }

  private static analyzeExploration(shortTerm: any, longTerm: any) {
    const shortTermArtists = new Set(shortTerm.items.map((a: any) => a.id));
    const longTermArtists = new Set(longTerm.items.map((a: any) => a.id));

    const overlapping = [...shortTermArtists].filter((id) =>
      longTermArtists.has(id)
    );
    const comfortZonePercentage = Math.round(
      (overlapping.length / shortTermArtists.size) * 100
    );
    const explorationScore = 100 - comfortZonePercentage;

    return { explorationScore, comfortZonePercentage };
  }

  private static analyzeDiscoveryTimeline(
    shortTerm: any,
    mediumTerm: any,
    longTerm: any
  ) {
    const shortTermArtists = new Set(shortTerm.items.map((a: any) => a.id));
    const mediumTermArtists = new Set(mediumTerm.items.map((a: any) => a.id));
    const longTermArtists = new Set(longTerm.items.map((a: any) => a.id));

    const recentNewArtists = [...shortTermArtists].filter(
      (id) => !mediumTermArtists.has(id)
    ).length;
    const mediumNewArtists = [...mediumTermArtists].filter(
      (id) => !longTermArtists.has(id)
    ).length;

    const recentDiscoveryRate = Math.round(
      (recentNewArtists / shortTermArtists.size) * 100
    );
    const mediumDiscoveryRate = Math.round(
      (mediumNewArtists / mediumTermArtists.size) * 100
    );
    const overallDiscoveryRate = Math.round(
      (recentNewArtists / longTermArtists.size) * 100
    );

    return [
      {
        period: "Last 4 weeks",
        discoveryRate: recentDiscoveryRate,
        newArtists: recentNewArtists,
      },
      {
        period: "Last 6 months",
        discoveryRate: mediumDiscoveryRate,
        newArtists: mediumNewArtists,
      },
      {
        period: "Overall",
        discoveryRate: overallDiscoveryRate,
        newArtists: Math.round(
          (shortTermArtists.size + mediumTermArtists.size) / 2
        ),
      },
    ];
  }

  private static analyzeListeningHabits(
    shortTerm: any,
    mediumTerm: any,
    longTerm: any,
    genreAnalysis: any
  ) {
    const shortTermCount = shortTerm.items.length;
    const mediumTermCount = mediumTerm.items.length;

    let mostActiveTimeRange = "Recent weeks";
    if (mediumTermCount > shortTermCount * 1.5) {
      mostActiveTimeRange = "Past 6 months";
    }

    const currentDiversity = genreAnalysis.diversityScore;
    let diversityTrend: "increasing" | "decreasing" | "stable" = "stable";

    if (currentDiversity > 60) {
      diversityTrend = "increasing";
    } else if (currentDiversity < 40) {
      diversityTrend = "decreasing";
    }

    const shortTermArtists = new Set(shortTerm.items.map((a: any) => a.id));
    const longTermArtists = new Set(longTerm.items.map((a: any) => a.id));
    const overlap = [...shortTermArtists].filter((id) =>
      longTermArtists.has(id)
    ).length;
    const overlapPercentage = (overlap / shortTermArtists.size) * 100;

    let explorationPattern = "Balanced explorer";
    if (overlapPercentage > 70) {
      explorationPattern = "Comfort zone listener";
    } else if (overlapPercentage < 30) {
      explorationPattern = "Adventurous explorer";
    }

    return { mostActiveTimeRange, diversityTrend, explorationPattern };
  }

  private static analyzeGenreEvolution(
    shortTerm: any,
    mediumTerm: any,
    longTerm: any
  ) {
    const periods = [
      { data: shortTerm, name: "Recent" },
      { data: mediumTerm, name: "6 months ago" },
      { data: longTerm, name: "Long-term" },
    ];

    return periods.map((period, index) => {
      const genreCounts: { [key: string]: number } = {};

      period.data.items.forEach((artist: any) => {
        artist.genres.forEach((genre: string) => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      });

      const total = Object.values(genreCounts).reduce(
        (sum, count) => sum + count,
        0
      );
      const topGenres = Object.entries(genreCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([genre, count]) => ({
          genre,
          percentage: Math.round((count / total) * 100),
        }));

      let change = "Current preferences";
      if (index === 1) change = "Previous focus";
      if (index === 2) change = "Historical foundation";

      return { timeRange: period.name, topGenres, change };
    });
  }

  private static analyzeTasteEvolution(
    shortTerm: any,
    mediumTerm: any,
    longTerm: any
  ) {
    return [
      {
        timeRange: "Recently",
        dominantGenre: this.getTopGenreFromArtists(shortTerm.items),
        change: "Current focus",
      },
      {
        timeRange: "6 months ago",
        dominantGenre: this.getTopGenreFromArtists(mediumTerm.items),
        change: "Previous interest",
      },
      {
        timeRange: "Long-term",
        dominantGenre: this.getTopGenreFromArtists(longTerm.items),
        change: "Historical preference",
      },
    ];
  }

  private static getTopGenreFromArtists(artists: any[]): string {
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
  }
}
