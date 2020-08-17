import { Injectable } from '@angular/core';
import { PaintingMode } from '../models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaintingService {
  isMousePressed$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  mode = PaintingMode.CREATE;

  click() {
    this.isMousePressed$.next(true);
  }

  release() {
    this.isMousePressed$.next(false);
  }
}
