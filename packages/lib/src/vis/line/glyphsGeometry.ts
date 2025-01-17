/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { NumArray } from '@h5web/shared';

import type { AxisScale } from '../models';
import H5WebGeometry from '../shared/h5webGeometry';
import { CAMERA_FAR, createBufferAttr } from '../utils';

interface Params {
  abscissas: NumArray;
  ordinates: NumArray;
  abscissaScale: AxisScale;
  ordinateScale: AxisScale;
  ignoreValue?: (val: number) => boolean;
}

class GlyphsGeometry extends H5WebGeometry<'position', Params> {
  public constructor(length: number) {
    super();
    this.setAttribute('position', createBufferAttr(length));
  }

  public update(index: number) {
    const { abscissas, ordinates, abscissaScale, ordinateScale, ignoreValue } =
      this.params!;

    const value = ordinates[index];
    const isIgnored = ignoreValue ? ignoreValue(value) : false;

    if (isIgnored) {
      this.attributes.position.setXYZ(index, 0, 0, CAMERA_FAR);
      return;
    }

    const x = abscissaScale(abscissas[index]);
    const y = ordinateScale(value);

    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      this.attributes.position.setXYZ(index, 0, 0, CAMERA_FAR);
      return;
    }

    this.attributes.position.setXYZ(index, x, y, 0);
  }
}

export default GlyphsGeometry;
