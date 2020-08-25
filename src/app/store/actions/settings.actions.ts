import { createAction, props } from '@ngrx/store';
import { Settings } from '../../models';

export const updateSettings = createAction('[Settings] update settings', props<{ changes: Partial<Settings> }>());
