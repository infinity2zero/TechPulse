import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ThemeService, ThemeType } from './core/services/theme.service';
import { DataService } from './core/services/data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterLink,
    RouterLinkActive,
    FormsModule,
    NzLayoutModule, 
    NzMenuModule, 
    NzIconModule,
    NzButtonModule,
    NzDropDownModule,
    NzSwitchModule,
    NzAvatarModule
  ],
  template: `
    <nz-layout class="app-layout">
      <nz-header class="floating-header">
        <div class="header-container">
          <div class="logo-area">
            <img src="logo.svg" alt="logo">
            <h1>TechPulse</h1>
          </div>
          
          <nav class="nav-chips">
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-chip">
              <span nz-icon nzType="home"></span>
              <span>Home</span>
            </a>
            <a routerLink="/trends" routerLinkActive="active" class="nav-chip">
              <span nz-icon nzType="github"></span>
              <span>GitHub Trends</span>
            </a>
            <a routerLink="/news" routerLinkActive="active" class="nav-chip">
              <span nz-icon nzType="read"></span>
              <span>Hacker News</span>
            </a>
          </nav>

          <div class="header-right">
            <button nz-button nzType="default" (click)="refreshData()" [nzLoading]="isRefreshing" class="action-btn">
              <span nz-icon nzType="reload"></span>
              <span class="btn-text">Refresh</span>
            </button>
            <nz-switch
              [(ngModel)]="isDarkMode"
              (ngModelChange)="toggleTheme()"
              [nzCheckedChildren]="checkedTemplate"
              [nzUnCheckedChildren]="uncheckedTemplate"
            ></nz-switch>
            <ng-template #checkedTemplate><span nz-icon nzType="bulb"></span></ng-template>
            <ng-template #uncheckedTemplate><span nz-icon nzType="bulb" nzTheme="fill"></span></ng-template>
          </div>
        </div>
      </nz-header>

      <nz-content class="main-content">
        <div class="inner-content">
          <router-outlet></router-outlet>
        </div>
      </nz-content>
    </nz-layout>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .app-layout {
      min-height: 100vh;
      // background: var(--bg-color);
    }

    .floating-header {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1000;
      padding: 0;
      height: 64px;
      line-height: 64px;
      background: var(--header-bg);
      box-shadow: 0 2px 8px var(--shadow-color);
      transition: background 0.3s, box-shadow 0.3s;
    }

    .header-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
    }

    .logo-area {
      display: flex;
      align-items: center;
      min-width: 140px;
      
      img {
        height: 32px;
        margin-right: 12px;
      }
      
      h1 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: var(--text-color);
        line-height: 1;
      }
    }

    .nav-chips {
      display: flex;
      gap: 12px;
      flex: 1;
      justify-content: center;
    }

    .nav-chip {
      display: inline-flex;
      align-items: center;
      height: 36px;
      padding: 0 16px;
      border: 1px solid var(--border-color);
      background: var(--component-bg);
      color: var(--text-color);
      font-weight: 500;
      font-size: 14px;
      text-decoration: none;
      transition: all 0.3s ease;
      /* Sharp edges as requested */
      border-radius: 0; 
      cursor: pointer;
      line-height: 1.5;
      
      span[nz-icon] {
        margin-right: 8px;
        font-size: 16px;
      }

      &:hover {
        color: #1890ff;
        border-color: #1890ff;
        background: rgba(24, 144, 255, 0.05);
      }

      &.active {
        background: #1890ff;
        color: #fff;
        border-color: #1890ff;
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
      min-width: 140px;
      justify-content: flex-end;
    }

    .main-content {
      margin-top: 64px; /* Offset for fixed header */
      padding: 24px;
      min-height: calc(100vh - 64px);
    }

    .inner-content {
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .header-container {
        padding: 0 12px;
      }
      
      .logo-area h1 {
        display: none; /* Hide text on small screens */
      }
      
      .nav-chip {
        padding: 0 10px;
        span:not([nz-icon]) {
          display: none; /* Hide text, show only icons on mobile */
        }
        span[nz-icon] {
          margin-right: 0;
        }
      }
      
      .btn-text {
        display: none;
      }
    }
  `]
})
export class AppComponent {
  isDarkMode = false;
  isRefreshing = false;
  private dataService = inject(DataService);
  private message = inject(NzMessageService);

  constructor() {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.isDarkMode = prefersDark.matches;
    this.toggleTheme();

    prefersDark.addEventListener('change', (e) => {
      this.isDarkMode = e.matches;
      this.toggleTheme();
    });
  }

  toggleTheme() {
    if (this.isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

  refreshData() {
    this.isRefreshing = true;
    this.dataService.refresh();
    
    // Play sound
    this.playNotificationSound();
    
    // Show alert
    this.message.success('Data refreshed successfully!', {
      nzDuration: 3000
    });

    // Reset loading state after a short delay
    setTimeout(() => {
      this.isRefreshing = false;
    }, 1000);
  }

  playNotificationSound() {
    const audio = new Audio('assets/sounds/notification.mp3');
    // Simple beep using Web Audio API to avoid external dependency
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'sine';
    osc.frequency.value = 880; // A5
    gain.gain.value = 0.1;
    
    osc.start();
    setTimeout(() => {
      osc.stop();
    }, 200);
  }
}
