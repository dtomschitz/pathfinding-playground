import { createReducer, on } from '@ngrx/store';
import { LayoutActions } from '../actions';

export const featureKey = 'layout';

export interface State {
  showSidenav: boolean;
}

const initialState: State = {
  showSidenav: true,
};

export const reducer = createReducer(
  initialState,
  on(LayoutActions.closeSidenav, () => ({ showSidenav: false })),
  on(LayoutActions.openSidenav, () => ({ showSidenav: true })),
  on(LayoutActions.toggleSidenav, (state) => ({
    showSidenav: !state.showSidenav,
  }))
);

export const selectShowSidenav = (state: State) => state.showSidenav;
