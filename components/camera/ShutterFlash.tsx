import { StyleSheet } from 'react-native';
import { forwardRef, useCallback, useImperativeHandle } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

export type ShutterFlashRef = {
  trigger: () => void;
};

export const ShutterFlash = forwardRef<ShutterFlashRef>(function ShutterFlash(_props, ref) {
  const opacity = useSharedValue(0);

  const trigger = useCallback(() => {
    opacity.value = withSequence(
      withTiming(0.85, { duration: 60 }),
      withTiming(0, { duration: 180 }),
    );
  }, [opacity]);

  useImperativeHandle(ref, () => ({ trigger }), [trigger]);

  const flashStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View pointerEvents="none" style={[styles.flash, flashStyle]} />;
});

const styles = StyleSheet.create({
  flash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    zIndex: 10,
  },
});
