import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private eventSubject = new Subject<any>();

  setTipoIngreso(data: any) {
    this.eventSubject.next(data);
  }

  getTipoIngreso(): Subject<any> {
    return this.eventSubject;
  }
}
