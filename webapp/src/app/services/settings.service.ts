import { Injectable } from '@angular/core';
import { Settings, Algorithm, Algorithms } from '../models';
import { Mazes } from '../models/maze';

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
