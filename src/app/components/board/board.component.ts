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
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
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
  visualizing: boolean;

  constructor(private host: ElementRef, private changeDetector: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.width = this.host.nativeElement.clientWidth;
    this.height = this.host.nativeElement.clientHeight;
    this.changeDetector.detectChanges();
  }

  onSettingsChanged(changes: Partial<Settings>) {
    this.settings = { ...this.settings, ...changes };
  }

  onGenerateMaze(mazeId: string) {
    this.gridComponent.generateMaze(mazeId);
  }

  async visualizePath() {
    this.visualizing = true;
    await this.gridComponent.visualizePath(this.settings.algorithmId);
    this.visualizing = false;
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
