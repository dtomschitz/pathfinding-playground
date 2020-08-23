import { Component, ViewChild } from '@angular/core';
import { BoardComponent } from './components';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  @ViewChild(BoardComponent) board: BoardComponent;

  onVisualize() {
    console.log('dada');

    this.board.visualizePath();
  }
}
