import { Injectable } from '@angular/core';
import { Settings, Mazes, Algorithm, Algorithms } from '../models';
import { BehaviorSubject } from 'rxjs';
import { getAlgorithm } from '../pathfinding';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  algorithm$: BehaviorSubject<Algorithm>;

  constructor() {
  }

  setAlgorithm(id: string) {
    this.algorithm$.next(getAlgorithm(id));
  }
}
