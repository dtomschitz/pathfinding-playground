import { createReducer, on } from '@ngrx/store';
import { Node } from '../../models';
import { BoardActions } from '../actions';

export const featureKey = 'board';

export interface State {
  height: number;
  width: number;
  grid: Node[][];
}

const initialState: State = {
  height: undefined,
  width: undefined,
  grid: undefined,
};

export const reducer = createReducer(
  initialState,
  on(BoardActions.generateGrid, (state, { height, width }) => ({ ...state, height, width })),
  on(BoardActions.updateGrid, (state, { grid }) => ({ ...state, grid }))
);

export const selectHeight = (state: State) => state.height;
export const selectWidth = (state: State) => state.width;
export const selectGrid = (state: State) => state.grid;
