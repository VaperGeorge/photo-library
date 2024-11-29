import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { Photo } from '../../../../shared';
import { FavoriteService } from '../../../services/favorites.service';

@Component({
  selector: 'app-photos-details',
  standalone: true,
  imports: [MatButtonModule, MatIcon, MatCardModule, RouterLink],
  templateUrl: './photos-details.component.html',
  styleUrl: './photos-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotosDetailsComponent {
  readonly service = inject(FavoriteService);
  readonly route = inject(ActivatedRoute);

  readonly photoId = this.route.snapshot.params['id'];

  readonly photo = signal(this.service.getFavoritePhotoById(this.photoId));

  removeFromFavorite({ id }: Photo): void {
    this.service.removePhotoItem(id);
  }
}
