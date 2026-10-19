function Background() {
  const LINES_COUNT = 10;

  const lines = Array.from({ length: LINES_COUNT }, (_, i) => {
    const t = (i / (LINES_COUNT - 1)) * 2 - 1;

    const startY = 700 + t * 260 + Math.sin(i * 1.5) * 20;

    const midX = 500 + Math.cos(i * 0.8) * 35;
    const midY = 500 + t * 45 + Math.sin(i * 2.1) * 15;

    const endY = 100 + t * 280 + Math.cos(i * 1.2) * 25;

    const cp1x = 2500 + Math.sin(i) * 45;
    const cp1y = midX - 200 + t * 30;

    const cp2x = midX - 2000;
    const cp2y = midY + 200;

    return `M -50 ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${1000} ${endY} `;
  });

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80"
      viewBox="0 0 1000 800"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="asym-fade" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="white" stopOpacity="0.05" />
          <stop offset="25%" stopColor="white" stopOpacity="0.75" />
          <stop offset="60%" stopColor="white" stopOpacity="0.95" />
          <stop offset="85%" stopColor="white" stopOpacity="0.65" />
          <stop offset="100%" stopColor="white" stopOpacity="0.05" />
        </linearGradient>

        <mask id="asym-mask">
          <rect width="1000" height="800" fill="url(#asym-fade)" />
        </mask>
      </defs>

      <g mask="url(#asym-mask)" className="fill-none">
        {lines.map((d, i) => {
          const isMain = i % 4 === 0;
          const opacity = isMain ? "stroke-accent/65" : "stroke-accent/25";
          const width = isMain ? "1.4" : "0.75";

          return <path key={i} d={d} className={opacity} strokeWidth={width} />;
        })}
      </g>
    </svg>
  );
}

export default Background;
