import { Node } from '../models';

export class Utils {
  static backtrace(node: Node) {
    const path = [[node.x, node.y]];
    while (node.parent) {
      node = node.parent;
      path.push([node.x, node.y]);
    }
    return path.reverse();
  }
}
