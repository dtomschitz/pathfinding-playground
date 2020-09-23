import { Node, NodeType } from '../../models';
import { Grid } from '../grid';

type Orientation = 'horizontal' | 'vertical';

export function recursiveDivisionMaze({ nodes, width, height }: Grid, orientation: Orientation): Node[] {
  const innerWalls = nodes.filter(
    (node) => node.x === 0 || node.y === 0 || node.x === width - 1 || node.y === height - 1
  );
  const outerWalls: Node[] = [];
  generateInnerWalls(outerWalls, nodes, 2, height - 3, 2, width - 3, orientation);
  return [...innerWalls, ...outerWalls];
}

function generateInnerWalls(
  outerWalls: Node[],
  nodes: Node[],
  rowStart: number,
  rowEnd: number,
  colStart: number,
  colEnd: number,
  orientation: Orientation
) {
  if (rowEnd < rowStart || colEnd < colStart) {
    return;
  }

  if (orientation === 'horizontal') {
    const possibleRows = [];
    for (let i = rowStart; i <= rowEnd; i += 2) {
      possibleRows.push(i);
    }

    const possibleCols = [];
    for (let i = colStart - 1; i <= colEnd + 1; i += 2) {
      possibleCols.push(i);
    }

    const randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    const randomColIndex = Math.floor(Math.random() * possibleCols.length);
    const currentRow = possibleRows[randomRowIndex];
    const colRandom = possibleCols[randomColIndex];

    for (const node of nodes) {
      let r = parseInt(node.id.split('-')[0]);
      let c = parseInt(node.id.split('-')[1]);

      if (node.type !== NodeType.START && node.type !== NodeType.TARGET) {
        if (r === currentRow && c !== colRandom && c >= colStart - 1 && c <= colEnd + 1) {
          outerWalls.push(node);
        }
      }
    }

    if (currentRow - 2 - rowStart > colEnd - colStart) {
      generateInnerWalls(outerWalls, nodes, rowStart, currentRow - 2, colStart, colEnd, orientation);
    } else {
      generateInnerWalls(outerWalls, nodes, rowStart, currentRow - 2, colStart, colEnd, 'vertical');
    }
    if (rowEnd - (currentRow + 2) > colEnd - colStart) {
      generateInnerWalls(outerWalls, nodes, currentRow + 2, rowEnd, colStart, colEnd, orientation);
    } else {
      generateInnerWalls(outerWalls, nodes, currentRow + 2, rowEnd, colStart, colEnd, 'vertical');
    }
  } else {
    const possibleCols = [];
    for (let i = colStart; i <= colEnd; i += 2) {
      possibleCols.push(i);
    }

    const possibleRows = [];
    for (let i = rowStart - 1; i <= rowEnd + 1; i += 2) {
      possibleRows.push(i);
    }

    const randomColIndex = Math.floor(Math.random() * possibleCols.length);
    const randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    const currentCol = possibleCols[randomColIndex];
    const rowRandom = possibleRows[randomRowIndex];

    for (const node of nodes) {
      let r = parseInt(node.id.split('-')[0]);
      let c = parseInt(node.id.split('-')[1]);

      if (node.type !== NodeType.START && node.type !== NodeType.TARGET) {
        if (c === currentCol && r !== rowRandom && r >= rowStart - 1 && r <= rowEnd + 1) {
          outerWalls.push(node);
        }
      }
    }

    if (rowEnd - rowStart > currentCol - 2 - colStart) {
      generateInnerWalls(outerWalls, nodes, rowStart, rowEnd, colStart, currentCol - 2, 'horizontal');
    } else {
      generateInnerWalls(outerWalls, nodes, rowStart, rowEnd, colStart, currentCol - 2, orientation);
    }
    if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
      generateInnerWalls(outerWalls, nodes, rowStart, rowEnd, currentCol + 2, colEnd, 'horizontal');
    } else {
      generateInnerWalls(outerWalls, nodes, rowStart, rowEnd, currentCol + 2, colEnd, orientation);
    }
  }
}
