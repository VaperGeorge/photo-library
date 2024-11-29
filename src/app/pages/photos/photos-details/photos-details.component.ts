import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { Photo } from '../../../../shared';
import { FavoriteService } from '../../../services/favorites.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-photos-details',
  standalone: true,
  imports: [MatButtonModule, MatIcon, MatCardModule, RouterLink, JsonPipe],
  templateUrl: './photos-details.component.html',
  styleUrl: './photos-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotosDetailsComponent implements OnInit {
  readonly service = inject(FavoriteService);
  readonly route = inject(ActivatedRoute);

  readonly photoId = signal('');

  readonly photo = computed(() => this.service.getFavoritePhotoById(this.photoId()));

  ngOnInit(): void {
    this.photoId.set(this.route.snapshot.params['photoId']);
  }

  removeFromFavorite({ id }: Photo): void {
    this.service.removePhotoItem(id);
  }
}
