import Svg, { Ellipse, Path } from 'react-native-svg';

export const SILHOUETTE_WIDTH = 220;
export const SILHOUETTE_HEIGHT = 300;

const DOT_STYLE = {
  stroke: 'rgba(255, 255, 255, 0.85)',
  strokeWidth: 2,
  strokeDasharray: '4 7',
  strokeLinecap: 'round' as const,
  fill: 'none',
};

export function HeadSilhouette() {
  return (
    <Svg width={SILHOUETTE_WIDTH} height={SILHOUETTE_HEIGHT} viewBox="0 0 220 300">
      <Ellipse cx={110} cy={95} rx={72} ry={82} {...DOT_STYLE} />
      <Path
        d="M52 168 Q52 210 110 218 Q168 210 168 168"
        {...DOT_STYLE}
      />
      <Path
        d="M38 218 Q38 248 110 255 Q182 248 182 218"
        {...DOT_STYLE}
      />
    </Svg>
  );
}
