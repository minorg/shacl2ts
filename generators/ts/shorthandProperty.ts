export function shorthandProperty(name: string, value: string) {
  if (name === value) {
    return name;
  }
  return `${name}: ${value}`;
}
