import { TestBed } from '@angular/core/testing';
import { PhotosStore } from './photos.store'; // Adjust the path to your store
import { PhotoService } from '../services/photo.service';
import { FavoriteService } from '../services/favorites.service';
import { of, throwError } from 'rxjs';
import { Photo } from '../../shared/interfaces';
import { signal, computed } from '@angular/core';

const createMockPhotosStore = () => {
  const mockPhotos = signal<Photo[]>([
    { id: '1', author: 'Author 1', download_url: 'https://example.com/photo1' } as Photo,
    { id: '2', author: 'Author 2', download_url: 'https://example.com/photo2' } as Photo,
  ]);

  const mockLimit = signal(6);
  const mockPage = signal(1);
  const mockRequestStatus = signal<'idle' | 'pending' | 'fulfilled' | 'error'>('idle');

  return {
    // Signals
    photos: mockPhotos,
    page: mockPage,
    requestStatus: mockRequestStatus,
    limit: mockLimit,
    // Computed properties
    isError: computed(() => mockRequestStatus() === 'error'),
    isLoading: computed(() => mockRequestStatus() === 'pending'),
    isFullfilled: computed(() => mockRequestStatus() === 'fulfilled'),
    getPhotos: jasmine.createSpy('loadMore').and.callFake(() => {
      // Simulate fetching photos and updating state
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
    // Methods
    loadMore: jasmine.createSpy('loadMore').and.callFake(() => {
      // Simulate fetching photos and updating state
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
    addToFavorites: jasmine.createSpy('addToFavorites').and.callFake((photo: Photo) => {
      // Simulate adding to favorites (no-op here)
    }),
  };
};

// Mock services
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
      ],
    });

    store = createMockPhotosStore();
    photoService = TestBed.inject(PhotoService);
    favoriteService = TestBed.inject(FavoriteService);
  });

  it('should initialize with correct state', () => {
    // Check the initial state
    expect(store.photos()).toEqual([]);
    expect(store.page()).toBe(1);
    expect(store.limit()).toBe(6);
  });

  it('should set request status as "pending" when fetching photos', () => {
    store.getPhotos();

    expect(store.isLoading()).toBeTrue();
    expect(store.isError()).toBeFalse();
  });

  it('should update photos state after fetching photos', (done) => {
    store.getPhotos();

    // Mock the asynchronous behavior with a setTimeout or use Jasmine's done() callback
    setTimeout(() => {
      expect(store.photos()).toEqual([
        { id: '1', author: 'Author 1', download_url: 'http://example.com/photo1.jpg' } as Photo,
      ]);
      expect(store.isLoading()).toBeFalse();
      expect(store.isFullfilled()).toBeTrue();
      done();
    }, 300);
  });

  it('should handle error in getPhotos and set isError flag', (done) => {
    // Simulate an error response from the photo service
    spyOn(photoService, 'fetchRandomPhotos').and.returnValue(throwError(() => new Error('API Error')));

    store.getPhotos();

    setTimeout(() => {
      expect(store.isLoading()).toBeFalse();
      expect(store.isError()).toBeTrue();
      done();
    }, 300);
  });

  it('should add photo to favorites', () => {
    const photo: Photo = { id: '1', author: 'Author 1', download_url: 'http://example.com/photo1.jpg' } as Photo;
    const addPhotoSpy = spyOn(favoriteService, 'addPhotoItem');

    store.addToFavorites(photo);

    expect(addPhotoSpy).toHaveBeenCalledWith(photo);
  });

  it('should load more photos when loadMore is called', (done) => {
    // Initially, the page is 1
    expect(store.page()).toBe(1);

    store.loadMore();

    // Simulate async delay for loading more photos
    setTimeout(() => {
      expect(store.page()).toBe(2); // Page should increment by 1
      done();
    }, 300);
  });
});
