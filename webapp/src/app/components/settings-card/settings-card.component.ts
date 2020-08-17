import { Component, OnInit, OnDestroy } from '@angular/core';
import { PaintingService, SettingsService } from '../../services';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { trigger, state, style, transition, animate, keyframes, stagger, query } from '@angular/animations';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Algorithm, Settings } from 'src/app/models';

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

  settingsForm: FormGroup;
  algorithms: Algorithm[];

  isHidden = true;

  constructor(
    private formBuilder: FormBuilder,
    private settingsSerice: SettingsService,
    private paintingService: PaintingService
  ) {
    this.settingsForm = this.formBuilder.group({
      algorithm: [this.settingsSerice.settings?.algoritm.id ?? ''],
      speed: [this.settingsSerice.settings?.speed ?? 50],
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

  formatSpeedLabel(value: number) {
    return value + '%';
  }
}
