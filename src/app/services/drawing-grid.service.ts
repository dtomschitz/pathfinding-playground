import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Pixel } from '../models';

@Injectable({ providedIn: 'root' })
export class DrawingGridService {
  private readonly _isMouseLocked = new BehaviorSubject<boolean>(false);
  private readonly _pixels = new BehaviorSubject<Pixel[]>([]);

  readonly isMouseLocked$ = this._isMouseLocked.asObservable();
  readonly pixels$ = this._pixels.asObservable();

  lockMouse() {
    this.isMouseLocked = true;
  }

  releaseMouse() {
    this.isMouseLocked = false;
  }

  fillPixel(x: number, y: number, fillStyle: string) {
    this.updatePixel(`${y}-${x}`, { fillStyle });
  }

  clearPixel(x: number, y: number) {
    this.updatePixel(`${y}-${x}`, { fillStyle: undefined });
  }

  private updatePixel(id: string, changes: Partial<Pixel>) {
    const pixel = this.pixels.find((pixel) => pixel.id === id);
    if (pixel) {
      const index = this.pixels.indexOf(pixel);
      this.pixels[index] = {
        ...pixel,
        ...changes,
      };
      this.pixels = [...this.pixels];
    }
  }

  private get isMouseLocked(): boolean {
    return this._isMouseLocked.getValue();
  }

  private set isMouseLocked(isMouseLocked: boolean) {
    this._isMouseLocked.next(isMouseLocked);
  }

  private get pixels(): Pixel[] {
    return this._pixels.getValue();
  }

  private set pixels(pixels: Pixel[]) {
    this._pixels.next(pixels);
  }
}
