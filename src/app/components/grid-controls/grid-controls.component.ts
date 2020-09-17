import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'grid-controls',
  templateUrl: './grid-controls.component.html',
  styleUrls: ['./grid-controls.component.scss'],
  animations: [
    trigger('showHide', [
      transition(':enter', [
        style({
          opacity: 0,
        }),
        animate(
          '250ms linear',
          style({
            opacity: 1,
          })
        ),
      ]),
      transition(':leave', [
        animate(
          '250ms linear',
          style({
            opacity: 0,
          })
        ),
      ]),
    ]),
  ],
})
export class GridControlsComponent {
  @Input() visualizing: boolean;

  @Output() replay: EventEmitter<void> = new EventEmitter<void>();
  @Output() jumpToStep: EventEmitter<number> = new EventEmitter<number>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  @Output() resetPath: EventEmitter<void> = new EventEmitter<void>();
  @Output() resetWalls: EventEmitter<void> = new EventEmitter<void>();
  @Output() resetEverything: EventEmitter<void> = new EventEmitter<void>();
  @Output() visualizePath: EventEmitter<void> = new EventEmitter<void>();
}
