import type {
  Bounds,
  Contours,
  Landmarks,
} from 'react-native-vision-camera-face-detector';

export const POKEMON_SPRITE_SIZE = 72;

export type OverlayPosition = {
  left: number;
  top: number;
};

type Point = { x: number; y: number };

function averageY(points: Point[] | undefined): number | undefined {
  if (!points?.length) return undefined;
  return points.reduce((sum, point) => sum + point.y, 0) / points.length;
}

function getFaceVerticalRange(bounds: Bounds) {
  const topY = Math.min(bounds.y, bounds.y + bounds.height);
  const bottomY = Math.max(bounds.y, bounds.y + bounds.height);
  return { topY, bottomY, height: bottomY - topY };
}

export function getPokemonOverlayPosition(
  bounds: Bounds,
  landmarks: Landmarks | undefined,
  contours: Contours | undefined,
  spriteSize = POKEMON_SPRITE_SIZE,
): OverlayPosition {
  const centerX = bounds.x + bounds.width / 2;
  const { topY, height: faceHeight } = getFaceVerticalRange(bounds);

  const leftBrowY = averageY(contours?.LEFT_EYEBROW_TOP);
  const rightBrowY = averageY(contours?.RIGHT_EYEBROW_TOP);
  if (leftBrowY !== undefined && rightBrowY !== undefined) {
    const browY = (leftBrowY + rightBrowY) / 2;
    return {
      left: centerX - spriteSize / 2,
      top: browY - spriteSize * 0.7,
    };
  }

  if (landmarks?.NOSE_BASE) {
    const noseY = landmarks.NOSE_BASE.y;
    const noseToTop = Math.abs(noseY - topY);
    const foreheadCenterY = noseY < topY ? topY + faceHeight * 0.08 : noseY - noseToTop * 0.9;

    return {
      left: centerX - spriteSize / 2,
      top: foreheadCenterY - spriteSize / 2,
    };
  }

  if (landmarks?.LEFT_EYE && landmarks?.RIGHT_EYE) {
    const eyeY = (landmarks.LEFT_EYE.y + landmarks.RIGHT_EYE.y) / 2;
    const eyeCenterX = (landmarks.LEFT_EYE.x + landmarks.RIGHT_EYE.x) / 2;
    const eyeToTop = Math.abs(eyeY - topY);
    const foreheadCenterY = eyeY < topY ? topY + faceHeight * 0.08 : eyeY - eyeToTop * 1.15;

    return {
      left: eyeCenterX - spriteSize / 2,
      top: foreheadCenterY - spriteSize / 2,
    };
  }

  return {
    left: centerX - spriteSize / 2,
    top: topY + faceHeight * 0.06 - spriteSize / 2,
  };
}
