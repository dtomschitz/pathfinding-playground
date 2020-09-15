import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GridMouseService {
  private readonly _isMouseLocked = new BehaviorSubject<boolean>(false);

  readonly isMouseLocked$ = this._isMouseLocked.asObservable();

  private get isMouseLocked(): boolean {
    return this._isMouseLocked.getValue();
  }

  private set isMouseLocked(isMouseLocked: boolean) {
    this._isMouseLocked.next(isMouseLocked);
  }

  lockMouse() {
    this.isMouseLocked = true;
  }

  releaseMouse() {
    this.isMouseLocked = false;
  }
}
