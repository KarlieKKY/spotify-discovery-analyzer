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

    this.api.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }
      return config;
    });

    this.loadTokenFromStorage();
  }

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
      "user-library-read",
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

  setAccessToken(token: string): void {
    this.accessToken = token;
    localStorage.setItem("spotify_access_token", token);
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  private loadTokenFromStorage(): void {
    const token = localStorage.getItem("spotify_access_token");
    if (token) {
      this.accessToken = token;
    }
  }

  logout(): void {
    this.accessToken = null;
    localStorage.removeItem("spotify_access_token");
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  async getCurrentUser(): Promise<SpotifyUser> {
    const response = await this.api.get("/me");
    return response.data;
  }

  async getUserPlaylists() {
    const response = await this.api.get("/me/playlists?limit=50");
    return response.data;
  }

  async findDiscoverWeekly() {
    const playlists = await this.getUserPlaylists();
    return playlists.items.find(
      (playlist: any) =>
        playlist.name === "Discover Weekly" &&
        playlist.description.includes("Your weekly mixtape of fresh music")
    );
  }

  private generateRandomString(length: number): string {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let text = "";
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  static extractCodeFromUrl(url: string): string | null {
    const urlParams = new URLSearchParams(url.split("?")[1]);
    return urlParams.get("code");
  }
}

export const spotifyService = new SpotifyService();
