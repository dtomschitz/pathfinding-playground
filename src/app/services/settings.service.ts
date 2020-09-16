import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Settings } from '../models';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly _settings = new BehaviorSubject<Settings>({
    algorithmId: 'astar',
    mazeId: 'nomaze',
    delay: 1000,
    operationsPerSecond: 250,
  });

  readonly settings$ = this._settings.asObservable();

  private get settings(): Settings {
    return this._settings.getValue();
  }

  private set settings(settings: Settings) {
    this._settings.next(settings);
  }

  updateSettings(changes: Partial<Settings>) {
    this.settings = { ...this.settings, ...changes };
  }
}
