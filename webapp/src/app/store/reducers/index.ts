import { InjectionToken } from '@angular/core';
import { ActionReducerMap, Action, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromLayout from './layout.reducer';

export interface State {
  [fromLayout.featureKey]: fromLayout.State;
}

export const ROOT_REDUCERS = new InjectionToken<ActionReducerMap<State, Action>>('RootReducers', {
  factory: () => ({
    [fromLayout.featureKey]: fromLayout.reducer,
  }),
});

const selectLayoutState = createFeatureSelector<State, fromLayout.State>(fromLayout.featureKey);

export const selectShowSidenav = createSelector(selectLayoutState, fromLayout.selectShowSidenav);
