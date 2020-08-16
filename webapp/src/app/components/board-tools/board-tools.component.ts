import { Component, OnInit } from '@angular/core';
import { PaintingService } from 'src/app/services';
import { BehaviorSubject } from 'rxjs';
import { PaintingMode } from '../../models';

@Component({
  selector: 'board-tools',
  templateUrl: './board-tools.component.html',
  styleUrls: ['./board-tools.component.scss'],
})
export class BoardToolsComponent {
  hidden$: BehaviorSubject<boolean>;

  constructor(private mouseService: PaintingService) {
    this.hidden$ = this.mouseService.isMousePressed$;
  }

  setPaintingModeToCreate() {
    this.mouseService.mode = PaintingMode.CREATE;
  }
  setPaintingModeToErase() {
    this.mouseService.mode = PaintingMode.ERASE;
  }
}
