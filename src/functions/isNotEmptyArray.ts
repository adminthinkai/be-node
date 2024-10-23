export const isNotEmptyArray = (array: unknown): boolean =>
  Array.isArray(array) &&
  array.length > 0 &&
  array.filter((e) => !!e).length > 0;
