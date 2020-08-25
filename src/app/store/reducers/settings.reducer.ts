import { createReducer, on } from '@ngrx/store';
import { SettingsActions } from '../actions';
import { Settings } from '../../models';

export const featureKey = 'settings';

export type State = Settings;

const initialState: State = {
  algorithmId: 'astar',
  speed: 50,
};

export const reducer = createReducer(
  initialState,
  on(SettingsActions.updateSettings, (state, { changes }) => ({ ...state, ...changes }))
);

export const selectSettings = (state: State) => state;
