import ScalarVis from '../scalar/ScalarVis';
import { useDatasetValue } from '../hooks';
import {
  assertPrintableType,
  assertDataset,
  assertScalarShape,
} from '../../../guards';
import type { VisContainerProps } from '../../models';

function ScalarVisContainer(props: VisContainerProps) {
  const { entity } = props;
  assertDataset(entity);
  assertScalarShape(entity);
  assertPrintableType(entity);

  const value = useDatasetValue(entity);
  return <ScalarVis value={value} />;
}

export default ScalarVisContainer;
