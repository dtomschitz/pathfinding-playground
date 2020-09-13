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
  }

  releaseMouse() {
    this.isMouseLocked = false;
    this.isMouseLocked$.next(false);
  }

  updateMode(mode: PaintingMode) {
    this.currentMode = mode;
  }

  get mode() {
    return this.currentMode;
  }
}
