import {
  Component,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Settings } from '../../models';
import { GridComponent } from '../grid';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent implements AfterViewInit {
  @ViewChild(GridComponent) gridComponent: GridComponent;

  settings: Settings = {
    algorithmId: 'astar',
    mazeId: 'nomaze',
    speed: 50,
  };

  width: number;
  height: number;

  constructor(private host: ElementRef, private changeDetector: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.width = this.host.nativeElement.clientWidth;
    this.height = this.host.nativeElement.clientHeight;
    this.changeDetector.detectChanges();
  }

  onSettingsChanged(changes: Partial<Settings>) {
    this.settings = { ...this.settings, ...changes };
  }

  generateMaze() {
    this.gridComponent.generateMaze();
  }

  visualizePath() {
    this.gridComponent.visualizePath();
  }

  resetPath() {
    this.gridComponent.resetPath();
  }

  resetWalls() {
    this.gridComponent.resetWalls();
  }

  reset() {
    this.gridComponent.reset();
  }
}
