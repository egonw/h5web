import { createMemo } from '@h5web/shared';

import {
  getDataTexture,
  getInterpolator,
  getMask,
  getPixelEdgeValues,
  getSafeDomain,
  getVisDomain,
  toTextureSafeNdArray,
} from './utils';

export const useVisDomain = createMemo(getVisDomain);
export const useSafeDomain = createMemo(getSafeDomain);
export const usePixelEdgeValues = createMemo(getPixelEdgeValues);
export const useTextureSafeNdArray = createMemo(toTextureSafeNdArray);
export const useDataTexture = createMemo(getDataTexture);
export const useMask = createMemo(getMask);
export const useInterpolator = createMemo(getInterpolator);
