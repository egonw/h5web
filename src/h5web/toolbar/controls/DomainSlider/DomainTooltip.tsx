import { forwardRef, useImperativeHandle, useRef } from 'react';
import type { Domain } from '../../../../packages/lib';
import { formatValue } from '../../../utils';
import { DomainError, DomainErrors } from '../../../vis-packs/core/models';
import ToggleBtn from '../ToggleBtn';
import BoundEditor, { BoundEditorHandle } from './BoundEditor';
import styles from './DomainTooltip.module.css';
import ErrorMessage from './ErrorMessage';

interface Props {
  id: string;
  open: boolean;
  sliderDomain: Domain;
  dataDomain: Domain;
  errors: DomainErrors;
  isAutoMin: boolean;
  isAutoMax: boolean;
  onAutoMinToggle: () => void;
  onAutoMaxToggle: () => void;
  isEditingMin: boolean;
  isEditingMax: boolean;
  onEditMin: (force: boolean) => void;
  onEditMax: (force: boolean) => void;
  onChangeMin: (val: number) => void;
  onChangeMax: (val: number) => void;
  onSwap: () => void;
}

interface Handle {
  cancelEditing: () => void;
}

const DomainTooltip = forwardRef<Handle, Props>((props, ref) => {
  const { id, open, sliderDomain, dataDomain, errors } = props;
  const { isAutoMin, isAutoMax, isEditingMin, isEditingMax } = props;
  const {
    onAutoMinToggle,
    onAutoMaxToggle,
    onEditMin,
    onEditMax,
    onChangeMin,
    onChangeMax,
    onSwap,
  } = props;

  const { minGreater, minError, maxError } = errors;
  const minEditorRef = useRef<BoundEditorHandle>(null);
  const maxEditorRef = useRef<BoundEditorHandle>(null);

  /* Expose `cancelEditing` function to parent component through ref handle so that
     editing can be cancelled when the user closes the domain tooltip. */
  useImperativeHandle(ref, () => ({
    cancelEditing: () => {
      minEditorRef.current?.cancel();
      maxEditorRef.current?.cancel();
    },
  }));

  return (
    <div
      id={id}
      className={styles.tooltip}
      role="dialog"
      aria-label="Edit domain"
      hidden={!open}
    >
      <div className={styles.tooltipInner}>
        {minGreater && (
          <ErrorMessage
            error={DomainError.MinGreater}
            showSwapBtn={!isAutoMin && !isAutoMax}
            onSwap={onSwap}
          />
        )}

        <BoundEditor
          ref={minEditorRef}
          bound="min"
          value={sliderDomain[0]}
          isEditing={isEditingMin}
          hasError={minGreater || !!minError}
          onEditToggle={onEditMin}
          onChange={onChangeMin}
        />
        {minError && <ErrorMessage error={minError} />}

        <BoundEditor
          ref={maxEditorRef}
          bound="max"
          value={sliderDomain[1]}
          isEditing={isEditingMax}
          hasError={minGreater || !!maxError}
          onEditToggle={onEditMax}
          onChange={onChangeMax}
        />
        {maxError && <ErrorMessage error={maxError} />}

        <p className={styles.dataRange}>
          Data range{' '}
          <span>
            [{' '}
            <abbr title={dataDomain[0].toString()}>
              {formatValue(dataDomain[0])}
            </abbr>{' '}
            ,{' '}
            <abbr title={dataDomain[1].toString()}>
              {formatValue(dataDomain[1])}
            </abbr>{' '}
            ]
          </span>
        </p>

        <p className={styles.autoscale}>
          Autoscale{' '}
          <ToggleBtn
            label="Min"
            raised
            value={isAutoMin}
            onChange={onAutoMinToggle}
          />
          <ToggleBtn
            label="Max"
            raised
            value={isAutoMax}
            onChange={onAutoMaxToggle}
          />
        </p>
      </div>
    </div>
  );
});

export type { Handle as DomainTooltipHandle };
export default DomainTooltip;
