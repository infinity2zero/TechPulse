import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';

export interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  stars: number;
  language: string;
  url: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  updated_at?: string;
}

export interface HNStory {
  id: number;
  title: string;
  url: string;
  score: number;
  by: string;
  time: number;
  comments: number;
  domain?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private http = inject(HttpClient);
  
  // Refresh every 5 minutes (300000 ms)
  private readonly REFRESH_INTERVAL = 300000;

  getGitHubTrends(): Observable<GitHubRepo[]> {
    return timer(0, this.REFRESH_INTERVAL).pipe(
      switchMap(() => this.http.get<{ items: GitHubRepo[] }>('assets/data/github-trends.json')),
      map(data => data.items),
      catchError(err => {
        console.error('Failed to load GitHub trends', err);
        return of([]);
      }),
      shareReplay(1)
    );
  }

  getHackerNewsTrends(): Observable<HNStory[]> {
    return timer(0, this.REFRESH_INTERVAL).pipe(
      switchMap(() => this.http.get<{ items: HNStory[] }>('assets/data/hn-trends.json')),
      map(data => data.items),
      catchError(err => {
        console.error('Failed to load HN trends', err);
        return of([]);
      }),
      shareReplay(1)
    );
  }
}
