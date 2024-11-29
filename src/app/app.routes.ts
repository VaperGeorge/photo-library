import { Routes } from '@angular/router';

import { PHOTOS_ROUTE } from './pages/photos/photos.routes';
import { PhotosStore } from './stores/photos.store';
import { PhotoService } from './services/photo.service';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'photos' },
  {
    path: 'photos',
    children: PHOTOS_ROUTE,
    providers: [PhotosStore, PhotoService],
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./pages/favorites-grid/favorites-grid.component').then(
        (c) => c.FavoritesGridComponent
      ),
  },
];
