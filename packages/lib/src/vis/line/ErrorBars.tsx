import type { NumArray } from '@h5web/shared';

import { useVisCanvasContext } from '../..';
import { useGeometry } from '../hooks';
import ErrorBarsGeometry from './errorBarsGeometry';
import ErrorCapsGeometry from './errorCapsGeometry';
import GlyphMaterial from './GlyphMaterial';
import { GlyphType } from './models';

interface Props {
  abscissas: NumArray;
  ordinates: NumArray;
  errors: NumArray;
  color: string;
  visible?: boolean;
  ignoreValue?: (val: number) => boolean;
}

function ErrorBars(props: Props) {
  const { abscissas, ordinates, errors, color, visible, ignoreValue } = props;
  const { abscissaScale, ordinateScale } = useVisCanvasContext();

  const geometryParams = visible && {
    abscissas,
    ordinates,
    errors,
    abscissaScale,
    ordinateScale,
    ignoreValue,
  };

  const barsGeometry = useGeometry(
    ErrorBarsGeometry,
    ordinates.length,
    geometryParams,
  );

  const capsGeometry = useGeometry(
    ErrorCapsGeometry,
    ordinates.length,
    geometryParams,
  );

  return (
    <>
      <lineSegments geometry={barsGeometry} visible={visible}>
        <lineBasicMaterial color={color} />
      </lineSegments>
      <points geometry={capsGeometry} visible={visible}>
        <GlyphMaterial glyphType={GlyphType.Cap} color={color} size={9} />
      </points>
    </>
  );
}

export type { Props as ErrorBarsProps };
export default ErrorBars;
