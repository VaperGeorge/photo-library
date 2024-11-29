import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter, RouterOutlet } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([]), provideExperimentalZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it(`should have a title 'photo-library'`, () => {
    expect(component.title).toEqual('photo-library');
  });

  it('should render navigation buttons with correct routes', () => {
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons.length).toBeGreaterThanOrEqual(2); // Adjust if you have more or fewer buttons.

    const favoritesButton = buttons.find((btn) => btn.nativeElement.textContent.includes('Favorites'));
    const photosButton = buttons.find((btn) => btn.nativeElement.textContent.includes('Photos'));

    expect(favoritesButton).toBeTruthy();
    expect(photosButton).toBeTruthy();
  });

  it('should contain the router outlet', () => {
    const routerOutlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(routerOutlet).toBeTruthy();
  });
});
