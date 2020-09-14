import {
  Component,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Settings } from './models';
import { BehaviorSubject } from 'rxjs';
import { GridComponent } from './components';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  @ViewChild(GridComponent) gridComponent: GridComponent;

  settings: Settings = {
    algorithmId: 'astar',
    mazeId: 'nomaze',
    operationsPerSecond: 250,
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
    await this.gridComponent.visualizePath(this.settings.algorithmId, this.settings.operationsPerSecond);
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
