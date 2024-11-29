import { Component, input } from '@angular/core';

import { Photo } from '../../interfaces';

@Component({
  selector: 'app-photos-grid-item',
  standalone: true,
  imports: [],
  templateUrl: './photos-grid-item.component.html',
  styleUrl: './photos-grid-item.component.scss',
})
export class PhotosGridItemComponent {
  photo = input.required<Photo>();
}
