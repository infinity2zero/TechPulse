import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { DataService } from '../../core/services/data.service';
import { RepoCardComponent } from '../../components/repo-card/repo-card';
import { NewsListComponent } from '../../components/news-list/news-list';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    NzGridModule, 
    NzTypographyModule, 
    NzSkeletonModule, 
    NzDividerModule,
    RepoCardComponent, 
    NewsListComponent
  ],
  template: `
    <div class="dashboard-container">
      <h2 nz-typography>Trending Today</h2>
      
      <!-- GitHub Section -->
      <h4 nz-typography>GitHub Repositories</h4>
      <div nz-row [nzGutter]="[16, 16]">
        @if (repos(); as repoList) {
          @for (repo of repoList.slice(0, 6); track repo.id) {
            <div nz-col [nzXs]="24" [nzSm]="12" [nzMd]="8" [nzLg]="8" [nzXl]="6">
              <app-repo-card [repo]="repo"></app-repo-card>
            </div>
          }
        } @else {
          <div nz-col [nzSpan]="24"><nz-skeleton [nzActive]="true"></nz-skeleton></div>
        }
      </div>

      <nz-divider></nz-divider>

      <!-- Hacker News Section -->
      <div nz-row [nzGutter]="24">
        <div nz-col [nzSpan]="24">
          <h4 nz-typography>Hacker News Top Stories</h4>
          @if (news(); as newsList) {
            <app-news-list [stories]="newsList"></app-news-list>
          } @else {
            <nz-skeleton [nzActive]="true"></nz-skeleton>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
    }
    h4 {
      margin-top: 16px;
      margin-bottom: 16px;
      color: var(--text-color);
    }
    h2 {
      color: var(--text-color);
    }
  `]
})
export class DashboardComponent {
  private dataService = inject(DataService);
  
  repos = toSignal(this.dataService.getGitHubTrends());
  news = toSignal(this.dataService.getHackerNewsTrends());
}
