import {
  Component,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Settings } from '../../models';
import { GridComponent } from '../grid';
import { SettingsActions } from '../../store/actions';
import * as fromRoot from '../../store/reducers';

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent implements AfterViewInit {
  @ViewChild(GridComponent) gridComponent: GridComponent;

  settings$: Observable<Settings>;

  width: number;
  height: number;

  constructor(
    private host: ElementRef,
    private changeDetector: ChangeDetectorRef,
    private store: Store<fromRoot.State>
  ) {
    this.settings$ = this.store.pipe(select(fromRoot.selectSettings));
  }

  ngAfterViewInit() {
    this.width = Math.floor(this.host.nativeElement.clientWidth / 30) - 5;
    this.height = Math.floor((this.host.nativeElement.clientHeight - 64) / 30) - 3;
    this.changeDetector.detectChanges();
  }

  onSettingsChanged(changes: Partial<Settings>) {
    this.store.dispatch(SettingsActions.updateSettings({ changes }));
  }

  visualizePath() {
    console.log('Dada');
  }

  onGenerateMaze() {
    // this.gridComponent.createMaze(getMaze(this.settingsService.settings.maze));
    // this.settingsService.settings.maze = undefined;
  }
}
