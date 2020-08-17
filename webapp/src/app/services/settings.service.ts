import { Injectable } from '@angular/core';
import { Settings, Algorithm } from '../models';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  readonly algorithms: Algorithm[] = [
    {
      id: 'astar',
      name: 'A* Serach',
    },
  ];

  private currentSettings: Settings;

  constructor() {
    this.currentSettings = {
      algorithm: 'astar',
      speed: 50,
    };
  }

  updateSettings(changes: Partial<Settings>) {
    this.currentSettings = { ...this.currentSettings, ...changes };
  }

  get settings() {
    return this.currentSettings;
  }
}
