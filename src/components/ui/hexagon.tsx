import { sectionNames } from '@/types/types';

type HexagonType = {
  radii: number[];
  fill?: string;
  stroke?: string;
};

type HexagonProps = {
  hexagons: HexagonType[];
  withLabel?: boolean;
} & React.SVGProps<SVGSVGElement>;

const Hexagon = ({ hexagons, withLabel = true, ...props }: HexagonProps) => {
  const center = 120;

  const [smallPath, mediumPath, largePath] = [30, 60, 90].map(radius => {
    const radii = Array(6).fill(radius);
    return calculateHexagonPath(radii, center);
  });

  const lines = calculateHexagonLines(90, center);
  const points = calculateHexagonPoints(110, center);

  const hexagonPaths = hexagons.map(({ radii, fill, stroke }) => {
    if (radii.length !== 6) {
      console.warn('Hexagon component requires exactly 6 radii values');
      radii = [...radii, ...Array(6).fill(0)].slice(0, 6);
    }

    const pathData = calculateHexagonPath(radii, center);
    return { pathData, fill: fill || '#FF880066', stroke: stroke || '#FFB764' };
  });

  return (
    <svg width="300" height="300" viewBox="0 0 240 240" {...props}>
      {lines.map((props, idx) => (
        <line key={`line-${idx}`} stroke="#FAFAFA4D" strokeWidth="0.5" strokeDasharray="1,1" {...props} />
      ))}

      {withLabel &&
        points.map((props, idx) => (
          <text
            key={`hex-${idx}`}
            dominantBaseline="middle"
            textAnchor="middle"
            fill="#FAFAFA"
            fontSize="12"
            {...props}
          >
            {sectionNames[idx] || `항목${idx + 1}`}
          </text>
        ))}

      <polygon points={smallPath} fill="none" stroke="#FAFAFA4D" strokeWidth="1" />
      <polygon points={mediumPath} fill="none" stroke="#FAFAFA4D" strokeWidth="1" />
      <polygon points={largePath} fill="none" stroke="#FAFAFA" strokeWidth="1" />

      {hexagonPaths.map(({ pathData, fill, stroke }, idx) => (
        <polygon key={`hex-${idx}`} points={pathData} fill={fill} stroke={stroke} strokeWidth="1" />
      ))}
    </svg>
  );
};

export default Hexagon;

const calculateHexagonPath = (radii: number[], center: number) => {
  if (radii.length !== 6) {
    console.warn('Hexagon component requires exactly 6 radii values');
    radii = [...radii, ...Array(6).fill(0)].slice(0, 6);
  }

  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60 - 90) * (Math.PI / 180);
    const currentRadius = radii[i];
    const x = center + currentRadius * Math.cos(angle);
    const y = center + currentRadius * Math.sin(angle);
    points.push(`${x},${y}`);
  }

  return points.join(' ');
};

const calculateHexagonLines = (radius: number, center: number) => {
  const points = [];
  for (let i = 0; i < 3; i++) {
    const angle1 = (i * 60 - 90) * (Math.PI / 180);
    const x1 = center + radius * Math.cos(angle1);
    const y1 = center + radius * Math.sin(angle1);

    const angle2 = (i * 60 - 90 + 180) * (Math.PI / 180);
    const x2 = center + radius * Math.cos(angle2);
    const y2 = center + radius * Math.sin(angle2);
    points.push({ x1, y1, x2, y2 });
  }

  return points;
};

const calculateHexagonPoints = (radius: number, center: number) => {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60 - 90) * (Math.PI / 180);
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    points.push({ x, y });
  }

  return points;
};
