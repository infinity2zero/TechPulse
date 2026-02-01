import * as fs from 'fs';
import * as path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src/assets/data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const HN_BASE_URL = 'https://hacker-news.firebaseio.com/v0';

export async function fetchHackerNews() {
  console.log('Fetching Hacker News top stories...');
  
  try {
    // 1. Get Top 50 Story IDs
    const topStoriesRes = await fetch(`${HN_BASE_URL}/topstories.json`);
    const storyIds = (await topStoriesRes.json()).slice(0, 30); // Get top 30

    // 2. Fetch details for each story in parallel
    const storyPromises = storyIds.map(async (id: number) => {
      try {
        const storyRes = await fetch(`${HN_BASE_URL}/item/${id}.json`);
        return await storyRes.json();
      } catch (e) {
        console.error(`Failed to fetch HN item ${id}`);
        return null;
      }
    });

    const stories = (await Promise.all(storyPromises))
      .filter((s: any) => s && s.type === 'story' && s.url) // Filter valid stories with URLs
      .map((s: any) => ({
        id: s.id,
        title: s.title,
        url: s.url,
        score: s.score,
        by: s.by,
        time: s.time,
        comments: s.descendants || 0,
        domain: new URL(s.url).hostname.replace('www.', '')
      }));

    const output = {
      lastUpdated: new Date().toISOString(),
      items: stories
    };

    fs.writeFileSync(
      path.join(DATA_DIR, 'hn-trends.json'), 
      JSON.stringify(output, null, 2)
    );
    
    console.log(`✅ Saved ${stories.length} Hacker News stories.`);
  } catch (error) {
    console.error('❌ Error fetching Hacker News:', error);
  }
}

// Allow direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  fetchHackerNews();
}
