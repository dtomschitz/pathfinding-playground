import { createAction, props } from '@ngrx/store';
import { Settings } from '../../models';

export const updateSettings = createAction(
  '[Settings] update settings',
  props<{ id: string; changes: Partial<Settings> }>()
);
