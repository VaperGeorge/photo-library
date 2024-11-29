import { inject, Injectable } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';

import { Photo } from '../../shared';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private readonly cookieService = inject(CookieService);
  private readonly toastr = inject(ToastrService);

  private cookieKey = 'favorite_photos';

  getFavoritePhotos(): Photo[] {
    const cookieData = this.cookieService.get(this.cookieKey);
    return cookieData ? JSON.parse(cookieData) : [];
  }

  getFavoritePhotoById(id: string): Photo | null {
    const photos = this.getFavoritePhotos();
    const foundPhoto = photos.find((p) => p.id === id);

    return foundPhoto ?? null;
  }

  addPhotoItem(photo: Photo): void {
    const favorites = this.getFavoritePhotos();
    const isPresent = favorites.find((p) => p.id === photo.id);

    if (!isPresent) {
      const { download_url, author, id } = photo;

      favorites.push({ download_url, author, id } as Photo);
      this.saveToCookies(favorites);
      this.toastr.success('Photo has been added to favorites', 'Successful!');
    } else {
      this.toastr.info('This photo already exist in favorites', 'Information!');
    }
  }

  removePhotoItem(photoId: string): void {
    const favorites = this.getFavoritePhotos();
    const updatedFavorites = favorites.filter((photo) => photo.id !== photoId);

    this.saveToCookies(updatedFavorites);

    this.toastr.success('Photo has been deleted from favorites', 'Successful!');
  }

  private saveToCookies(favorites: Photo[]): void {
    this.cookieService.set(this.cookieKey, JSON.stringify(favorites), {
      expires: 7,
      path: '/',
    });
  }
}
