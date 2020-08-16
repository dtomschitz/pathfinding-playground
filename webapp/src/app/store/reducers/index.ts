import { InjectionToken } from '@angular/core';
import { ActionReducerMap, Action, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromLayout from './layout.reducer';
import * as fromBoard from './board.reducer';
import { Grid } from 'src/app/models';

export interface State {
  [fromLayout.featureKey]: fromLayout.State;
  [fromBoard.featureKey]: fromBoard.State;
}

export const ROOT_REDUCERS = new InjectionToken<ActionReducerMap<State, Action>>('RootReducers', {
  factory: () => ({
    [fromLayout.featureKey]: fromLayout.reducer,
    [fromBoard.featureKey]: fromBoard.reducer,
  }),
});

const selectLayoutState = createFeatureSelector<State, fromLayout.State>(fromLayout.featureKey);

export const selectShowSidenav = createSelector(selectLayoutState, fromLayout.selectShowSidenav);

const selectBoardState = createFeatureSelector<State, fromBoard.State>(fromBoard.featureKey);

export const selectNodeIds = createSelector(selectBoardState, fromBoard.selectNodeIds);
export const selectNodeEntities = createSelector(selectBoardState, fromBoard.selectNodeEntities);
export const selectAllNodes = createSelector(selectBoardState, fromBoard.selectAllNodes);

export const selectGridHeight = createSelector(selectBoardState, fromBoard.selectGridHeight);
export const selectGridWidth = createSelector(selectBoardState, fromBoard.selectGridWidth);

export const selectGrid = createSelector(selectAllNodes, selectGridHeight, (nodes, height) => {
  const grid: Grid = [];

  for (let i = 0; i < height; i++) {
    const rows = nodes.filter((node) => node.row === i);
    grid.push(rows);
  }

  return grid;
});
