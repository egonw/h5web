import {
  assertDataset,
  assertArrayShape,
  assertMinDims,
  assertNumericType,
} from '@h5web/shared';

import DimensionMapper from '../../../dimension-mapper/DimensionMapper';
import { useDimMappingState } from '../../../dimension-mapper/hooks';
import VisBoundary from '../../VisBoundary';
import type { VisContainerProps } from '../../models';
import ValueFetcher from '../ValueFetcher';
import { getSliceSelection } from '../utils';
import MappedSurfaceVis from './MappedSurfaceVis';
import { useSurfaceConfig } from './config';

function SurfaceVisContainer(props: VisContainerProps) {
  const { entity, toolbarContainer } = props;
  assertDataset(entity);
  assertArrayShape(entity);
  assertMinDims(entity, 2);
  assertNumericType(entity);

  const { shape: dims } = entity;
  const [dimMapping, setDimMapping] = useDimMappingState(dims, 2);

  const config = useSurfaceConfig();

  return (
    <>
      <DimensionMapper
        rawDims={dims}
        mapperState={dimMapping}
        onChange={setDimMapping}
      />
      <VisBoundary resetKey={dimMapping} loadingMessage="Loading current slice">
        <ValueFetcher
          dataset={entity}
          selection={getSliceSelection(dimMapping)}
          render={(value) => (
            <MappedSurfaceVis
              dataset={entity}
              value={value}
              dimMapping={dimMapping}
              toolbarContainer={toolbarContainer}
              config={config}
            />
          )}
        />
      </VisBoundary>
    </>
  );
}

export default SurfaceVisContainer;
