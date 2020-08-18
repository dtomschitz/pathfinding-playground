import { Algorithms } from './algorithm';
import { Mazes } from './maze';

export interface Settings {
  algorithm: Algorithms;
  maze: Mazes;
  speed: number;
}
