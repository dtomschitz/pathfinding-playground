import { Node } from '../models';

export class Utils {
  static backtrace(node: Node) {
    const path = [[node.row, node.col]];
    while (node.parent) {
      node = node.parent;
      path.push([node.row, node.col]);
    }
    return path.reverse();
  }
}
