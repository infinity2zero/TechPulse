import { Injectable, signal, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type ThemeType = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private document = inject(DOCUMENT);
  
  // Signal to track the current selected theme
  currentTheme = signal<ThemeType>('auto');

  constructor() {
    // Initialize from local storage if available
    const savedTheme = localStorage.getItem('theme') as ThemeType;
    if (savedTheme) {
      this.currentTheme.set(savedTheme);
    }

    // Effect to apply theme whenever signal changes
    effect(() => {
      const theme = this.currentTheme();
      localStorage.setItem('theme', theme);
      this.applyTheme(theme);
    });
    
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.currentTheme() === 'auto') {
        this.applyTheme('auto');
      }
    });
  }

  setTheme(theme: ThemeType) {
    this.currentTheme.set(theme);
  }

  private applyTheme(theme: ThemeType) {
    let isDark = false;

    if (theme === 'auto') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else {
      isDark = theme === 'dark';
    }

    const html = this.document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      html.setAttribute('data-theme', 'dark');
      // NG-ZORRO dark theme handling typically involves loading a specific stylesheet or setting a class
      // For now, we'll assume a class-based approach or dynamic style loading
    } else {
      html.classList.remove('dark');
      html.setAttribute('data-theme', 'light');
    }
  }
}
