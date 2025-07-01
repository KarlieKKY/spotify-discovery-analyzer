// src/services/spotify.ts
import axios, { type AxiosInstance } from "axios";

export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: { url: string }[];
}

export interface SpotifyAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export class SpotifyService {
  private api: AxiosInstance;
  private accessToken: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: "https://api.spotify.com/v1",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }
      return config;
    });

    // Check for existing token on initialization
    this.loadTokenFromStorage();
  }

  // Generate Spotify authorization URL
  getAuthUrl(): string {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
    const scopes = [
      "playlist-read-private",
      "playlist-read-collaborative",
      "user-top-read",
      "user-read-recently-played",
      "user-read-private",
      "user-read-email",
    ].join(" ");

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      redirect_uri: redirectUri,
      scope: scopes,
      state: this.generateRandomString(16),
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code: string): Promise<SpotifyAuthResponse> {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
    const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        },
      }
    );

    const authData: SpotifyAuthResponse = response.data;
    this.setAccessToken(authData.access_token);
    return authData;
  }

  // Set access token
  setAccessToken(token: string): void {
    this.accessToken = token;
    localStorage.setItem("spotify_access_token", token);
  }

  // Get current access token
  getAccessToken(): string | null {
    return this.accessToken;
  }

  // Load token from localStorage
  private loadTokenFromStorage(): void {
    const token = localStorage.getItem("spotify_access_token");
    if (token) {
      this.accessToken = token;
    }
  }

  // Clear token and logout
  logout(): void {
    this.accessToken = null;
    localStorage.removeItem("spotify_access_token");
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // Get current user profile
  async getCurrentUser(): Promise<SpotifyUser> {
    const response = await this.api.get("/me");
    return response.data;
  }

  // Get user's playlists
  async getUserPlaylists() {
    const response = await this.api.get("/me/playlists?limit=50");
    return response.data;
  }

  // Find Discover Weekly playlist
  async findDiscoverWeekly() {
    const playlists = await this.getUserPlaylists();
    return playlists.items.find(
      (playlist: any) =>
        playlist.name === "Discover Weekly" &&
        playlist.description.includes("Your weekly mixtape of fresh music")
    );
  }

  // Generate random string for state parameter
  private generateRandomString(length: number): string {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let text = "";
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  // Extract authorization code from URL - STATIC METHOD
  static extractCodeFromUrl(url: string): string | null {
    const urlParams = new URLSearchParams(url.split("?")[1]);
    return urlParams.get("code");
  }
}

// Export both the class and a singleton instance
export const spotifyService = new SpotifyService();
