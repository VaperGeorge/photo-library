import { Routes } from '@angular/router';

export const PHOTOS_ROUTE: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./photos-grid/photos-grid.component').then(
        (c) => c.PhotosGridComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./photos-details/photos-details.component').then(
        (c) => c.PhotosDetailsComponent
      ),
  },
];
