/**
 * A simple djb2hash that returns a hash of a given string. See http://www.cse.yorku.ca/~oz/hash.html
 * for implementation details.
 *
 * @param {string} str - The string to be hashed
 * @returns {number} The hash of the string
 */
 export function djb2Hash(str: string): number {
  const points = Array.from(str);
  let h = 5381;
  for (let p = 0; p < points.length; p++)
    // h = (h * 31 + c) | 0;
    h = ((h << 5) - h + points[p]!.codePointAt(0)!) | 0;
  return h;
}

/** Create a code point id. */
export function createPointID(file: string, line: number, col: number, type: string): number {
  return djb2Hash(`${file}~${line}~${col}~${type}`);
}