import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'trends', component: DashboardComponent }, // Placeholder
  { path: 'news', component: DashboardComponent }    // Placeholder
];
