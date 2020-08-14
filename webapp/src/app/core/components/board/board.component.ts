import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  @Input() height: number;
  @Input() width: number;

  constructor() {}

  ngOnInit(): void {}

  createGrid() {}

  onMouseDown() {}

  onMouseUp() {}

  onMouseEnter() {}

  onMouseLeave() {}
}
