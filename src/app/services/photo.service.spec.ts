import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpParams, provideHttpClient } from '@angular/common/http';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

import { PhotoService } from './photo.service';
import { Photo } from '../../shared/interfaces';

describe('PhotoService', () => {
  let service: PhotoService;
  let httpMock: HttpTestingController;

  const mockPhotos: Photo[] = [
    { id: '1', author: 'Author 1', download_url: 'https://picsum.photos/200/300' } as Photo,
    { id: '2', author: 'Author 2', download_url: 'https://picsum.photos/200/300' } as Photo,
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PhotoService,
        provideExperimentalZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(PhotoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch random photos', () => {
    const page = 1;
    const limit = 2;
    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    service.fetchRandomPhotos(page, limit).subscribe((photos) => {
      expect(photos).toEqual(mockPhotos);
    });

    const req = httpMock.expectOne(
      (req) => req.url === 'https://picsum.photos/v2/list' && req.params.toString() === params.toString(),
    );

    req.flush(mockPhotos);

    httpMock.verify();
  });

  it('should apply a random delay', () => {
    const page = 1;
    const limit = 2;
    const randomDelaySpy = spyOn(Math, 'random').and.returnValue(0.5);

    service.fetchRandomPhotos(page, limit).subscribe();

    const req = httpMock.expectOne('https://picsum.photos/v2/list?page=1&limit=2');
    req.flush(mockPhotos);

    expect(randomDelaySpy).toHaveBeenCalled();
    expect(req.request.params.get('page')).toBe(page.toString());
    expect(req.request.params.get('limit')).toBe(limit.toString());

    httpMock.verify();
  });

  afterEach(() => {
    httpMock.verify();
  });
});
