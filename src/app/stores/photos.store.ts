import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

import { PhotoService } from '../services/photo.service';
import { Photo } from '../../shared/interfaces';
import { withRequestStatus, setPending, setFulfilled, setError } from '../../shared';
import { FavoriteService } from '../services/favorites.service';

type PhotosState = {
  photos: Photo[];
  limit: number;
  page: number;
};

const initialState: PhotosState = {
  photos: [],
  limit: 6,
  page: 1,
};

export const PhotosStore = signalStore(
  withRequestStatus(),
  withState(initialState),
  withComputed((store) => ({
    isError: computed(() => store.requestStatus() === 'error'),
    isLoading: computed(() => store.requestStatus() === 'pending'),
    isFullfilled: computed(() => store.requestStatus() === 'fulfilled'),
  })),
  withMethods((store, http = inject(PhotoService), favoritesService = inject(FavoriteService)) => ({
    getPhotos: rxMethod<void>(
      pipe(
        tap(() => patchState(store, setPending())),
        switchMap(() =>
          http.fetchRandomPhotos(store.page(), store.limit()).pipe(
            tapResponse({
              next: (photos) => patchState(store, { photos: [...store.photos(), ...photos] }, setFulfilled()),
              error: () => {
                patchState(store, setError());
              },
            }),
          ),
        ),
      ),
    ),
    addToFavorites(photo: Photo) {
      favoritesService.addPhotoItem(photo);
    },
  })),
  withMethods((store) => ({
    loadMore(): void {
      patchState(store, { page: store.page() + 1 });
      store.getPhotos();
    },
  })),
  withHooks((store) => ({
    onInit: (): void => {
      store.getPhotos();
    },
  })),
);
