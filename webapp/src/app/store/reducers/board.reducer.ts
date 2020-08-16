/*import { createReducer, on } from '@ngrx/store';
import { Node, Grid } from '../../models';
import { BoardActions } from '../actions';

export const featureKey = 'board';

export interface State {
  height: number;
  width: number;
  grid: Grid;
}

const initialState: State = {
  height: undefined,
  width: undefined,
  grid: undefined,
};

export const reducer = createReducer(
  initialState,
  on(BoardActions.generateGrid, (state, { height, width }) => ({ ...state, height, width })),
  on(BoardActions.updateGrid, (state, { grid }) => ({ ...state, grid })),
  on(BoardActions.updateNode, (state, { id, changes }) => {
    const flattenedGrid: Node[] = [].concat(...state.grid);
    flattenedGrid.filter((node) => node.id === id).map((node) => ({ ...node, changes }));
    return { ...state, grid: flattenedGrid };
  })
);

export const selectGridHeight = (state: State) => state.height;
export const selectGridWidth = (state: State) => state.width;
export const selectGridGrid = (state: State) => state.grid;
*/

import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, createEntityAdapter, Update } from '@ngrx/entity';
import { Node } from '../../models';
import { BoardActions } from '../actions';

export const featureKey = 'board';

export const adapter = createEntityAdapter<Node>();

export interface State extends EntityState<Node> {
  height: number;
  width: number;
}

const boardReducer = createReducer(
  adapter.getInitialState({ height: undefined, width: undefined }),
  on(BoardActions.generateGrid, (state, { height, width }) => ({ ...state, height, width })),
  on(BoardActions.updateGrid, (state, { nodes }) => adapter.setAll(nodes, state)),
  on(BoardActions.updateNode, (state, { update }) => adapter.updateOne(update, state))
);

export function reducer(state: State | undefined, action: Action) {
  return boardReducer(state, action);
}

const { selectIds, selectEntities, selectAll } = adapter.getSelectors();
export const selectNodeIds = selectIds;
export const selectNodeEntities = selectEntities;
export const selectAllNodes = selectAll;

export const selectGridHeight = (state: State) => state.height;
export const selectGridWidth = (state: State) => state.width;
