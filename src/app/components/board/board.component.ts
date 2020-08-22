import { Component, ElementRef, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { SettingsService } from '../../services';
import { getAlgorithm } from '../../algorithms';
import { getMaze } from '../../mazes';
import { GridComponent } from '../grid';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements AfterViewInit {
  @ViewChild(GridComponent) gridComponent: GridComponent;

  width: number;
  height: number;

  constructor(
    private host: ElementRef,
    private changeDetector: ChangeDetectorRef,
    private settingsService: SettingsService
  ) {}

  ngAfterViewInit() {
    this.width = Math.floor(this.host.nativeElement.clientWidth / 30) - 5;
    this.height = Math.floor((this.host.nativeElement.clientHeight - 64) / 30) - 1;
    this.changeDetector.detectChanges();
  }

  onVisualizePath() {
    this.gridComponent.visualize(getAlgorithm(this.settingsService.settings.algorithm));
  }

  onGenerateMaze() {
    this.gridComponent.createMaze(getMaze(this.settingsService.settings.maze));
    this.settingsService.settings.maze = undefined;
  }
}
