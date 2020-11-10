import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TriggerService {
  templatePeople = new BehaviorSubject<number>(null);
  manifestPeople = new BehaviorSubject<number>(null);
}
