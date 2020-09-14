import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Settings } from '../models';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  settings$: BehaviorSubject<Settings> = new BehaviorSubject<Settings>({
    algorithmId: 'astar',
    mazeId: 'nomaze',
    operationsPerSecond: 250,
  });

  updateSettings(settings: Settings) {
    this.settings$.next(settings);
  }
}
