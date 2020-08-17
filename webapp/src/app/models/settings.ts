import { Algorithms, Algorithm } from './algorithm';
import { Maze, Mazes } from './maze';

export interface Settings {
  algorithm: Algorithms;
  maze: Mazes;
  speed: number;
}
