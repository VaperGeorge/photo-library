import { TestBed } from '@angular/core/testing';
import { PhotosStore } from './photos.store';
import { PhotoService } from '../services/photo.service';
import { FavoriteService } from '../services/favorites.service';
import { of, throwError } from 'rxjs';
import { Photo } from '../../shared/interfaces';
import { signal, computed, provideExperimentalZonelessChangeDetection } from '@angular/core';

const mockPhotos = signal<Photo[]>([
  { id: '1', author: 'Author 1', download_url: 'https://example.com/photo1' } as Photo,
  { id: '2', author: 'Author 2', download_url: 'https://example.com/photo2' } as Photo,
]);

const createMockPhotosStore = () => {
  const mockLimit = signal(9);
  const mockPage = signal(1);
  const mockRequestStatus = signal<'idle' | 'pending' | 'fulfilled' | 'error'>('idle');

  return {
    photos: mockPhotos,
    page: mockPage,
    requestStatus: mockRequestStatus,
    limit: mockLimit,
    isError: computed(() => mockRequestStatus() === 'error'),
    isLoading: computed(() => mockRequestStatus() === 'pending'),
    isFullfilled: computed(() => mockRequestStatus() === 'fulfilled'),
    getPhotos: jasmine.createSpy('loadMore').and.callFake(() => {
      mockRequestStatus.set('pending');
      setTimeout(() => {
        const newPhotos: Photo[] = [
          {
            id: `${mockPage() * 10 + 1}`,
            author: `Author ${mockPage() * 10 + 1}`,
            download_url: 'https://example.com/photo3',
          } as Photo,
          {
            id: `${mockPage() * 10 + 2}`,
            author: `Author ${mockPage() * 10 + 2}`,
            download_url: 'https://example.com/photo4',
          } as Photo,
        ];
        mockPhotos.set([...mockPhotos(), ...newPhotos]);
        mockRequestStatus.set('fulfilled');
        mockPage.set(mockPage() + 1);
      }, 200);
    }),
    loadMore: jasmine.createSpy('loadMore').and.callFake(() => {
      mockRequestStatus.set('pending');
      setTimeout(() => {
        const newPhotos: Photo[] = [
          {
            id: `${mockPage() * 10 + 1}`,
            author: `Author ${mockPage() * 10 + 1}`,
            download_url: 'https://example.com/photo3',
          } as Photo,
          {
            id: `${mockPage() * 10 + 2}`,
            author: `Author ${mockPage() * 10 + 2}`,
            download_url: 'https://example.com/photo4',
          } as Photo,
        ];
        mockPhotos.set([...mockPhotos(), ...newPhotos]);
        mockRequestStatus.set('fulfilled');
        mockPage.set(mockPage() + 1);
      }, 200);
    }),
    addToFavorites: jasmine.createSpy('addToFavorites').and.callFake((photo: Photo) => {}),
  };
};

class MockPhotoService {
  fetchRandomPhotos(page: number, limit: number) {
    return of([{ id: '1', author: 'Author 1', download_url: 'http://example.com/photo1.jpg' }]);
  }
}

class MockFavoriteService {
  addPhotoItem(photo: Photo) {}
}

describe('PhotosStore', () => {
  let store: ReturnType<typeof createMockPhotosStore>;
  let photoService: PhotoService;
  let favoriteService: FavoriteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PhotosStore,
        { provide: PhotoService, useClass: MockPhotoService },
        { provide: FavoriteService, useClass: MockFavoriteService },
        provideExperimentalZonelessChangeDetection(),
      ],
    });

    store = createMockPhotosStore();
    photoService = TestBed.inject(PhotoService);
    favoriteService = TestBed.inject(FavoriteService);
  });

  it('should initialize with correct state', () => {
    expect(store.photos()).toEqual(mockPhotos());
    expect(store.page()).toBe(1);
    expect(store.limit()).toBe(9);
  });

  it('should set request status as "pending" when fetching photos', () => {
    store.getPhotos();

    expect(store.isLoading()).toBeTrue();
    expect(store.isError()).toBeFalse();
  });

  it('should load more photos when loadMore is called', (done) => {
    expect(store.page()).toBe(1);

    store.loadMore();

    setTimeout(() => {
      expect(store.page()).toBe(2);
      done();
    }, 300);
  });
});
