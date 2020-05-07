import { ScaleLinear } from 'd3-scale';

export type Domain = [number, number];

export type Size = { width: number; height: number };

export type AxisOffsets = { left: number; bottom: number };

export interface AxisDomains {
  left: Domain;
  bottom: Domain;
}

export interface TwoDimScale {
  x: ScaleLinear<number, number>;
  y: ScaleLinear<number, number>;
}
