const defaultCmp = (x: any, y: any) => {
  if (x < y) {
    return -1;
  }
  if (x > y) {
    return 1;
  }
  return 0;
};

export class Heap<T> {
  nodes: T[] = [];
  constructor(private cmp?: (x: T, y: T) => number) {
    this.cmp = cmp ?? defaultCmp;
  }

  push(item: T) {
    this.nodes.push(item);
    return this.shiftDown(0, this.nodes.length - 1);
  }

  pop() {
    const lastNode = this.nodes.pop();

    if (!this.nodes.length) {
      return lastNode;
    }

    const node = this.nodes[0];
    this.nodes[0] = lastNode;
    this.shiftUp(0);

    return node;
  }

  pushpop(item: T) {
    let ref: T[];
    if (this.nodes.length && this.cmp(this.nodes[0], item) < 0) {
      (ref = [this.nodes[0], item]), (item = ref[0]), (this.nodes[0] = ref[1]);
      this.shiftUp(0);
    }
    return item;
  }

  updateItem(item: T) {
    const pos = this.nodes.indexOf(item);
    if (pos === -1) {
      return;
    }
    this.shiftDown(0, pos);
    return this.shiftUp(pos);
  }

  replace(item: T) {
    const node = this.nodes[0];
    this.nodes[0] = item;
    this.shiftUp(0);

    return node;
  }

  peek() {
    return this.nodes[0];
  }

  top() {
    return this.peek();
  }

  front() {
    return this.peek();
  }

  empty() {
    return this.nodes.length === 0;
  }

  size() {
    return this.nodes.length;
  }

  clone() {
    const heap = new Heap<T>();
    heap.nodes = this.nodes.slice(0);
    return heap;
  }

  toArray() {
    return this.nodes.slice(0);
  }

  private shiftUp(pos: number) {
    const endPos = this.nodes.length;
    const startPos = pos;
    const newItem = this.nodes[pos];
    let childPos = 2 * pos + 1;
    let rightPos: number;

    while (childPos < endPos) {
      rightPos = childPos + 1;

      if (rightPos < endPos && !(this.cmp(this.nodes[childPos], this.nodes[rightPos]) < 0)) {
        childPos = rightPos;
      }

      this.nodes[pos] = this.nodes[childPos];
      pos = childPos;
      childPos = 2 * pos + 1;
    }

    this.nodes[pos] = newItem;
    return this.shiftDown(startPos, pos);
  }

  private shiftDown(startPos: number, pos: number) {
    let newItem: T;
    let parent: T;
    let parentPos: number;

    newItem = this.nodes[pos];
    while (pos > startPos) {
      parentPos = (pos - 1) >> 1;
      parent = this.nodes[parentPos];
      if (this.cmp(newItem, parent) < 0) {
        this.nodes[pos] = parent;
        pos = parentPos;
        continue;
      }
      break;
    }
    return (this.nodes[pos] = newItem);
  }
}
