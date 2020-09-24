export interface Pixel {
  id: string;
  x: number;
  y: number;
  fillStyle?: string;
  icon?: PixelIcon;
}

export interface PixelIcon {
  svg: string;
  fillStyle: string;
  scale: number;
}

export interface PixelCoordinates {
  x: number;
  y: number;
}
