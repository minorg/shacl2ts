import base62 from "@sindresorhus/base62";
import reservedTsIdentifiers_ from "reserved-identifiers";

const reservedTsIdentifiers = reservedTsIdentifiers_({
  includeGlobalProperties: true,
});

// Adapted from https://github.com/sindresorhus/to-valid-identifier , MIT license
export function stringToValidTsIdentifier(value: string): string {
  if (reservedTsIdentifiers.has(value)) {
    // We prefix with underscore to avoid any potential conflicts with the Base62 encoded string.
    return `$_${value}$`;
  }

  return value.replaceAll(
    /\P{ID_Continue}/gu,
    (x) => `$${base62.encodeInteger(x.codePointAt(0)!)}$`,
  );
}
