import { Asset, requestPermissionsAsync } from 'expo-media-library';
import type { Image } from 'react-native-nitro-image';
import type { CameraPosition, Photo } from 'react-native-vision-camera';
import { type OverlayPosition, POKEMON_SPRITE_SIZE } from './face-overlay';

export type CropRect = {
  originX: number;
  originY: number;
  width: number;
  height: number;
};

export type ScaledOverlay = {
  left: number;
  top: number;
  size: number;
};

export type PreparedPhoto = {
  uri: string;
  width: number;
  height: number;
};

export function toFileUri(path: string): string {
  return path.startsWith('file://') ? path : `file://${path}`;
}

async function bakeImagePixels(image: Image): Promise<Image> {
  return image.rotateAsync(0, false);
}

export function getCenterCropRect(
  photoWidth: number,
  photoHeight: number,
  viewWidth: number,
  viewHeight: number,
): CropRect {
  const photoAspect = photoWidth / photoHeight;
  const viewAspect = viewWidth / viewHeight;

  if (photoAspect > viewAspect) {
    const cropWidth = Math.round(photoHeight * viewAspect);
    const originX = Math.round((photoWidth - cropWidth) / 2);
    return { originX, originY: 0, width: cropWidth, height: photoHeight };
  }

  const cropHeight = Math.round(photoWidth / viewAspect);
  const originY = Math.round((photoHeight - cropHeight) / 2);
  return { originX: 0, originY, width: photoWidth, height: cropHeight };
}

export function scaleOverlayToPhoto(
  position: OverlayPosition,
  viewWidth: number,
  viewHeight: number,
  photoWidth: number,
  photoHeight: number,
  spriteSize = POKEMON_SPRITE_SIZE,
): ScaledOverlay {
  const scaleX = photoWidth / viewWidth;
  const scaleY = photoHeight / viewHeight;
  const scale = (scaleX + scaleY) / 2;

  return {
    left: Math.round(position.left * scaleX),
    top: Math.round(position.top * scaleY),
    size: Math.round(spriteSize * scale),
  };
}

export async function prepareCapturedPhoto(
  photo: Photo,
  viewWidth: number,
  viewHeight: number,
  cameraFacing: CameraPosition,
): Promise<PreparedPhoto> {
  let image = await photo.toImageAsync();

  // Vision Camera keeps orientation in UIImage metadata. Nitro Image crops the raw
  // CGImage while dimensions use the oriented size, so bake upright pixels first.
  image = await bakeImagePixels(image);

  if (cameraFacing === 'front' && !photo.isMirrored) {
    image = await image.mirrorHorizontallyAsync();
    image = await bakeImagePixels(image);
  }

  const cropRect = getCenterCropRect(image.width, image.height, viewWidth, viewHeight);
  image = await image.cropAsync(
    cropRect.originX,
    cropRect.originY,
    cropRect.originX + cropRect.width,
    cropRect.originY + cropRect.height,
  );

  const path = await image.saveToTemporaryFileAsync('jpg', 92);

  return {
    uri: toFileUri(path),
    width: image.width,
    height: image.height,
  };
}

export async function savePhotoToGallery(uri: string): Promise<boolean> {
  const { status } = await requestPermissionsAsync(true);
  if (status !== 'granted') {
    return false;
  }

  await Asset.create(uri);
  return true;
}
