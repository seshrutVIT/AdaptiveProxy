/** Builds an SVG path through the values, leaving a gap wherever a value is missing. */
export function buildLinePath(
  values: (number | null)[],
  toX: (index: number) => number,
  toY: (value: number) => number
): string {
  let path = "";
  let isPenDown = false;

  values.forEach((value, index) => {
    if (value === null) {
      isPenDown = false;
      return;
    }
    path += `${isPenDown ? "L" : "M"}${toX(index)} ${toY(value)} `;
    isPenDown = true;
  });

  return path.trim();
}
