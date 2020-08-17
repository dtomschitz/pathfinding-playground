import { Component, ElementRef, AfterViewInit, ChangeDetectorRef, ViewChildren, ViewChild } from '@angular/core';
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

  constructor(private host: ElementRef, private changeDetector: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.rows = Math.floor((this.host.nativeElement.clientHeight - 64) / 30);
    this.columns = Math.floor(this.host.nativeElement.clientWidth / 30);
    this.changeDetector.detectChanges();
  }

  onVisualizePath() {
    this.gridComponent.visualize();
  }
}
