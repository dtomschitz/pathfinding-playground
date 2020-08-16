import { createAction, props } from '@ngrx/store';
import { Dimension, Grid, Node } from '../../models';
import { Update } from '@ngrx/entity';

export const generateGrid = createAction('[Grid] generate grid', props<Dimension>());

export const updateGrid = createAction('[Grid] update grid', props<{ nodes: Node[] }>());

export const updateNode = createAction('[Grid] update node', props<{ update: Update<Node> }>());
