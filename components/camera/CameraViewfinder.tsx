import { Text } from "@/components/ui/text";
import { prepareCapturedPhoto, savePhotoToGallery, scaleOverlayToPhoto } from "@/lib/camera-photo";
import { getPokemonOverlayPosition, POKEMON_SPRITE_SIZE } from "@/lib/face-overlay";
import { fetchPokemon, type Pokemon } from "@/services/pokeapi";
import { useIsFocused } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, AppState, Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Camera,
  CommonResolutions,
  useCameraDevice,
  useCameraPermission,
  usePhotoOutput,
  type CameraPosition,
  type CameraRef,
  type Constraint,
} from "react-native-vision-camera";
import { useFaceDetectorOutput, type Face } from "react-native-vision-camera-face-detector";
import { CaptureCompositor, type CompositorRequest } from "./CaptureCompositor";
import { CaptureProcessingOverlay, type CapturePhase } from "./CaptureProcessingOverlay";
import { FlipCameraButton } from "./FlipCameraButton";
import { HeadSilhouette, SILHOUETTE_HEIGHT, SILHOUETTE_WIDTH } from "./HeadSilhouette";
import { PokemonOverlay } from "./PokemonOverlay";
import { ShutterButton } from "./ShutterButton";
import { ShutterFlash, type ShutterFlashRef } from "./ShutterFlash";

const PIKACHU_ID = 25;
const OVERLAY_POSITION_THRESHOLD = 4;
const SUCCESS_DISPLAY_MS = 1200;
const CAPTURE_TIMEOUT_MS = 20000;

function wait(ms: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, ms);
  });
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), timeoutMs);
    promise
      .then(value => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch(error => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

export function CameraViewfinder() {
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const cameraRef = useRef<CameraRef>(null);
  const shutterFlashRef = useRef<ShutterFlashRef>(null);
  const photoOutput = usePhotoOutput({
    targetResolution: CommonResolutions.HD_4_3,
    qualityPrioritization: "speed",
    quality: 0.8,
  });
  const isMountedRef = useRef(false);
  const { hasPermission, requestPermission, canRequestPermission } = useCameraPermission();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturePhase, setCapturePhase] = useState<CapturePhase | null>(null);
  const [captureIncludesOverlay, setCaptureIncludesOverlay] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<CameraPosition>("front");
  const [hasFace, setHasFace] = useState(false);
  const [appIsActive, setAppIsActive] = useState(AppState.currentState === "active");
  const [compositorRequest, setCompositorRequest] = useState<CompositorRequest | null>(null);
  const hasFaceRef = useRef(false);
  const lastOverlayPositionRef = useRef({ left: 0, top: 0 });
  const captureSessionRef = useRef(0);
  const compositorSessionRef = useRef<number | null>(null);

  const overlayX = useSharedValue(0);
  const overlayY = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);

  const cameraDevice = useCameraDevice(cameraFacing);
  const isCameraActive = isFocused && appIsActive && hasPermission && !!cameraDevice;

  const abortCapture = useCallback(() => {
    captureSessionRef.current += 1;
    compositorSessionRef.current = null;

    if (!isMountedRef.current) {
      return;
    }

    setCompositorRequest(null);
    setIsCapturing(false);
    setCapturePhase(null);
    setCaptureIncludesOverlay(false);
  }, []);

  const faceDetectorSettings = useMemo(
    () => ({
      performanceMode: "fast" as const,
      runLandmarks: cameraFacing === "front",
      runContours: false,
      runClassifications: false,
      autoMode: true,
      windowWidth: width,
      windowHeight: height,
      cameraFacing,
      minFaceSize: cameraFacing === "back" ? 0.12 : 0.15,
      trackingEnabled: true,
      outputResolution: "preview" as const,
    }),
    [cameraFacing, height, width],
  );

  const handleFacesDetected = useCallback(
    (faces: Face[]) => {
      if (!isCameraActive) {
        return;
      }

      if (faces.length === 0) {
        if (hasFaceRef.current) {
          hasFaceRef.current = false;
          setHasFace(false);
        }
        overlayOpacity.value = withTiming(0, { duration: 150 });
        return;
      }

      const face = faces[0];
      const position = getPokemonOverlayPosition(face.bounds, face.landmarks, face.contours);

      if (!hasFaceRef.current) {
        hasFaceRef.current = true;
        setHasFace(true);
        overlayOpacity.value = withTiming(1, { duration: 100 });
        lastOverlayPositionRef.current = position;
        overlayX.value = position.left;
        overlayY.value = position.top;
        return;
      }

      const deltaX = Math.abs(position.left - lastOverlayPositionRef.current.left);
      const deltaY = Math.abs(position.top - lastOverlayPositionRef.current.top);
      if (deltaX < OVERLAY_POSITION_THRESHOLD && deltaY < OVERLAY_POSITION_THRESHOLD) {
        return;
      }

      lastOverlayPositionRef.current = position;
      overlayX.value = position.left;
      overlayY.value = position.top;
    },
    [isCameraActive, overlayOpacity, overlayX, overlayY],
  );

  const handleFaceDetectionError = useCallback((error: Error) => {
    console.error("Face detection error:", error);
  }, []);

  const faceDetectorOutput = useFaceDetectorOutput({
    ...faceDetectorSettings,
    onFacesDetected: handleFacesDetected,
    onError: handleFaceDetectionError,
  });

  const constraints = useMemo(
    () =>
      [
        { resolutionBias: faceDetectorOutput },
        { binned: true },
        { fps: 30 },
      ] satisfies Constraint[],
    [faceDetectorOutput],
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
      .then(data => {
        if (isMountedRef.current) {
          setPokemon(data);
        }
      })
      .catch(() => {});

    const subscription = AppState.addEventListener("change", nextState => {
      setAppIsActive(nextState === "active");
    });

    return () => {
      isMountedRef.current = false;
      subscription.remove();
    };
  }, [canRequestPermission, hasPermission, requestPermission]);

  useEffect(() => {
    if (!isFocused || !appIsActive) {
      abortCapture();
    }
  }, [abortCapture, appIsActive, isFocused]);

  useEffect(() => {
    return () => {
      abortCapture();
    };
  }, [abortCapture]);

  const finishCapture = useCallback(() => {
    setIsCapturing(false);
    setCapturePhase(null);
    setCaptureIncludesOverlay(false);
  }, []);

  const runCapture = useCallback(async () => {
    const sessionId = captureSessionRef.current;
    const isCaptureActive = () => sessionId === captureSessionRef.current && isMountedRef.current;
    let needsCompositor = false;
    let capturedPhoto: Awaited<ReturnType<typeof photoOutput.capturePhoto>> | null = null;

    try {
      if (!isCaptureActive()) {
        return;
      }

      setCapturePhase("capturing");
      capturedPhoto = await withTimeout(
        photoOutput.capturePhoto({}, {}),
        CAPTURE_TIMEOUT_MS,
        "Photo capture timed out",
      );

      if (!isCaptureActive()) {
        return;
      }

      setCapturePhase("processing");
      const prepared = await prepareCapturedPhoto(capturedPhoto, width, height, cameraFacing);
      capturedPhoto.dispose();
      capturedPhoto = null;

      if (!isCaptureActive()) {
        return;
      }

      const overlayPosition =
        hasFaceRef.current && pokemon
          ? scaleOverlayToPhoto(lastOverlayPositionRef.current, width, height, prepared.width, prepared.height)
          : null;

      const includesOverlay = Boolean(overlayPosition && pokemon);
      setCaptureIncludesOverlay(includesOverlay);

      if (includesOverlay && overlayPosition && pokemon) {
        needsCompositor = true;
        compositorSessionRef.current = sessionId;
        setCompositorRequest({
          photoUri: prepared.uri,
          photoWidth: prepared.width,
          photoHeight: prepared.height,
          overlay: {
            pokemon,
            ...overlayPosition,
          },
        });
        return;
      }

      setCapturePhase("saving");
      const saved = await savePhotoToGallery(prepared.uri);

      if (!isCaptureActive()) {
        return;
      }

      if (saved) {
        setCapturePhase("success");
        await wait(SUCCESS_DISPLAY_MS);
      } else {
        Alert.alert("Permission needed", "Allow photo library access to save photos.");
      }
    } catch (_error) {
      if (capturedPhoto) {
        capturedPhoto.dispose();
      }

      if (!isCaptureActive()) {
        return;
      }

      Alert.alert("Error", "Could not take the photo. Please try again.");
    } finally {
      if (!needsCompositor && isCaptureActive()) {
        finishCapture();
      }
    }
  }, [cameraFacing, finishCapture, height, photoOutput, pokemon, width]);

  const handleCapture = useCallback(() => {
    if (isCapturing) return;

    setIsCapturing(true);
    setCapturePhase("capturing");
    setCaptureIncludesOverlay(hasFaceRef.current);
    shutterFlashRef.current?.trigger();

    requestAnimationFrame(() => {
      void runCapture();
    });
  }, [isCapturing, runCapture]);

  const handleCompositorComplete = useCallback(
    async (uri: string) => {
      const sessionId = compositorSessionRef.current;
      if (sessionId === null || sessionId !== captureSessionRef.current) {
        return;
      }

      setCompositorRequest(null);
      compositorSessionRef.current = null;

      try {
        setCapturePhase("saving");
        const saved = await savePhotoToGallery(uri);

        if (sessionId !== captureSessionRef.current || !isMountedRef.current) {
          return;
        }

        if (saved) {
          setCapturePhase("success");
          await wait(SUCCESS_DISPLAY_MS);
        } else {
          Alert.alert("Permission needed", "Allow photo library access to save photos.");
        }
      } catch {
        if (sessionId !== captureSessionRef.current || !isMountedRef.current) {
          return;
        }

        Alert.alert("Error", "Could not save the photo. Please try again.");
      } finally {
        if (sessionId === captureSessionRef.current && isMountedRef.current) {
          finishCapture();
        }
      }
    },
    [finishCapture],
  );

  const handleCompositorError = useCallback(
    (error: Error) => {
      const sessionId = compositorSessionRef.current;
      if (sessionId === null || sessionId !== captureSessionRef.current) {
        return;
      }

      console.error("Photo compositor error:", error);
      compositorSessionRef.current = null;
      setCompositorRequest(null);
      Alert.alert("Error", "Could not add the Pokémon overlay to your photo. Please try again.");
      finishCapture();
    },
    [finishCapture],
  );

  const handleFlipCamera = useCallback(() => {
    if (isCapturing) return;

    setCameraFacing(current => (current === "front" ? "back" : "front"));
    hasFaceRef.current = false;
    setHasFace(false);
    overlayOpacity.value = 0;
    lastOverlayPositionRef.current = { left: 0, top: 0 };
  }, [isCapturing, overlayOpacity]);

  if (!hasPermission) {
    return (
      <View style={styles.centered}>
        <Text className="mb-6 text-center text-base text-white">Camera access is needed to try on Pokémon</Text>
        {canRequestPermission ? (
          <Pressable onPress={requestPermission} className="rounded-full bg-white px-6 py-3 active:opacity-80">
            <Text className="text-base font-semibold text-[#173EA5]">Allow Camera</Text>
          </Pressable>
        ) : (
          <Text className="text-center text-sm text-white/70">Enable camera access in system settings</Text>
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
        key={cameraFacing}
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={cameraDevice}
        isActive={isCameraActive}
        mirrorMode="auto"
        orientationSource="interface"
        outputs={[faceDetectorOutput, photoOutput]}
        constraints={constraints}
        onError={handleFaceDetectionError}
      />

      <ShutterFlash ref={shutterFlashRef} />

      <CaptureProcessingOverlay phase={capturePhase} includesOverlay={captureIncludesOverlay} />

      <View
        style={[styles.guideLayer, { paddingTop: insets.top, paddingBottom: insets.bottom + 88 }]}
        pointerEvents="box-none"
      >
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

      <View style={[styles.controlsContainer, { bottom: insets.bottom + 24 }]} pointerEvents="box-none">
        <View style={styles.controlsSide} />
        <ShutterButton onPress={handleCapture} disabled={isCapturing} processing={isCapturing} />
        <View style={styles.controlsSideRight}>
          <FlipCameraButton onPress={handleFlipCamera} disabled={isCapturing} />
        </View>
      </View>

      <CaptureCompositor
        request={compositorRequest}
        onComplete={handleCompositorComplete}
        onError={handleCompositorError}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    paddingHorizontal: 32,
  },
  guideLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  silhouetteFrame: {
    width: SILHOUETTE_WIDTH,
    height: SILHOUETTE_HEIGHT,
    paddingTop: 108,
  },
  overlayHost: {
    position: "absolute",
    width: POKEMON_SPRITE_SIZE,
    height: POKEMON_SPRITE_SIZE,
  },
  controlsContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  controlsSide: {
    flex: 1,
  },
  controlsSideRight: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 24,
  },
});
