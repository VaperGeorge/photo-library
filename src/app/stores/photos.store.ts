import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';

import { PhotoService } from '../services/photo.service';
import { Photo } from '../../shared/interfaces';
import {
  withRequestStatus,
  setPending,
  setFulfilled,
  setError,
} from '../../shared';

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
    isEmpty: computed(() => !!store.photos.length),
  })),
  withMethods((store, http = inject(PhotoService)) => ({
    getPhotos: rxMethod<void>(
      pipe(
        tap(() => patchState(store, setPending())),
        switchMap(() =>
          http.fetchRandomPhotos(store.page(), store.limit()).pipe(
            tapResponse({
              next: (photos) => patchState(store, { photos }, setFulfilled()),
              error: () => {
                patchState(store, setError());
              },
            })
          )
        )
      )
    ),
  })),
  withMethods((store) => ({
    loadMore() {
      patchState(store, { page: store.page() + 1 });
    },
  }))
);
