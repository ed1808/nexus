import { Routes } from "@angular/router";
import { LayoutComponent } from "./modules/shared/components/layout/layout.component";

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./modules/dashboard/pages/dashboard-page/dashboard-page.component').then(mod => mod.DashboardPageComponent)
      },
      {
        path: 'notes',
        loadComponent: () => import('./modules/notes/pages/notes-page/notes-page.component').then(mod => mod.NotesPageComponent)
      },
      {
        path: 'tasks',
        loadComponent: () => import('./modules/tasks/pages/task-page/task-page.component').then(mod => mod.TaskPageComponent)
      },
      {
        path: 'calendar',
        loadComponent: () => import('./modules/calendar/pages/calendar-page/calendar-page.component').then(mod => mod.CalendarPageComponent)
      }
    ]
  }
];
