import { PokemonOverlay } from '@/components/camera/PokemonOverlay';
import type { Pokemon } from '@/services/pokeapi';
import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';

export type CompositorRequest = {
  photoUri: string;
  photoWidth: number;
  photoHeight: number;
  overlay: {
    pokemon: Pokemon;
    left: number;
    top: number;
    size: number;
  } | null;
};

type CaptureCompositorProps = {
  request: CompositorRequest | null;
  onComplete: (uri: string) => void;
  onError: (error: Error) => void;
};

const COMPOSITOR_TIMEOUT_MS = 15000;

export function CaptureCompositor({ request, onComplete, onError }: CaptureCompositorProps) {
  const compositorRef = useRef<View>(null);
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const hasReportedErrorRef = useRef(false);

  useEffect(() => {
    setPhotoLoaded(false);
    hasReportedErrorRef.current = false;
  }, [request?.photoUri]);

  useEffect(() => {
    if (!request || photoLoaded || hasReportedErrorRef.current) {
      return;
    }

    const timeout = setTimeout(() => {
      if (!photoLoaded && !hasReportedErrorRef.current) {
        hasReportedErrorRef.current = true;
        onError(new Error('Timed out while preparing the photo overlay'));
      }
    }, COMPOSITOR_TIMEOUT_MS);

    return () => clearTimeout(timeout);
  }, [onComplete, onError, photoLoaded, request]);

  useEffect(() => {
    if (!request || !photoLoaded || hasReportedErrorRef.current) {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        if (!compositorRef.current) {
          throw new Error('Compositor view is not ready');
        }

        const uri = await captureRef(compositorRef, {
          format: 'jpg',
          quality: 0.92,
          useRenderInContext: true,
        });
        onComplete(uri);
      } catch (error) {
        if (!hasReportedErrorRef.current) {
          hasReportedErrorRef.current = true;
          onError(error instanceof Error ? error : new Error('Failed to compose photo'));
        }
      }
    }, 80);

    return () => clearTimeout(timer);
  }, [onComplete, onError, photoLoaded, request]);

  if (!request) {
    return null;
  }

  const overlayImageSize = request.overlay ? Math.round(request.overlay.size * 0.78) : 0;

  return (
    <View
      ref={compositorRef}
      collapsable={false}
      style={[
        styles.host,
        {
          width: request.photoWidth,
          height: request.photoHeight,
        },
      ]}>
      <Image
        source={{ uri: request.photoUri }}
        style={{ width: request.photoWidth, height: request.photoHeight }}
        contentFit="fill"
        onLoad={() => setPhotoLoaded(true)}
        onError={() => {
          if (!hasReportedErrorRef.current) {
            hasReportedErrorRef.current = true;
            onError(new Error('Failed to load captured photo'));
          }
        }}
      />

      {request.overlay ? (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: request.overlay.left,
            top: request.overlay.top,
            width: request.overlay.size,
            height: request.overlay.size,
          }}>
          <PokemonOverlay
            pokemon={request.overlay.pokemon}
            spriteSize={request.overlay.size}
            imageSize={overlayImageSize}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: -10000,
    top: 0,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
});
