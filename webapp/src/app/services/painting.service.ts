import { Injectable } from '@angular/core';
import { PaintingMode } from '../models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaintingService {
  isMousePressed = false;
  isMousePressed$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  mode = PaintingMode.CREATE;

  click() {
    this.isMousePressed = true;
    this.isMousePressed$.next(true);
  }

  release() {
    this.isMousePressed = false;
    this.isMousePressed$.next(false);
  }
}
