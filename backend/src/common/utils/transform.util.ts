import { TransformFnParams } from 'class-transformer';

export function transformBoolean({ value }: TransformFnParams): boolean | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  return value === 'true' || value === '1';
}
