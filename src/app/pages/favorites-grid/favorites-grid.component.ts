import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

import { Photo, PhotosGridItemComponent } from '../../../shared';
import { FavoriteService } from '../../services/favorites.service';

@Component({
  selector: 'app-favorites-grid',
  standalone: true,
  imports: [MatCardModule, PhotosGridItemComponent],
  templateUrl: './favorites-grid.component.html',
  styleUrl: './favorites-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesGridComponent {
  readonly service = inject(FavoriteService);
  readonly router = inject(Router);

  photos = signal(this.service.getFavoritePhotos());

  openDetails(photo: Photo): void {
    this.router.navigate(['/photos', photo.id]);
  }
}
