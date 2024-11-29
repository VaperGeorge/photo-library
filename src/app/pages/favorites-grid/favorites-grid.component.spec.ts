import { ComponentFixture, DeferBlockBehavior, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { provideExperimentalZonelessChangeDetection, ɵDeferBlockState } from '@angular/core';

import { FavoritesGridComponent } from './favorites-grid.component';
import { Photo, PhotosGridItemComponent } from '../../../shared';
import { FavoriteService } from '../../services/favorites.service';

describe('FavoritesGridComponent', () => {
  let component: FavoritesGridComponent;
  let fixture: ComponentFixture<FavoritesGridComponent>;
  let favoriteServiceMock: jasmine.SpyObj<FavoriteService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    favoriteServiceMock = jasmine.createSpyObj('FavoriteService', ['getFavoritePhotos']);
    favoriteServiceMock.getFavoritePhotos.and.returnValue([
      { id: '1', author: 'Author 1', download_url: 'https://example.com/photo1' } as Photo,
      { id: '2', author: 'Author 2', download_url: 'https://example.com/photo2' } as Photo,
    ]);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [MatCardModule, PhotosGridItemComponent, FavoritesGridComponent],
      providers: [
        { provide: FavoriteService, useValue: favoriteServiceMock },
        { provide: Router, useValue: routerSpy },
        provideExperimentalZonelessChangeDetection(),
      ],
      deferBlockBehavior: DeferBlockBehavior.Manual,
    }).compileComponents();

    fixture = TestBed.createComponent(FavoritesGridComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with favorite photos from the service', () => {
    fixture.detectChanges();

    expect(component.photos()).toEqual(favoriteServiceMock.getFavoritePhotos());
  });

  it('should render favorite photos when there are any', async () => {
    fixture.detectChanges();

    const firstDeferBlock = (await fixture.getDeferBlocks())[0];
    await firstDeferBlock.render(ɵDeferBlockState.Complete);

    const photoItems = fixture.nativeElement.querySelectorAll('.favorite-grid__item');

    expect(photoItems.length).toBe(2);
  });

  it('should display an empty state when there are no favorite photos', async () => {
    favoriteServiceMock.getFavoritePhotos.and.returnValue([]);

    fixture.detectChanges();

    const firstDeferBlock = (await fixture.getDeferBlocks())[0];
    await firstDeferBlock.render(ɵDeferBlockState.Placeholder);

    const emptyState = fixture.nativeElement.querySelector('.empty-state');
    console.log(emptyState);
    expect(emptyState).toBeTruthy();
  });

  it('should navigate to photo details when openDetails() is called', () => {
    const photo = { id: '1', author: 'Author 1', download_url: 'https://example.com/photo1' };

    component.openDetails(photo as Photo);

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/photos', photo.id]);
  });
});
