import { Injectable } from '@angular/core';
import { Node } from '../models';

@Injectable({
  providedIn: 'root',
})
export class NodeDraggingService {
  private currentNode: Node;

  setNode(node: Node | undefined) {
    this.currentNode = node;
  }

  get node() {
    return this.currentNode;
  }
}
