import { Grid, Node, NodeType } from '../models';

interface RecursiveDivisionMazeSettings {
  startNode: Node;
  targetNode: Node;
  rowsCount: number;
  columnsCount: number;
  rowStart: number;
  rowEnd: number;
  columnStart: number;
  columnEnd: number;
  orientation: 'horizontal' | 'vertical';
  surroundingWalls: boolean;
}

export function recursiveDivisionMaze(grid: Grid, props: RecursiveDivisionMazeSettings) {
  const {
    startNode,
    targetNode,
    rowsCount,
    columnsCount,
    rowStart,
    rowEnd,
    columnStart,
    columnEnd,
    orientation,
  } = props;
  let { surroundingWalls } = props;

  if (rowEnd < rowStart || columnEnd < columnStart) {
    return;
  }

  const nodes: Node[] = ([] as Node[])
    .concat(...grid)
    .filter((node) => node.type !== NodeType.START && node.type !== NodeType.TARGET);

  if (!surroundingWalls) {
    for (const node of nodes) {
      const row = parseInt(node.id.split('-')[0]);
      const column = parseInt(node.id.split('-')[1]);

      if (row === 0 || column === 0 || row === rowsCount - 1 || column === columnsCount - 1) {
        node.type = NodeType.WALL;
      }
    }
    surroundingWalls = true;
  }

  if (orientation === 'horizontal') {
    const possibleRows: number[] = [];
    for (let i = rowStart; i <= rowEnd; i += 2) {
      possibleRows.push(i);
    }

    const possibleColumns: number[] = [];
    for (let i = columnStart - 1; i <= columnEnd + 1; i += 2) {
      possibleRows.push(i);
    }

    const randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    const randomColumnIndex = Math.floor(Math.random() * possibleColumns.length);

    const randomRow = possibleRows[randomRowIndex];
    const randomColumn = possibleColumns[randomColumnIndex];

    for (const node of nodes) {
      const row = node.row;
      const column = node.column;

      if (row === randomRow && column !== randomColumn && column >= columnStart - 1 && column <= columnEnd + 1) {
        node.type = NodeType.WALL;
      }
    }

    if (randomRow - 2 - rowStart > columnEnd - columnStart) {
      recursiveDivisionMaze(grid, {
        startNode,
        targetNode,
        rowsCount,
        columnsCount,
        rowStart,
        rowEnd: randomRow - 2,
        columnStart,
        columnEnd,
        orientation,
        surroundingWalls,
      });
    } else {
      recursiveDivisionMaze(grid, {
        startNode,
        targetNode,
        rowsCount,
        columnsCount,
        rowStart,
        rowEnd: randomRow - 2,
        columnStart,
        columnEnd,
        orientation: 'vertical',
        surroundingWalls,
      });
    }

    if (rowEnd - (randomRow + 2) > columnEnd - columnStart) {
      recursiveDivisionMaze(grid, {
        startNode,
        targetNode,
        rowsCount,
        columnsCount,
        rowStart: randomRow + 2,
        rowEnd,
        columnStart,
        columnEnd,
        orientation: 'vertical',
        surroundingWalls,
      });
    } else {
      recursiveDivisionMaze(grid, {
        startNode,
        targetNode,
        rowsCount,
        columnsCount,
        rowStart: randomRow + 2,
        rowEnd,
        columnStart,
        columnEnd,
        orientation: 'vertical',
        surroundingWalls,
      });
    }
  } else {
    const possibleColumns: number[] = [];
    for (let i = columnStart; i <= columnEnd; i += 2) {
      possibleColumns.push(i);
    }

    const possibleRows: number[] = [];
    for (let i = rowStart - 1; i <= rowEnd + 1; i += 2) {
      possibleRows.push(i);
    }

    const randomColumnIndex = Math.floor(Math.random() * possibleColumns.length);
    const randomRowIndex = Math.floor(Math.random() * possibleRows.length);

    const randomColumn = possibleColumns[randomColumnIndex];
    const randomRow = possibleRows[randomRowIndex];

    for (const node of nodes) {
      const row = node.row;
      const column = node.column;

      if (column === randomColumn && row !== randomRow && row >= rowStart - 1 && row <= rowEnd + 1) {
        node.type = NodeType.WALL;
      }
    }

    if (rowEnd - rowStart > randomColumn - 2 - columnStart) {
      recursiveDivisionMaze(grid, {
        startNode,
        targetNode,
        rowsCount,
        columnsCount,
        rowStart,
        rowEnd,
        columnStart,
        columnEnd: randomColumn - 2,
        orientation: 'vertical',
        surroundingWalls,
      });
    } else {
      recursiveDivisionMaze(grid, {
        startNode,
        targetNode,
        rowsCount,
        columnsCount,
        rowStart,
        rowEnd,
        columnStart,
        columnEnd: randomColumn - 2,
        orientation,
        surroundingWalls,
      });
    }

    if (rowEnd - rowStart > columnEnd - (randomColumn + 2)) {
      recursiveDivisionMaze(grid, {
        startNode,
        targetNode,
        rowsCount,
        columnsCount,
        rowStart,
        rowEnd,
        columnStart: randomColumn + 2,
        columnEnd,
        orientation: 'horizontal',
        surroundingWalls,
      });
    } else {
      recursiveDivisionMaze(grid, {
        startNode,
        targetNode,
        rowsCount,
        columnsCount,
        rowStart,
        rowEnd,
        columnStart: randomColumn + 2,
        columnEnd,
        orientation,
        surroundingWalls,
      });
    }
  }
}
