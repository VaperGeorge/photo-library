import { Routes } from '@angular/router';
import { PHOTOS_ROUTE } from './pages/photos/photos.routes';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'photos' },
  {
    path: 'photos',
    children: PHOTOS_ROUTE,
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./pages/favorites-grid/favorites-grid.component').then(
        (c) => c.FavoritesGridComponent
      ),
  },
];
