import { format } from 'd3-format';
import type { Entity, Group } from './providers/models';

export const formatValue = format('.3~e');
export const formatPreciseValue = format('.5~e');

export function getChildEntity(
  group: Group,
  entityName: string
): Entity | undefined {
  return group.children.find((child) => child.name === entityName);
}

export function buildEntityPath(
  parentPath: string,
  entityNameOrRelativePath: string
): string {
  const prefix = parentPath === '/' ? '' : parentPath;
  return `${prefix}/${entityNameOrRelativePath}`;
}

export function handleError<T>(
  func: () => T,
  errToCatch: string,
  errToThrow: string
): T {
  try {
    return func();
  } catch (error: unknown) {
    if (error instanceof Error && error.message === errToCatch) {
      throw new Error(errToThrow);
    }

    throw error;
  }
}
