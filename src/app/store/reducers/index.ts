import { InjectionToken } from '@angular/core';
import { ActionReducerMap, Action, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromLayout from './layout.reducer';
import * as fromSettings from './settings.reducer';

export interface State {
  [fromLayout.featureKey]: fromLayout.State;
  [fromSettings.featureKey]: fromSettings.State;
}

export const ROOT_REDUCERS = new InjectionToken<ActionReducerMap<State, Action>>('RootReducers', {
  factory: () => ({
    [fromLayout.featureKey]: fromLayout.reducer,
    [fromSettings.featureKey]: fromSettings.reducer,
  }),
});

const selectLayoutState = createFeatureSelector<State, fromLayout.State>(fromLayout.featureKey);
export const selectShowSidenav = createSelector(selectLayoutState, fromLayout.selectShowSidenav);

const selectSettingsState = createFeatureSelector<State, fromSettings.State>(fromSettings.featureKey);
export const selectSettings = createSelector(selectSettingsState, fromSettings.selectSettings);
