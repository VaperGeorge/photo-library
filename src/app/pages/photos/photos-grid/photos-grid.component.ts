import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { Photo, PhotosGridItemComponent } from '../../../../shared';
import { PhotosStore } from '../../../stores/photos.store';

@Component({
  selector: 'app-photos-grid',
  standalone: true,
  imports: [MatCardModule, MatProgressSpinner, PhotosGridItemComponent],
  templateUrl: './photos-grid.component.html',
  styleUrl: './photos-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotosGridComponent {
  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    if (this.store.isLoading()) return;

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const offsetBottom = 10;

    if (scrollTop + clientHeight >= scrollHeight - offsetBottom) {
      this.store.loadMore();
    }
  }

  store = inject(PhotosStore);

  addToFavorites(photo: Photo): void {
    this.store.addToFavorites(photo);
  }
}
