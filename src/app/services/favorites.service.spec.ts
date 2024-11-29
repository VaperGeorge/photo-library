import { TestBed } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { FavoriteService } from './favorites.service';
import { Photo } from '../../shared';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('FavoriteService', () => {
  let service: FavoriteService;
  let cookieService: jasmine.SpyObj<CookieService>;
  let toastr: jasmine.SpyObj<ToastrService>;

  const mockPhoto = { id: '1', author: 'Author 1', download_url: 'https://picsum.photos/200/300' } as Photo;

  beforeEach(() => {
    const cookieServiceSpy = jasmine.createSpyObj('CookieService', ['get', 'set']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'info']);

    TestBed.configureTestingModule({
      providers: [
        FavoriteService,
        { provide: CookieService, useValue: cookieServiceSpy },
        { provide: ToastrService, useValue: toastrSpy },
        provideExperimentalZonelessChangeDetection(),
      ],
    });

    service = TestBed.inject(FavoriteService);
    cookieService = TestBed.inject(CookieService) as jasmine.SpyObj<CookieService>;
    toastr = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  it('should get favorite photos from cookies', () => {
    const mockFavorites = [{ id: '1', author: 'Author 1', download_url: 'https://picsum.photos/200/300' } as Photo];
    cookieService.get.and.returnValue(JSON.stringify(mockFavorites));

    const result = service.getFavoritePhotos();

    expect(result).toEqual(mockFavorites);
    expect(cookieService.get).toHaveBeenCalledWith('favorite_photos');
  });

  it('should return an empty array if no favorite photos are in cookies', () => {
    cookieService.get.and.returnValue('');

    const result = service.getFavoritePhotos();

    expect(result).toEqual([]);
    expect(cookieService.get).toHaveBeenCalledWith('favorite_photos');
  });

  it('should add a photo to favorites', () => {
    cookieService.get.and.returnValue('[]'); 
    cookieService.set.and.stub();

    service.addPhotoItem(mockPhoto);

    expect(cookieService.set).toHaveBeenCalled();
    expect(toastr.success).toHaveBeenCalledWith('Photo has been added to favorites', 'Successful!');
  });

  it('should not add a photo if it already exists in favorites', () => {
    const existingFavorites = [{ id: '1', author: 'Author 1', download_url: 'https://picsum.photos/200/300' }];
    cookieService.get.and.returnValue(JSON.stringify(existingFavorites));

    service.addPhotoItem(mockPhoto);

    expect(cookieService.set).not.toHaveBeenCalled(); 
    expect(toastr.info).toHaveBeenCalledWith('This photo already exist in favorites', 'Information!');
  });

  it('should remove a photo from favorites', () => {
    const existingFavorites = [{ id: '1', author: 'Author 1', download_url: 'https://picsum.photos/200/300' }];
    cookieService.get.and.returnValue(JSON.stringify(existingFavorites));
    cookieService.set.and.stub();

    service.removePhotoItem(mockPhoto.id);

    expect(cookieService.set).toHaveBeenCalledWith('favorite_photos', JSON.stringify([]), jasmine.any(Object));
    expect(toastr.success).toHaveBeenCalledWith('Photo has been deleted from favorites', 'Successful!');
  });

  it('should save updated favorites to cookies after removing a photo', () => {
    const existingFavorites = [
      { id: '1', author: 'Author 1', download_url: 'https://picsum.photos/200/300' },
      { id: '2', author: 'Author 2', download_url: 'https://picsum.photos/200/300' },
    ];
    cookieService.get.and.returnValue(JSON.stringify(existingFavorites));
    cookieService.set.and.stub();

    service.removePhotoItem('1');

    const expectedFavorites = [{ id: '2', author: 'Author 2', download_url: 'https://picsum.photos/200/300' }];
    expect(cookieService.set).toHaveBeenCalledWith(
      'favorite_photos',
      JSON.stringify(expectedFavorites),
      jasmine.any(Object),
    );
    expect(toastr.success).toHaveBeenCalledWith('Photo has been deleted from favorites', 'Successful!');
  });

  afterEach(() => {
    cookieService.get.calls.reset();
    cookieService.set.calls.reset();
    toastr.success.calls.reset();
    toastr.info.calls.reset();
  });
});
