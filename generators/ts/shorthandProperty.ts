/**
 * Utility for generating TypeScript shorthand properties.
 *
 * If name === value, return name. Else return `${name}: ${value}`.
 */
export function shorthandProperty(name: string, value: string) {
  if (name === value) {
    return name;
  }
  return `${name}: ${value}`;
}
