import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { HNStory } from '../../core/services/data.service';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [CommonModule, NzListModule, NzIconModule, NzTagModule, NzTypographyModule, NzDividerModule],
  template: `
    <nz-list [nzDataSource]="stories" [nzRenderItem]="item" [nzItemLayout]="'horizontal'">
      <ng-template #item let-item>
        <nz-list-item>
          <nz-list-item-meta
            [nzTitle]="nzTitle"
            [nzDescription]="descriptionTpl">
            <ng-template #nzTitle>
              <a [href]="item.url" target="_blank" rel="noopener noreferrer">{{ item.title }}</a>
              <span class="domain" *ngIf="item.domain">({{ item.domain }})</span>
            </ng-template>
            <ng-template #descriptionTpl>
              <span nz-icon nzType="star" nzTheme="fill" style="color: #faad14;"></span> {{ item.score }} points
              <nz-divider nzType="vertical"></nz-divider>
              <span nz-icon nzType="user"></span> {{ item.by }}
              <nz-divider nzType="vertical"></nz-divider>
              <span nz-icon nzType="message"></span> {{ item.comments }} comments
              <nz-divider nzType="vertical"></nz-divider>
              <span nz-icon nzType="clock-circle"></span> {{ item.time * 1000 | date:'short' }}
            </ng-template>
          </nz-list-item-meta>
        </nz-list-item>
      </ng-template>
    </nz-list>
  `,
  styles: [`
    .separator {
      margin: 0 8px;
    }
    :host {
      display: block;
      background: var(--component-bg);
      padding: 0 16px;
      border-radius: 4px;
    }
  `]
})
export class NewsListComponent {
  @Input({ required: true }) stories: HNStory[] = [];
}
