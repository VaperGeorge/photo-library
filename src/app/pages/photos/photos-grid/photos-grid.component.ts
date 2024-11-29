import { Component, inject } from '@angular/core';
import { PhotosStore } from '../../../stores/photos.store';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { PhotosGridItemComponent } from '../../../../shared';

@Component({
  selector: 'app-photos-grid',
  standalone: true,
  imports: [
    MatCardModule,
    MatProgressSpinner,
    MatGridList,
    MatGridTile,
    PhotosGridItemComponent,
  ],
  templateUrl: './photos-grid.component.html',
  styleUrl: './photos-grid.component.scss',
})
export class PhotosGridComponent {
  store = inject(PhotosStore);
}
