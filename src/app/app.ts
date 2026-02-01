import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { ThemeService, ThemeType } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterLink,
    NzLayoutModule, 
    NzMenuModule, 
    NzIconModule,
    NzButtonModule,
    NzDropDownModule,
    NzAvatarModule
  ],
  template: `
    <nz-layout class="app-layout">
      <nz-sider
        class="menu-sidebar"
        nzCollapsible
        nzWidth="256px"
        nzBreakpoint="md"
        [(nzCollapsed)]="isCollapsed"
        [nzTrigger]="null">
        <div class="sidebar-logo">
          <a routerLink="/">
            <img src="logo.svg" alt="logo">
            <h1 *ngIf="!isCollapsed">TechPulse</h1>
          </a>
        </div>
        <ul nz-menu nzTheme="dark" nzMode="inline" [nzInlineCollapsed]="isCollapsed">
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/dashboard">
              <span nz-icon nzType="dashboard"></span>
              <span>Dashboard</span>
            </a>
          </li>
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/trends">
              <span nz-icon nzType="line-chart"></span>
              <span>Trends</span>
            </a>
          </li>
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/news">
              <span nz-icon nzType="read"></span>
              <span>News</span>
            </a>
          </li>
        </ul>
      </nz-sider>
      <nz-layout>
        <nz-header>
          <div class="app-header">
            <span class="header-trigger" (click)="isCollapsed = !isCollapsed">
                <span nz-icon [nzType]="isCollapsed ? 'menu-unfold' : 'menu-fold'"></span>
            </span>
            <div class="header-right">
              <button nz-button nz-dropdown [nzDropdownMenu]="themeMenu" nzType="text">
                <span nz-icon [nzType]="themeIcon()"></span>
                Theme
              </button>
              <nz-dropdown-menu #themeMenu="nzDropdownMenu">
                <ul nz-menu>
                  <li nz-menu-item (click)="setTheme('light')">
                    <span nz-icon nzType="sun"></span> Light
                  </li>
                  <li nz-menu-item (click)="setTheme('dark')">
                    <span nz-icon nzType="moon"></span> Dark
                  </li>
                  <li nz-menu-item (click)="setTheme('auto')">
                    <span nz-icon nzType="desktop"></span> Auto
                  </li>
                </ul>
              </nz-dropdown-menu>
            </div>
          </div>
        </nz-header>
        <nz-content>
          <div class="inner-content">
            <router-outlet></router-outlet>
          </div>
        </nz-content>
      </nz-layout>
    </nz-layout>
  `,
  styles: [`
    :host {
      display: flex;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .app-layout {
      height: 100vh;
      background: var(--bg-color);
    }

    .menu-sidebar {
      position: relative;
      z-index: 10;
      min-height: 100vh;
      box-shadow: 2px 0 6px rgba(0,21,41,.35);
    }

    .header-trigger {
      height: 64px;
      padding: 0 24px;
      font-size: 20px;
      cursor: pointer;
      transition: color .3s;
      color: var(--text-color);
    }

    .header-trigger:hover {
      color: #1890ff;
    }

    .sidebar-logo {
      position: relative;
      height: 64px;
      padding-left: 24px;
      overflow: hidden;
      line-height: 64px;
      background: #002140;
      transition: all .3s;
    }

    .sidebar-logo img {
      display: inline-block;
      height: 32px;
      vertical-align: middle;
    }

    .sidebar-logo h1 {
      display: inline-block;
      margin: 0 0 0 12px;
      color: #fff;
      font-weight: 600;
      font-size: 20px;
      vertical-align: middle;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif; 
    }

    nz-header {
      padding: 0;
      width: 100%;
      z-index: 2;
      background: var(--header-bg); 
      box-shadow: 0 1px 4px var(--shadow-color);
      border-bottom: 1px solid var(--border-color);
    }

    .app-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
    }

    .header-right {
      margin-right: 24px;
    }

    nz-content {
      margin: 24px;
    }

    .inner-content {
      padding: 24px;
      background: var(--component-bg);
      color: var(--text-color);
      min-height: 100%;
      border-radius: 4px; 
    }
  `]
})
export class AppComponent {
  isCollapsed = false;
  themeService = inject(ThemeService);

  setTheme(theme: ThemeType) {
    this.themeService.setTheme(theme);
  }

  themeIcon() {
    switch (this.themeService.currentTheme()) {
      case 'light': return 'sun';
      case 'dark': return 'moon';
      default: return 'desktop';
    }
  }
}
