import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { PaintingService, SettingsService } from '../../services';
import { Algorithm, PaintingMode } from '../../models';

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

  @Output() visualizePath: EventEmitter<void> = new EventEmitter<void>();

  settingsForm: FormGroup;
  algorithms: Algorithm[];

  isHidden = true;

  constructor(
    private formBuilder: FormBuilder,
    private settingsSerice: SettingsService,
    private paintingService: PaintingService
  ) {
    this.settingsForm = this.formBuilder.group({
      algorithm: [this.settingsSerice.settings.algorithm],
      speed: [this.settingsSerice.settings.speed],
    });
    this.algorithms = this.settingsSerice.algorithms;
  }

  ngOnInit() {
    this.paintingService.isMouseLocked$.pipe(takeUntil(this.destroy$)).subscribe((isMouseLocked) => {
      if (isMouseLocked) {
        this.isHidden = true;
      }
    });

    this.settingsForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((changes) => {
      this.settingsSerice.updateSettings(changes);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  showChard() {
    this.isHidden = false;
  }

  visualize() {
    this.isHidden = true;
    this.visualizePath.emit();
  }

  switchPaintingMode(mode: keyof typeof PaintingMode) {
    this.paintingService.updateMode(PaintingMode[mode]);
  }

  formatSpeedLabel(value: number) {
    return value + '%';
  }
}
