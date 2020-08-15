import { InjectionToken } from '@angular/core';
import { ActionReducerMap, Action, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromLayout from './layout.reducer';
import * as fromGrid from './board.reducer';

export interface State {
  [fromLayout.featureKey]: fromLayout.State;
  [fromGrid.featureKey]: fromGrid.State;
}

export const ROOT_REDUCERS = new InjectionToken<ActionReducerMap<State, Action>>('RootReducers', {
  factory: () => ({
    [fromLayout.featureKey]: fromLayout.reducer,
    [fromGrid.featureKey]: fromGrid.reducer,
  }),
});

const selectLayoutState = createFeatureSelector<State, fromLayout.State>(fromLayout.featureKey);

export const selectShowSidenav = createSelector(selectLayoutState, fromLayout.selectShowSidenav);

const selectGridState = createFeatureSelector<State, fromGrid.State>(fromGrid.featureKey);

export const selectGrid = createSelector(selectGridState, fromGrid.selectGrid);
