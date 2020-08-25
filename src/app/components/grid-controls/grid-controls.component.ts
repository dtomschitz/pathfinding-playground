import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'grid-controls',
  templateUrl: './grid-controls.component.html',
  styleUrls: ['./grid-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridControlsComponent implements OnInit {
  @Output() resetPath: EventEmitter<void> = new EventEmitter<void>();
  @Output() resetWalls: EventEmitter<void> = new EventEmitter<void>();
  @Output() resetAll: EventEmitter<void> = new EventEmitter<void>();
  @Output() visualizePath: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}
}
