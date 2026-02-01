import { fetchGitHubTrends } from './fetch-github';
import { fetchHackerNews } from './fetch-hn';

async function runAll() {
  console.log('🚀 Starting Data Ingestion...');
  
  await Promise.allSettled([
    fetchGitHubTrends(),
    fetchHackerNews(),
    // Future: fetchTechNews()
  ]);

  console.log('✨ Data Ingestion Complete.');
}

runAll();
