import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { HNStory } from '../../core/services/data.service';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [CommonModule, NzListModule, NzIconModule, NzTagModule, NzTypographyModule],
  template: `
    <nz-list [nzDataSource]="stories" [nzRenderItem]="item" [nzItemLayout]="'horizontal'">
      <ng-template #item let-item>
        <nz-list-item>
          <nz-list-item-meta
            [nzTitle]="nzTitle"
            [nzDescription]="descriptionTpl">
            <ng-template #nzTitle>
              <a [href]="item.url" target="_blank" rel="noopener noreferrer">{{ item.title }}</a>
              <nz-tag *ngIf="item.domain" [nzColor]="'default'" style="margin-left: 8px; font-size: 10px;">{{ item.domain }}</nz-tag>
            </ng-template>
            <ng-template #descriptionTpl>
              <span nz-icon nzType="arrow-up" style="color: #ff6600"></span> {{ item.score }} points
              <span nz-typography nzType="secondary" class="separator">|</span>
              <span nz-icon nzType="user"></span> {{ item.by }}
              <span nz-typography nzType="secondary" class="separator">|</span>
              <span nz-icon nzType="message"></span> {{ item.comments }} comments
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
