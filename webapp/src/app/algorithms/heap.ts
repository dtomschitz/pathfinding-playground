const defaultCmp = (x: number, y: number) => {
  if (x < y) {
    return -1;
  }

  if (x > y) {
    return 1;
  }

  return 0;
}

export class Heap {

  cmp: ()

  constructor()
}