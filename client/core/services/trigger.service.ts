import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TriggerService {
  // For TemplatePlanePeople updates
  private templatePeople = new BehaviorSubject<number>(null);
  templatePeople$ = this.templatePeople.asObservable();
  setTemplatePeople = (id: number) => this.templatePeople.next(id);
}
