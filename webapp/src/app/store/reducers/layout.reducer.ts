import { createReducer, on, Action } from '@ngrx/store';
import { LayoutActions } from '../actions';

export const featureKey = 'layout';

export interface State {
  showSidenav: boolean;
}

const initialState: State = {
  showSidenav: false,
};

const layoutReducer = createReducer(
  initialState,
  on(LayoutActions.closeSidenav, () => ({ showSidenav: false })),
  on(LayoutActions.openSidenav, () => ({ showSidenav: true })),
  on(LayoutActions.toggleSidenav, (state) => ({
    showSidenav: !state.showSidenav,
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return layoutReducer(state, action);
}

export const selectShowSidenav = (state: State) => state.showSidenav;
