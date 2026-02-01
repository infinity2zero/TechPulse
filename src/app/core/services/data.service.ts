import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, timer, BehaviorSubject, merge } from 'rxjs';
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

export interface DataResponse<T> {
  lastUpdated: string;
  items: T[];
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private http = inject(HttpClient);
  
  // Refresh every 5 minutes (300000 ms)
  private readonly REFRESH_INTERVAL = 300000;
  private refreshSubject = new BehaviorSubject<void>(undefined);

  refresh() {
    this.refreshSubject.next();
  }

  getGitHubTrends(): Observable<DataResponse<GitHubRepo>> {
    return merge(timer(0, this.REFRESH_INTERVAL), this.refreshSubject).pipe(
      switchMap(() => {
        const timestamp = new Date().getTime(); // Cache busting for manual refresh
        return this.http.get<DataResponse<GitHubRepo>>(`assets/data/github-trends.json?t=${timestamp}`);
      }),
      catchError(err => {
        console.error('Failed to load GitHub trends', err);
        return of({ lastUpdated: new Date().toISOString(), items: [] });
      }),
      shareReplay(1)
    );
  }

  getHackerNewsTrends(): Observable<DataResponse<HNStory>> {
    return merge(timer(0, this.REFRESH_INTERVAL), this.refreshSubject).pipe(
      switchMap(() => {
        const timestamp = new Date().getTime(); // Cache busting
        return this.http.get<DataResponse<HNStory>>(`assets/data/hn-trends.json?t=${timestamp}`);
      }),
      catchError(err => {
        console.error('Failed to load HN trends', err);
        return of({ lastUpdated: new Date().toISOString(), items: [] });
      }),
      shareReplay(1)
    );
  }
}
