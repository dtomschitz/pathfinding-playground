import { NodeType } from './node-type';

export interface Node {
  id: string;
  row: number;
  column: number;
  type: NodeType;
}
