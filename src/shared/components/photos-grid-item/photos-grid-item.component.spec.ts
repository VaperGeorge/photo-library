import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotosGridItemComponent } from './photos-grid-item.component';

describe('PhotosGridItemComponent', () => {
  let component: PhotosGridItemComponent;
  let fixture: ComponentFixture<PhotosGridItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotosGridItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhotosGridItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
