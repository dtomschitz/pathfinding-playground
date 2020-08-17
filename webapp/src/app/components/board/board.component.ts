import { Component, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements AfterViewInit {
  rows: number;
  columns: number;

  constructor(private host: ElementRef, private changeDetector: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.rows = Math.floor((this.host.nativeElement.clientHeight - 64) / 30);
    this.columns = Math.floor(this.host.nativeElement.clientWidth / 30);
    this.changeDetector.detectChanges();
  }
}
