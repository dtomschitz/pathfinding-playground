import { createAction, props } from '@ngrx/store';
import { Dimension, Grid } from '../../models';

export const generateGrid = createAction('[Grid] generate grid', props<Dimension>());

export const updateGrid = createAction('[Grid] update grid', props<{ grid: Grid }>());
