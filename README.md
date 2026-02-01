# TechPulse 🚀

A real-time tech trend aggregator built with Angular and powered by GitHub Actions.

🔗 **Live Demo:** [https://infinity2zero.github.io/TechPulse/](https://infinity2zero.github.io/TechPulse/)

## ✨ Features

*   **📈 GitHub Trends**: View top trending repositories from the last 7 days.
*   **📰 Hacker News**: Stay updated with top stories from Hacker News.
*   **⚡ Real-Time Updates**: Data is automatically refreshed every 5 minutes via GitHub Actions.
*   **🌗 Dark Mode**: Fully supported light and dark themes with auto-detection.
*   **📱 Responsive Design**: Built with NG-ZORRO (Ant Design) for a seamless experience on desktop and mobile.
*   **🚀 Zero Backend**: Serverless architecture using GitHub Actions for data fetching and GitHub Pages for hosting.

## 🛠️ Architecture

1.  **Data Ingestion**: A GitHub Action runs every 5 minutes to fetch data from GitHub API and Hacker News.
2.  **Storage**: Data is saved as static JSON files in the `gh-pages` branch.
3.  **Frontend**: The Angular app polls these JSON files to update the UI without page reloads.

## 🚀 Getting Started

### Prerequisites

*   Node.js (v20+)
*   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/infinity2zero/TechPulse.git
    cd TechPulse
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm start
    ```
    Navigate to `http://localhost:4200/`.

## 🤖 GitHub Actions

*   **Update Data**: Runs every 5 minutes (`*/5 * * * *`) to fetch new trends.
*   **Deploy**: Automatically builds and deploys the Angular app to GitHub Pages on push to `main`.

## 📄 License

MIT
