import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

const DATA_DIR = path.join(process.cwd(), 'src/assets/data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export async function fetchGitHubTrends() {
  console.log('Fetching GitHub trends...');
  
  // Calculate date 7 days ago
  const date = new Date();
  date.setDate(date.getDate() - 7);
  const dateString = date.toISOString().split('T')[0];
  
  const token = process.env['GITHUB_TOKEN'];
  const headers: HeadersInit = {
    'User-Agent': 'TechPulse-App',
    'Accept': 'application/vnd.github.v3+json'
  };

  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  try {
    const url = `https://api.github.com/search/repositories?q=created:>${dateString}&sort=stars&order=desc&per_page=20`;
    
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status}: ${response.statusText}`);
    }

    const data: any = await response.json();

    const repos = data.items.map((item: any) => ({
      id: item.id,
      name: item.full_name,
      description: item.description,
      stars: item.stargazers_count,
      language: item.language,
      url: item.html_url,
      owner: {
        login: item.owner.login,
        avatar_url: item.owner.avatar_url
      },
      updated_at: item.updated_at
    }));

    const output = {
      lastUpdated: new Date().toISOString(),
      items: repos
    };

    fs.writeFileSync(
      path.join(DATA_DIR, 'github-trends.json'), 
      JSON.stringify(output, null, 2)
    );
    
    console.log(`✅ Saved ${repos.length} GitHub trends.`);
  } catch (error) {
    console.error('❌ Error fetching GitHub trends:', error);
  }
}

// Allow direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  fetchGitHubTrends();
}
