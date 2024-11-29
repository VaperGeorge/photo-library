import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable } from 'rxjs';

import { Photo } from '../../shared/interfaces';

const API_URL = 'https://picsum.photos/v2/list';

@Injectable()
export class PhotoService {
  private readonly http = inject(HttpClient);

  fetchRandomPhotos(page: number, limit: number): Observable<Photo[]> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    const randomDelayNumber = Math.floor(Math.random() * (300 - 200 + 1)) + 200;

    return this.http.get<Photo[]>(API_URL, { params }).pipe(delay(randomDelayNumber));
  }
}
