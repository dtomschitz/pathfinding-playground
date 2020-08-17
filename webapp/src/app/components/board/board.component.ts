import { Component, ElementRef, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { SettingsService } from '../../services';
import { getMaze } from '../../mazes';
import { GridComponent } from '../grid';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements AfterViewInit {
  @ViewChild(GridComponent) gridComponent: GridComponent;

  rows: number;
  columns: number;

  constructor(
    private host: ElementRef,
    private changeDetector: ChangeDetectorRef,
    private settingsService: SettingsService
  ) {}

  ngAfterViewInit() {
    this.rows = Math.floor((this.host.nativeElement.clientHeight - 64) / 30);
    this.columns = Math.floor(this.host.nativeElement.clientWidth / 30);
    this.changeDetector.detectChanges();
  }

  onVisualizePath() {
    this.gridComponent.visualize(this.settingsService.settings);
  }

  onGenerateMaze() {
    this.gridComponent.createMaze(getMaze(this.settingsService.settings.maze));
    this.settingsService.settings.maze = undefined;
  }
}
