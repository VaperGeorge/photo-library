import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotosGridItemComponent } from './photos-grid-item.component';
import { By } from '@angular/platform-browser';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

import { Photo } from '../../interfaces';

describe('PhotosGridItemComponent', () => {
  let fixture: ComponentFixture<PhotosGridItemComponent>;
  let component: PhotosGridItemComponent;

  const mockPhoto: Photo = {
    id: '1',
    author: 'Author 1',
    download_url: 'https://example.com/photo1.jpg',
  } as Photo;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotosGridItemComponent],
      providers: [provideExperimentalZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotosGridItemComponent);
    fixture.componentRef.setInput('photo', mockPhoto);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should display photo details correctly', () => {
    const photoAuthor = fixture.debugElement.query(By.css('.photo-item__name')).nativeElement;
    expect(photoAuthor.textContent).toContain(mockPhoto.author);

    const photoImg = fixture.debugElement.query(By.css('img')).nativeElement;
    expect(photoImg.src).toBe(mockPhoto.download_url);
  });

  it('should emit addToFavorites event when clicked', () => {
    spyOn(component.addToFavorites, 'emit');

    const button = fixture.debugElement.query(By.css('.photo-item__img')).nativeElement;
    button.click();

    expect(component.addToFavorites.emit).toHaveBeenCalledWith(mockPhoto);
  });

  it('should emit openDetails event when clicked', () => {
    spyOn(component.openDetails, 'emit');

    const button = fixture.debugElement.query(By.css('.photo-item__img')).nativeElement;
    button.click();

    expect(component.openDetails.emit).toHaveBeenCalledWith(mockPhoto);
  });
});
