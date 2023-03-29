import { Injectable } from '@angular/core';
import { Profile } from '@shared/models/profile';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  list: Profile[] = []

  constructor() { }

  create(data: Profile) {
    this.list = this.list.concat(data)
  }

  getItems(): Observable<Profile[]> {
    return of(this.list);
  }
}
