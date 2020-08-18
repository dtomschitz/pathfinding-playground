import { Injectable } from '@angular/core';
import { Settings, Mazes } from '../models';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private currentSettings: Settings;

  constructor() {
    this.currentSettings = {
      algorithm: 'astar',
      speed: 50,
      maze: undefined,
    };
  }

  updateSettings(changes: Partial<Settings>) {
    this.currentSettings = { ...this.currentSettings, ...changes };
  }

  setMazeType(maze: Mazes) {
    this.currentSettings.maze = maze;
  }

  get settings() {
    return this.currentSettings;
  }
}
