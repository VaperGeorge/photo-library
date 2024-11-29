import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Photo } from '../../interfaces';

@Component({
  selector: 'app-photos-grid-item',
  standalone: true,
  imports: [],
  templateUrl: './photos-grid-item.component.html',
  styleUrl: './photos-grid-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotosGridItemComponent {
  photo = input.required<Photo>();

  addToFavorites = output<Photo>();
  openDetails = output<Photo>();
}
