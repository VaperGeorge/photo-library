import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JsonPipe } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

import { Photo } from '../../../../shared';
import { FavoriteService } from '../../../services/favorites.service';
import { PhotosDetailsComponent } from './photos-details.component';

describe('PhotosDetailsComponent', () => {
  let component: PhotosDetailsComponent;
  let fixture: ComponentFixture<PhotosDetailsComponent>;
  let favoriteServiceMock: jasmine.SpyObj<FavoriteService>;
  let routeMock: jasmine.SpyObj<ActivatedRoute>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    favoriteServiceMock = jasmine.createSpyObj('FavoriteService', ['getFavoritePhotoById', 'removePhotoItem']);
    favoriteServiceMock.getFavoritePhotoById.and.callFake((id: string) => {
      const photos = [
        { id: '1', author: 'Author 1', download_url: 'https://example.com/photo1' },
        { id: '2', author: 'Author 2', download_url: 'https://example.com/photo2' },
      ] as Photo[];
      return photos.find((p) => p.id === id) || null;
    });

    routeMock = jasmine.createSpyObj('ActivatedRoute', [], { snapshot: { params: { photoId: '1' } } });
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [MatButtonModule, MatIcon, MatCardModule, JsonPipe, PhotosDetailsComponent],
      providers: [
        { provide: FavoriteService, useValue: favoriteServiceMock },
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: Router, useValue: routerSpy },
        provideExperimentalZonelessChangeDetection(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotosDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize photoId with the value from route params', () => {
    fixture.detectChanges();

    expect(component.photoId()).toBe('1');
  });

  it('should fetch the photo from the service based on photoId', () => {
    fixture.detectChanges();

    const photo = component.photo();
    expect(photo).toEqual({
      id: '1',
      author: 'Author 1',
      download_url: 'https://example.com/photo1',
    } as Photo);
    expect(favoriteServiceMock.getFavoritePhotoById).toHaveBeenCalledWith('1');
  });

  it('should call removePhotoItem on FavoriteService when removeFromFavorite() is triggered', () => {
    fixture.detectChanges();

    const photo = component.photo();
    component.removeFromFavorite(photo!);

    expect(favoriteServiceMock.removePhotoItem).toHaveBeenCalledWith('1');
  });

  it('should handle the case when photo does not exist', () => {
    favoriteServiceMock.getFavoritePhotoById.and.returnValue(null);

    component.photoId.set('999');
    fixture.detectChanges();

    const emptyState = fixture.nativeElement.querySelector('.empty-state');
    expect(emptyState).toBeTruthy();
    expect(emptyState.textContent).toContain('The photo does not exist');
  });
});
