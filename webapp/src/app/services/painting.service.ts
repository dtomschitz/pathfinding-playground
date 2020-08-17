import { Injectable } from '@angular/core';
import { PaintingMode } from '../models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaintingService {
  isMouseLocked = false;
  isMouseLocked$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  mode = PaintingMode.CREATE;

  lockMouse() {
    this.isMouseLocked = true;
    this.isMouseLocked$.next(true);
    console.log('locked');
  }

  releaseMouse() {
    this.isMouseLocked = false;
    this.isMouseLocked$.next(false);
    console.log('released');
  }
}
