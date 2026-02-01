import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { DataService } from '../../core/services/data.service';
import { RepoCardComponent } from '../../components/repo-card/repo-card';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-trends',
  standalone: true,
  imports: [
    CommonModule, 
    NzGridModule, 
    NzTypographyModule, 
    NzSkeletonModule, 
    NzAlertModule,
    RepoCardComponent
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2 nz-typography>GitHub Trends</h2>
        @if (data(); as d) {
          <span class="last-updated">
            Updated: {{ d.lastUpdated | date:'medium' }} ({{ getTimeAgo(d.lastUpdated) }})
          </span>
        }
      </div>

      <div nz-row [nzGutter]="[16, 16]">
        @if (data(); as d) {
          @for (repo of d.items; track repo.id) {
            <div nz-col [nzXs]="24" [nzSm]="12" [nzMd]="8" [nzLg]="8" [nzXl]="6">
              <app-repo-card [repo]="repo"></app-repo-card>
            </div>
          }
        } @else {
          <div nz-col [nzSpan]="24"><nz-skeleton [nzActive]="true"></nz-skeleton></div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 24px 0;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .last-updated {
      color: var(--text-secondary);
      font-size: 14px;
    }
    h2 {
      color: var(--text-color);
      margin-bottom: 0;
    }
  `]
})
export class TrendsComponent {
  private dataService = inject(DataService);
  data = toSignal(this.dataService.getGitHubTrends());

  getTimeAgo(dateString: string): string {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins === 1) return '1 min ago';
    return `${diffMins} mins ago`;
  }
}
