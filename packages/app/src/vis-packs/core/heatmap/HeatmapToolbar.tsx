import type { Domain } from '@h5web/lib';
import {
  ColorMapSelector,
  DomainWidget,
  ExportMenu,
  FlipYAxisToggler,
  GridToggler,
  ScaleSelector,
  Separator,
  SnapshotBtn,
  ToggleBtn,
  Toolbar,
} from '@h5web/lib';
import { COLOR_SCALE_TYPES } from '@h5web/shared';
import { MdAspectRatio } from 'react-icons/md';

import type { ExportFormat, ExportURL } from '../../../providers/models';
import { getImageInteractions } from '../utils';
import type { HeatmapConfig } from './config';

const EXPORT_FORMATS: ExportFormat[] = ['tiff', 'npy'];

interface Props {
  dataDomain: Domain;
  isSlice: boolean;
  config: HeatmapConfig;
  getExportURL: ((format: ExportFormat) => ExportURL) | undefined;
}

function HeatmapToolbar(props: Props) {
  const { isSlice, dataDomain, config, getExportURL } = props;
  const {
    customDomain,
    colorMap,
    scaleType,
    keepRatio,
    showGrid,
    invertColorMap,
    flipYAxis,
    setCustomDomain,
    setColorMap,
    setScaleType,
    toggleKeepRatio,
    toggleGrid,
    toggleColorMapInversion,
    toggleYAxisFlip,
  } = config;

  return (
    <Toolbar interactions={getImageInteractions(keepRatio)}>
      <DomainWidget
        dataDomain={dataDomain}
        customDomain={customDomain}
        scaleType={scaleType}
        onCustomDomainChange={setCustomDomain}
      />
      <Separator />

      <ColorMapSelector
        value={colorMap}
        onValueChange={setColorMap}
        invert={invertColorMap}
        onInversionChange={toggleColorMapInversion}
      />

      <Separator />

      <ScaleSelector
        value={scaleType}
        onScaleChange={setScaleType}
        options={COLOR_SCALE_TYPES}
      />

      <Separator />

      <FlipYAxisToggler value={flipYAxis} onToggle={toggleYAxisFlip} />

      <ToggleBtn
        label="Keep ratio"
        icon={MdAspectRatio}
        value={keepRatio}
        onToggle={toggleKeepRatio}
      />

      <GridToggler value={showGrid} onToggle={toggleGrid} />

      <Separator />

      {getExportURL && (
        <ExportMenu
          isSlice={isSlice}
          entries={EXPORT_FORMATS.map((format) => ({
            format,
            url: getExportURL(format),
          }))}
        />
      )}

      <SnapshotBtn />
    </Toolbar>
  );
}

export default HeatmapToolbar;
