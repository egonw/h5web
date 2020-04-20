import React, { forwardRef } from 'react';
import { FixedSizeGrid as IndexedGrid } from 'react-window';
import { useMeasure } from 'react-use';
import { HDF5Value } from '../../providers/models';
import styles from './MatrixVis.module.css';
import GridSettingsProvider from './GridSettingsContext';
import StickyGrid from './StickyGrid';
import Cell from './Cell';

const CELL_SIZE = { width: 116, height: 32 };

interface Props {
  dims: number[];
  data: HDF5Value;
}

function MatrixVis(props: Props): JSX.Element {
  const { dims, data } = props;

  const [divRef, { width, height }] = useMeasure();
  const isVisible = width > 0 && height > 0;

  const rowCount = dims[0] + 1; // includes IndexRow
  const columnCount = (dims.length === 2 ? dims[1] : 1) + 1; // includes IndexColumn

  return (
    <GridSettingsProvider
      cellSize={CELL_SIZE}
      rowCount={rowCount}
      columnCount={columnCount}
      valueAccessor={
        dims.length === 1 ? row => data[row] : (row, col) => data[row][col]
      }
    >
      <div ref={divRef} className={styles.wrapper}>
        {isVisible && (
          <IndexedGrid
            className={styles.grid}
            innerElementType={forwardRef(StickyGrid)}
            columnWidth={CELL_SIZE.width}
            rowHeight={CELL_SIZE.height}
            columnCount={columnCount}
            rowCount={rowCount}
            width={width}
            height={height}
          >
            {Cell}
          </IndexedGrid>
        )}
      </div>
    </GridSettingsProvider>
  );
}

export default MatrixVis;
