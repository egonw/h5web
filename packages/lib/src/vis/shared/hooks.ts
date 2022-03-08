import { useThree } from '@react-three/fiber';
import { clamp } from 'lodash';
import { useCallback, useEffect } from 'react';
import { Vector3 } from 'three';

import { useWheelCapture } from '../hooks';
import type { CanvasEvent, CanvasEventCallbacks } from '../models';
import { getCameraFOV, projectCameraToHtml } from '../utils';
import { useAxisSystemContext } from './AxisSystemContext';

const ZOOM_FACTOR = 0.95;

const ONE_VECTOR = new Vector3(1, 1, 1);

export function useMoveCameraTo() {
  const { visSize } = useAxisSystemContext();
  const { width: visWidth, height: visHeight } = visSize;

  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);

  return useCallback(
    (x: number, y: number) => {
      const { position } = camera;

      const { topRight } = getCameraFOV(camera);
      const cameraLocalBounds = topRight.sub(position);

      const xBound = Math.max(visWidth / 2 - cameraLocalBounds.x, 0);
      const yBound = Math.max(visHeight / 2 - cameraLocalBounds.y, 0);

      position.set(
        clamp(x, -xBound, xBound),
        clamp(y, -yBound, yBound),
        position.z
      );

      camera.updateMatrixWorld();
      invalidate();
    },
    [camera, visWidth, visHeight, invalidate]
  );
}

export function useZoomOnWheel(
  isZoomAllowed: (sourceEvent: WheelEvent) => { x: boolean; y: boolean },
  disabled?: boolean
) {
  const camera = useThree((state) => state.camera);
  const moveCameraTo = useMoveCameraTo();

  const onWheel = useCallback(
    (evt: CanvasEvent<WheelEvent>) => {
      const { sourceEvent, unprojectedPoint } = evt;

      if (disabled) {
        return;
      }

      // sourceEvent.deltaY < 0 => Wheel down => decrease scale to reduce FOV
      const factor = sourceEvent.deltaY < 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR;
      const { x: zoomX, y: zoomY } = isZoomAllowed(sourceEvent);
      const zoomVector = new Vector3(zoomX ? factor : 1, zoomY ? factor : 1, 1);
      camera.scale.multiply(zoomVector).min(ONE_VECTOR);

      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();

      const oldPosition = unprojectedPoint.clone();
      // Scale the change in position according to the zoom
      const delta = camera.position
        .clone()
        .sub(oldPosition)
        .multiply(zoomVector);
      const scaledPosition = oldPosition.add(delta);
      moveCameraTo(scaledPosition.x, scaledPosition.y);
    },
    [camera, disabled, isZoomAllowed, moveCameraTo]
  );

  useWheelCapture();

  return onWheel;
}

export function useCanvasEvents(callbacks: CanvasEventCallbacks) {
  const { onPointerDown, onPointerMove, onPointerUp, onWheel } = callbacks;
  const { domElement } = useThree((state) => state.gl);
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);

  const getUnprojectedPoint = useCallback(
    (evt: PointerEvent | WheelEvent) => {
      const { offsetX: x, offsetY: y } = evt;
      const { width, height } = size;
      const normX = (x - width / 2) / (width / 2);
      const normY = -(y - height / 2) / (height / 2);

      return new Vector3(normX, normY, 0).unproject(camera);
    },
    [camera, size]
  );

  const handlePointerDown = useCallback(
    (sourceEvent: PointerEvent) => {
      if (onPointerDown) {
        onPointerDown({
          sourceEvent,
          unprojectedPoint: getUnprojectedPoint(sourceEvent),
        });
      }
    },
    [getUnprojectedPoint, onPointerDown]
  );

  const handlePointerMove = useCallback(
    (sourceEvent: PointerEvent) => {
      if (onPointerMove) {
        onPointerMove({
          sourceEvent,
          unprojectedPoint: getUnprojectedPoint(sourceEvent),
        });
      }
    },
    [getUnprojectedPoint, onPointerMove]
  );

  const handlePointerUp = useCallback(
    (sourceEvent: PointerEvent) => {
      if (onPointerUp) {
        onPointerUp({
          sourceEvent,
          unprojectedPoint: getUnprojectedPoint(sourceEvent),
        });
      }
    },
    [getUnprojectedPoint, onPointerUp]
  );

  const handleWheel = useCallback(
    (sourceEvent: WheelEvent) => {
      if (onWheel) {
        onWheel({
          sourceEvent,
          unprojectedPoint: getUnprojectedPoint(sourceEvent),
        });
      }
    },
    [getUnprojectedPoint, onWheel]
  );

  useEffect(() => {
    domElement.addEventListener('pointerdown', handlePointerDown);
    domElement.addEventListener('pointermove', handlePointerMove);
    domElement.addEventListener('pointerup', handlePointerUp);
    domElement.addEventListener('wheel', handleWheel);

    return () => {
      domElement.removeEventListener('pointerdown', handlePointerDown);
      domElement.removeEventListener('pointermove', handlePointerMove);
      domElement.removeEventListener('pointerup', handlePointerUp);
      domElement.removeEventListener('wheel', handleWheel);
    };
  });
}

export function useWorldToHtml(): (point: Vector3) => Vector3 {
  const camera = useThree((state) => state.camera);
  const { width, height } = useThree((state) => state.size);

  return useCallback(
    (point: Vector3) => {
      const cameraPoint = point.clone().project(camera);
      return projectCameraToHtml(cameraPoint, width, height);
    },
    [camera, height, width]
  );
}
