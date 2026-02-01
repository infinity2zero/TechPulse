import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { GitHubRepo } from '../../core/services/data.service';

@Component({
  selector: 'app-repo-card',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzIconModule, NzTagModule, NzTypographyModule],
  template: `
    <nz-card [nzBordered]="true" [nzHoverable]="true" class="repo-card" [nzActions]="[actionStar, actionLang, actionTime]">
      <nz-card-meta
        [nzTitle]="titleTpl"
        [nzDescription]="repo.description || 'No description provided.'">
      </nz-card-meta>
    </nz-card>

    <ng-template #titleTpl>
      <div class="card-header">
        <a [href]="repo.url" target="_blank" rel="noopener noreferrer">
          {{ repo.owner.login }} / <strong>{{ repo.name.split('/')[1] || repo.name }}</strong>
        </a>
      </div>
    </ng-template>

    <ng-template #actionStar>
      <span nz-icon nzType="star" nzTheme="fill" style="color: #faad14; margin-right: 8px;"></span>
      {{ repo.stars | number }}
    </ng-template>

    <ng-template #actionLang>
      <nz-tag [nzColor]="'blue'">{{ repo.language || 'Unknown' }}</nz-tag>
    </ng-template>

    <ng-template #actionTime>
      <span nz-icon nzType="clock-circle" style="margin-right: 8px;"></span>
      {{ repo.updated_at | date:'mediumDate' }}
    </ng-template>
  `,
  styles: [`
    .repo-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    ::ng-deep .ant-card-body {
      flex: 1;
    }
    .card-header a {
      color: inherit;
      font-size: 16px;
    }
    .card-header a:hover {
      text-decoration: underline;
    }
  `]
})
export class RepoCardComponent {
  @Input({ required: true }) repo!: GitHubRepo;
}
