export const Heuristics = {
  manhatten(dx: number, dy: number) {
    return dx + dy;
  },
  euclidean(dx: number, dy: number) {
    return Math.sqrt(dx * dx + dy * dy);
  },
  octile(dx: number, dy: number) {
    const F = Math.SQRT2 - 1;
    return dx < dy ? F * dx + dy : F * dy + dx;
  },
  chebyshev(dx: number, dy: number) {
    return Math.max(dx, dy);
  },
};
