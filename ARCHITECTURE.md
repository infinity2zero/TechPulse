# TechPulse Architecture & Solution Document

## 1. Executive Summary

**TechPulse** is designed as a self-contained, automated technology news and trends aggregator. The system aims to provide a single "pane of glass" for developers to stay updated with the latest GitHub trends, NPM packages, Hacker News discussions, and verified tech news via RSS.

**Core Philosophy:** "Zero-Maintenance Infrastructure". By leveraging GitHub Actions for compute and GitHub Pages for hosting, the project incurs $0 cost and requires no active server management.

## 2. High-Level Architecture

The system follows a **Serverless Static Site** architecture. Instead of a traditional backend API database, we use the Git repository itself as the database, updated periodically by automated workers.

```mermaid
graph TD
    subgraph "Data Ingestion (GitHub Actions)"
        A[Cron Schedule\n(Every 10 mins)] --> B[Ingestion Script\n(Node.js)]
        B --> C{Fetch Data}
        C -->|API| D[GitHub API]
        C -->|API| E[NPM Registry]
        C -->|API| F[Hacker News API]
        C -->|RSS| G[Tech RSS Feeds]
        B --> H[Process & Normalize]
        H --> I[Commit JSON to /data]
    end

    subgraph "Storage & Hosting"
        I --> J[GitHub Repository]
        J --> K[GitHub Pages CDN]
    end

    subgraph "Client Side"
        L[Angular SPA] -->|HTTP GET| M[data/trends.json]
        L -->|HTTP GET| N[data/news.json]
        K --> L
    end
```

## 3. Technology Stack Selection

Based on the requirements and the goal of a robust, enterprise-grade UI:

| Component | Choice | Rationale |
|-----------|--------|-----------|
| **Frontend Framework** | **Angular (v19+)** | Strong typing, modular architecture, and excellent performance for dashboard-like apps. |
| **UI Library** | **NG-ZORRO (Ant Design)** | Comprehensive enterprise component suite (Tables, Cards, Lists) ideal for data-dense dashboards. |
| **Data Processing** | **Node.js + TypeScript** | Runs natively in GitHub Actions; shares types with the Frontend. |
| **Storage** | **JSON / Git** | Simple, versioned, and cached automatically by GitHub Pages. |
| **Hosting** | **GitHub Pages** | Free, fast, and integrated with the repository. |
| **Automation** | **GitHub Actions** | Built-in cron capabilities for scheduled data fetching. |

## 4. Data Ingestion Strategy

We will create a `scripts/` directory containing independent fetchers for each source. A master runner will execute them in parallel.

### Sources & APIs
1.  **GitHub Trends**: Use GitHub Search API (or specialized trending scrapers if API limits allow).
    *   *Query*: `created:>2024-01-01 sort:stars` (dynamic date).
2.  **Hacker News**: Use the official Firebase API (`https://hacker-news.firebaseio.com/v0/`).
    *   *Endpoints*: `/topstories.json`, `/beststories.json`.
3.  **NPM Trends**: Use `npmjs.com` API for "most depended upon" or "recently updated".
4.  **Tech News**: RSS Parser (e.g., `rss-parser` package) for feeds like BBC Technology, TechCrunch, Wired.

### Handling Rate Limits
*   **Token Rotation**: Use `GITHUB_TOKEN` for authenticated requests.
*   **Caching**: If a fetch fails, the script should retain the previous valid JSON to prevent the UI from breaking.

## 5. Data Models (JSON Schema)

Files will be stored in `src/assets/data/` or a dedicated `data/` branch.

**`data/trends.json`**
```json
{
  "lastUpdated": "2024-02-01T10:00:00Z",
  "github": [
    {
      "id": 12345,
      "name": "facebook/react",
      "description": "A declarative...",
      "stars": 200000,
      "language": "JavaScript",
      "url": "..."
    }
  ],
  "npm": [ ... ]
}
```

**`data/news.json`**
```json
{
  "lastUpdated": "2024-02-01T10:00:00Z",
  "hackerNews": [
    {
      "title": "Show HN: My App",
      "url": "...",
      "score": 150,
      "comments": 45
    }
  ],
  "rss": [
    {
      "source": "TechCrunch",
      "title": "AI is taking over...",
      "link": "...",
      "pubDate": "..."
    }
  ]
}
```

## 6. Frontend Application Design

### Layout (NG-ZORRO Based)
*   **Header**: App Logo, Theme Toggle (Dark/Light), Last Updated timestamp.
*   **Sidebar/Tabs**: Navigation between "Dashboard", "Trending", "News", "Settings".
*   **Dashboard View**: A grid layout (Masonry or CSS Grid) utilizing `nz-card`.
    *   *Widget 1*: Top 5 GitHub Repos.
    *   *Widget 2*: Top 5 HN Stories.
    *   *Widget 3*: Latest Headlines.

### Services
*   **`DataService`**: Responsible for fetching the static JSON files. It will use Angular's `HttpClient` with caching headers.
*   **`AutoRefreshService`**: Polling mechanism to check `lastUpdated` timestamp every 5 minutes and prompt user or auto-reload data.

## 7. Implementation Roadmap

### Phase 1: Skeleton & Setup (Immediate)
1.  Initialize Angular workspace.
2.  Install `ng-zorro-antd`.
3.  Set up the folder structure.

### Phase 2: The Scraper (Backend Logic)
1.  Create `scripts/fetch-data.ts`.
2.  Implement GitHub and HN fetchers.
3.  Generate dummy `data.json` for frontend dev.

### Phase 3: UI Implementation
1.  Build the Dashboard Layout using Ant Design Grid.
2.  Create display components (`repo-card`, `news-item`).
3.  Connect `HttpClient` to local JSON.

### Phase 4: Automation
1.  Create `.github/workflows/update-data.yml`.
2.  Configure cron schedule.
3.  Deploy to GitHub Pages.

## 8. Scalability & Future Considerations

*   **Database Migration**: If history is required (e.g., "Trends from last month"), we can easily switch the "Save to JSON" step to "Insert into Supabase/Firebase".
*   **Mobile App**: Since the data is just JSON over HTTP, building a Flutter or React Native app that consumes the same endpoints is trivial.
*   **User Accounts**: Can be added later using Firebase Auth to allow users to "Save" bookmarks (would require a real backend/DB for user data).

## 9. Decision Matrix

| Feature | Recommended Approach | Alternative |
|---------|----------------------|-------------|
| **Hosting** | GitHub Pages (Free, Easy) | Vercel / Netlify |
| **Database** | JSON Files (No cost, Fast read) | Firebase / MongoDB Atlas |
| **Styling** | NG-ZORRO (Enterprise look) | Tailwind CSS (Custom look) |

**Recommendation**: Proceed with the **Angular + NG-ZORRO + GitHub Actions** approach. It perfectly matches the "Minimal backend" and "Self-contained" requirements while providing a polished user experience.
