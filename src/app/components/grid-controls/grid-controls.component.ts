import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'grid-controls',
  templateUrl: './grid-controls.component.html',
  styleUrls: ['./grid-controls.component.scss'],
})
export class GridControlsComponent {
  @Input() visualizing: boolean;

  @Output() replay: EventEmitter<void> = new EventEmitter<void>();
  @Output() jumpToStep: EventEmitter<number> = new EventEmitter<number>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  @Output() resetPath: EventEmitter<void> = new EventEmitter<void>();
  @Output() resetWalls: EventEmitter<void> = new EventEmitter<void>();
  @Output() resetAll: EventEmitter<void> = new EventEmitter<void>();
  @Output() visualizePath: EventEmitter<void> = new EventEmitter<void>();
}
