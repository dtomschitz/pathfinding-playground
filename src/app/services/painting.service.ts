import { Injectable } from '@angular/core';
import { PaintingMode } from '../models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaintingService {
  isMouseLocked = false;
  isMouseLocked$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private currentMode = PaintingMode.CREATE;

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

  updateMode(mode: PaintingMode) {
    console.log(mode);

    this.currentMode = mode;
  }

  get mode() {
    return this.currentMode;
  }
}
