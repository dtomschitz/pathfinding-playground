import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GridPaintingService, SettingsService } from '../../services';
import { Algorithm, PaintingMode, Settings, Maze } from '../../models';
import { algorithms } from '../../pathfinding/algorithms';
import { mazes } from '../../pathfinding/mazes';

@Component({
  selector: 'settings-card',
  templateUrl: './settings-card.component.html',
  styleUrls: ['./settings-card.component.scss'],
  animations: [
    trigger('openCloseCard', [
      transition(':enter', [
        style({
          right: '-400%',
        }),
        animate(
          '.25s ease-in-out',
          style({
            right: 0,
          })
        ),
      ]),
      transition(':leave', [
        animate(
          '.25s ease-in-out',
          style({
            right: '-400%',
          })
        ),
      ]),
    ]),
    trigger('showHideButton', [
      transition(':enter', [
        style({
          opacity: 0,
        }),
        animate(
          '.1s ease-in-out',
          style({
            opacity: 1,
          })
        ),
      ]),
      transition(':leave', [
        animate(
          '.1s ease-in-out',
          style({
            opacity: 0,
          })
        ),
      ]),
    ]),
  ],
})
export class SettingsCardComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();

  @Output() generateMaze: EventEmitter<string> = new EventEmitter<string>();

  settings$: Observable<Settings>;

  settingsForm: FormGroup;
  algorithms: Algorithm[] = algorithms;
  mazes: Maze[] = mazes;

  isHidden = true;

  constructor(
    private formBuilder: FormBuilder,
    private settingsService: SettingsService,
    private paintingService: GridPaintingService
  ) {
    this.settings$ = this.settingsService.settings$;

    this.settingsForm = this.formBuilder.group({
      algorithmId: [],
      mazeId: [],
      operationsPerSecond: [],
    });
  }

  ngOnInit() {
    this.settings$.pipe(takeUntil(this.destroy$)).subscribe((settings) => {
      this.settingsForm.setValue(settings);
    });

    this.paintingService.isMouseLocked$.pipe(takeUntil(this.destroy$)).subscribe((isMouseLocked) => {
      if (isMouseLocked) {
        this.isHidden = true;
      }
    });

    this.settingsForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((changes) => this.settingsService.updateSettings(changes));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onGenrateMaze(mazeId: string) {
    this.generateMaze.emit(mazeId);
  }

  showChard() {
    this.isHidden = false;
  }

  formatSpeedLabel(value: number) {
    return value + '%';
  }
}
