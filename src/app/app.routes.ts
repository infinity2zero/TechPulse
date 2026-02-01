import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { TrendsComponent } from './pages/trends/trends';
import { NewsComponent } from './pages/news/news';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'trends', component: TrendsComponent },
  { path: 'news', component: NewsComponent }
];
