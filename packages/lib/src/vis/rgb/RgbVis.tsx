import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { DataTexture, FloatType, RGBFormat, UnsignedByteType } from 'three';

import styles from '../heatmap/HeatmapVis.module.css';
import type { Layout } from '../heatmap/models';
import PanMesh from '../shared/PanMesh';
import VisCanvas from '../shared/VisCanvas';
import VisMesh from '../shared/VisMesh';
import ZoomMesh from '../shared/ZoomMesh';
import { ImageType } from './models';
import { flipLastDimension } from './utils';

interface Props {
  value: number[];
  dims: number[];
  floatFormat?: boolean;
  layout?: Layout;
  showGrid?: boolean;
  title?: string;
  imageType?: ImageType;
  children?: ReactNode;
}

function RgbVis(props: Props) {
  const {
    value,
    dims,
    floatFormat,
    layout = 'cover',
    showGrid = false,
    title,
    imageType = ImageType.RGB,
    children,
  } = props;

  const rgbValue = useMemo(
    () =>
      imageType === ImageType.BGR ? flipLastDimension(value, dims) : value,
    [value, dims, imageType]
  );

  const [rows, cols] = dims;

  const texture = useMemo(() => {
    return floatFormat
      ? new DataTexture(
          Float32Array.from(rgbValue),
          cols,
          rows,
          RGBFormat,
          FloatType
        )
      : new DataTexture(
          Uint8Array.from(rgbValue),
          cols,
          rows,
          RGBFormat,
          UnsignedByteType
        );
  }, [floatFormat, rgbValue, cols, rows]);

  return (
    <figure className={styles.root} aria-label={title} data-keep-canvas-colors>
      <VisCanvas
        title={title}
        canvasRatio={layout === 'contain' ? cols / rows : undefined}
        visRatio={layout !== 'fill' ? cols / rows : undefined}
        abscissaConfig={{
          visDomain: [0, cols],
          showGrid,
          isIndexAxis: true,
        }}
        ordinateConfig={{
          visDomain: [0, rows],
          showGrid,
          isIndexAxis: true,
          flip: true,
        }}
      >
        <PanMesh />
        <ZoomMesh />
        <VisMesh scale={[1, -1, 1]}>
          <meshBasicMaterial map={texture} />
        </VisMesh>
        {children}
      </VisCanvas>
    </figure>
  );
}

export default RgbVis;
