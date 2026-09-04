export function createBrushCursor(size: number) {
  const radius = size / 2;

  const svg = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${size}"
      height="${size}"
      viewBox="0 0 ${size} ${size}"
    >
      <circle
        cx="${radius}"
        cy="${radius}"
        r="${radius - 2}"
        fill="none"
        stroke="white"
        stroke-width="1"
      />
    </svg>
  `;

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${radius} ${radius}, crosshair`;
}
