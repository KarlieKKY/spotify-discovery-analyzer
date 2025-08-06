# Spotify Personal Analytics Dashboard

This React app analyzes your Spotify data to reveal your musical fingerprint using statistical analysis and data visualization.

## 🚀 Quick Start

1. **Clone this repo and install dependencies:**
   ```
   git clone https://github.com/KarlieKKY/spotify-discovery-analyzer.git
   cd spotify-discovery-analyzer
   npm install
   ```
2. **Configure your Spotify App:**

- Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
- Click **"Create an App"** (or select an existing one).

3. **Run the app:**
   ```
   npm run dev -- --host 0.0.0.0
   ```

## ✨ Key Features

- **Genre Diversity Score:** Quantifies how varied your music taste is using Shannon entropy.
- **Artist Loyalty vs. Discovery:** See if you mostly stick to favorite artists or explore new ones.
- **Discovery Timeline:** Visualize how your music exploration and habits have evolved over time.
- **Musical Evolution:** Compare your recent and long-term listening patterns to discover your taste journey.
- **Lightning-Fast:** Analyzes 150+ tracks in under 3 seconds with smart parallel processing and caching.
- **Interactive Visualizations:** Modern bar, pie, and trend charts built with Recharts.
- **Secure & Private:** OAuth login with no data stored or shared—everything stays on your machine.
- **Fully Responsive:** Works seamlessly on mobile, tablet, and desktop.

---

## 💪 Challenges Overcome

- **Spotify API Limitations:**  
  Original idea relied on Discover Weekly, but Spotify blocks API access to this playlist. I pivoted to analyzing your entire listening history across multiple timeframes for more personal and valuable insights.
- **OAuth Complexity:**  
  Handling Spotify’s authentication flow (tokens, redirects, scope errors) was non-trivial. Built a robust custom auth service and clear error recovery.
- **Data Analysis at Scale:**  
  Transformed large, raw API data into meaningful stats using statistical methods (like Shannon entropy) and optimized performance for <3s insights.
- **Smooth UX:**  
  Built error states and a demo mode for reliability—app remains useful even if API fails or the user isn’t logged in.

---

## 🛣️ Future Roadmap

- [ ] **Automated Tests:** Unit tests for analysis/statistical functions.
- [ ] **Accessibility:** WCAG 2.1 AA compliance and improved keyboard navigation.
- [ ] **Performance Monitoring:** Bundle analysis and optimizations.
- [ ] **Historical Tracking:** Monthly “snapshots” of taste evolution.
- [ ] **Social Comparison:** See how your Music DNA stacks up against friends.
- [ ] **AI Recommendations:** Personalized music suggestions based on unique patterns.
- [ ] **Data Export:** Download insights as PDF or CSV.
