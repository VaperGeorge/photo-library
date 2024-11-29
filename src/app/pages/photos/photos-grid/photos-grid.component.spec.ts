import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { By } from '@angular/platform-browser';

import { PhotosGridComponent } from './photos-grid.component';
import { PhotosStore } from '../../../stores/photos.store';
import { Photo } from '../../../../shared';
import { computed, provideExperimentalZonelessChangeDetection, signal, ɵDeferBlockState } from '@angular/core';

const createMockPhotosStore = () => {
  const mockPhotos = signal<Photo[]>([
    { id: '1', author: 'Author 1', download_url: 'https://example.com/photo1' } as Photo,
    { id: '2', author: 'Author 2', download_url: 'https://example.com/photo2' } as Photo,
  ]);

  const mockPage = signal(1);
  const mockRequestStatus = signal<'idle' | 'pending' | 'fulfilled' | 'error'>('idle');

  return {
    photos: mockPhotos,
    page: mockPage,
    requestStatus: mockRequestStatus,

    isError: computed(() => mockRequestStatus() === 'error'),
    isLoading: computed(() => mockRequestStatus() === 'pending'),
    isFullfilled: computed(() => mockRequestStatus() === 'fulfilled'),

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

describe('PhotosGridComponent', () => {
  let component: PhotosGridComponent;
  let fixture: ComponentFixture<PhotosGridComponent>;
  let mockStore: ReturnType<typeof createMockPhotosStore>;

  beforeEach(async () => {
    mockStore = createMockPhotosStore();

    await TestBed.configureTestingModule({
      imports: [MatCardModule, MatProgressSpinner, PhotosGridComponent],
      providers: [{ provide: PhotosStore, useValue: mockStore }, provideExperimentalZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotosGridComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display a list of photos from the store', async () => {
    fixture.detectChanges();

    const photoItems = fixture.debugElement.queryAll(By.css('app-photos-grid-item'));
    expect(photoItems.length).toBe(2);
  });

  it('should call store.loadMore() when scrolled to the bottom', () => {
    const scrollEvent = new Event('scroll');

    Object.defineProperty(document.documentElement, 'scrollTop', { value: 200, writable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 1000, writable: true });
    Object.defineProperty(document.documentElement, 'clientHeight', { value: 800, writable: true });

    component.onScroll();
    expect(mockStore.loadMore).toHaveBeenCalled();
  });

  it('should call loadMore() on scroll', () => {
    const fixture = TestBed.createComponent(PhotosGridComponent);
    const component = fixture.componentInstance;

    component.onScroll();
    expect(mockStore.loadMore).toHaveBeenCalled();
  });

  it('should display a spinner when loading', () => {
    mockStore.isLoading = computed(() => true);
    const fixture = TestBed.createComponent(PhotosGridComponent);
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('mat-spinner'));
    expect(spinner).toBeTruthy();
  });

  it('should display an error message on API error', () => {
    mockStore.isError = computed(() => true);
    const fixture = TestBed.createComponent(PhotosGridComponent);
    fixture.detectChanges();

    const errorMessage = fixture.debugElement.query(By.css('mat-card-content div')).nativeElement;
    expect(errorMessage.textContent).toContain('Something whent wrong or API error');
  });
});
