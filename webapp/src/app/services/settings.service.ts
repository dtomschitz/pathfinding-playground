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

  updateSettings(changes: Partial<Settings>) {
    this.currentSettings = { ...this.currentSettings, ...changes };
    console.log(this.currentSettings);
  }

  get settings() {
    return this.currentSettings;
  }
}
