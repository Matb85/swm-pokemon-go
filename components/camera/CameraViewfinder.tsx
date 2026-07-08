import { Text } from '@/components/ui/text';
import { getPokemonOverlayPosition, POKEMON_SPRITE_SIZE } from '@/lib/face-overlay';
import { fetchPokemon, type Pokemon } from '@/services/pokeapi';
import { useIsFocused } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AppState,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useCameraDevice,
  useCameraPermission,
  usePhotoOutput,
  type CameraPosition,
  type CameraRef,
} from 'react-native-vision-camera';
import {
  Camera,
  type Face,
} from 'react-native-vision-camera-face-detector';
import { FlipCameraButton } from './FlipCameraButton';
import { HeadSilhouette, SILHOUETTE_HEIGHT, SILHOUETTE_WIDTH } from './HeadSilhouette';
import { PokemonOverlay } from './PokemonOverlay';
import { ShutterButton } from './ShutterButton';

const PIKACHU_ID = 25;

export function CameraViewfinder() {
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const cameraRef = useRef<CameraRef>(null);
  const photoOutput = usePhotoOutput();
  const isMountedRef = useRef(false);
  const { hasPermission, requestPermission, canRequestPermission } = useCameraPermission();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<CameraPosition>('front');
  const [hasFace, setHasFace] = useState(false);
  const [appIsActive, setAppIsActive] = useState(AppState.currentState === 'active');

  const overlayX = useSharedValue(0);
  const overlayY = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);

  const cameraDevice = useCameraDevice(cameraFacing);
  const isCameraActive = isFocused && appIsActive && hasPermission && !!cameraDevice;

  const faceDetectorOptions = useMemo(
    () => ({
      performanceMode: 'fast' as const,
      runLandmarks: true,
      runContours: true,
      autoMode: true,
      windowWidth: width,
      windowHeight: height,
      cameraFacing,
      minFaceSize: 0.15,
      trackingEnabled: true,
    }),
    [cameraFacing, height, width],
  );

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
    left: overlayX.value,
    top: overlayY.value,
  }));

  useEffect(() => {
    isMountedRef.current = true;

    if (!hasPermission && canRequestPermission) {
      requestPermission();
    }

    fetchPokemon(PIKACHU_ID)
      .then((data) => {
        if (isMountedRef.current) {
          setPokemon(data);
        }
      })
      .catch(() => {});

    const subscription = AppState.addEventListener('change', (nextState) => {
      setAppIsActive(nextState === 'active');
    });

    return () => {
      isMountedRef.current = false;
      subscription.remove();
    };
  }, [canRequestPermission, hasPermission, requestPermission]);

  const handleFacesDetected = useCallback(
    (faces: Face[]) => {
      if (faces.length === 0) {
        setHasFace(false);
        overlayOpacity.value = withTiming(0, { duration: 150 });
        return;
      }

      const face = faces[0];
      const position = getPokemonOverlayPosition(face.bounds, face.landmarks, face.contours);

      setHasFace(true);
      overlayX.value = withTiming(position.left, { duration: 100 });
      overlayY.value = withTiming(position.top, { duration: 100 });
      overlayOpacity.value = withTiming(1, { duration: 100 });
    },
    [overlayOpacity, overlayX, overlayY],
  );

  const handleFaceDetectionError = useCallback((error: Error) => {
    console.error('Face detection error:', error);
  }, []);

  const handleCapture = useCallback(async () => {
    if (isCapturing) return;

    setIsCapturing(true);
    try {
      const photo = await photoOutput.capturePhoto({}, {});
      photo.dispose();
    } finally {
      if (isMountedRef.current) {
        setIsCapturing(false);
      }
    }
  }, [isCapturing, photoOutput]);

  const handleFlipCamera = useCallback(() => {
    setCameraFacing((current) => (current === 'front' ? 'back' : 'front'));
    setHasFace(false);
    overlayOpacity.value = 0;
  }, [overlayOpacity]);

  if (!hasPermission) {
    return (
      <View style={styles.centered}>
        <Text className="mb-6 text-center text-base text-white">
          Camera access is needed to try on Pokémon
        </Text>
        {canRequestPermission ? (
          <Pressable
            onPress={requestPermission}
            className="rounded-full bg-white px-6 py-3 active:opacity-80">
            <Text className="text-base font-semibold text-[#173EA5]">Allow Camera</Text>
          </Pressable>
        ) : (
          <Text className="text-center text-sm text-white/70">
            Enable camera access in system settings
          </Text>
        )}
      </View>
    );
  }

  if (!cameraDevice) {
    return (
      <View style={styles.centered}>
        <Text className="text-center text-base text-white">No camera available on this device</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={cameraDevice}
        isActive={isCameraActive}
        mirrorMode="auto"
        outputs={[photoOutput]}
        onFacesDetected={handleFacesDetected}
        onError={handleFaceDetectionError}
        {...faceDetectorOptions}
      />

      <FlipCameraButton onPress={handleFlipCamera} />

      <View
        style={[
          styles.guideLayer,
          { paddingTop: insets.top, paddingBottom: insets.bottom + 88 },
        ]}
        pointerEvents="box-none">
        {!hasFace ? (
          <View style={styles.silhouetteFrame}>
            <HeadSilhouette />
          </View>
        ) : null}
      </View>

      {pokemon ? (
        <Animated.View style={[styles.overlayHost, overlayStyle]} pointerEvents="none">
          <PokemonOverlay pokemon={pokemon} />
        </Animated.View>
      ) : null}

      <View
        style={[styles.shutterContainer, { bottom: insets.bottom + 24 }]}
        pointerEvents="box-none">
        <ShutterButton onPress={handleCapture} disabled={isCapturing} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 32,
  },
  guideLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  silhouetteFrame: {
    width: SILHOUETTE_WIDTH,
    height: SILHOUETTE_HEIGHT,
  },
  overlayHost: {
    position: 'absolute',
    width: POKEMON_SPRITE_SIZE,
    height: POKEMON_SPRITE_SIZE,
  },
  shutterContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
