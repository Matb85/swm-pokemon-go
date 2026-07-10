import { CameraErrorBoundary } from '@/components/camera/CameraErrorBoundary';
import { useIsFocused } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { lazy, Suspense } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const CameraViewfinder = lazy(() =>
  import('@/components/camera/CameraViewfinder').then((module) => ({
    default: module.CameraViewfinder,
  })),
);

function CameraLoading() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator color="#fff" size="large" />
    </View>
  );
}

export default function CameraScreen() {
  const isFocused = useIsFocused();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <CameraErrorBoundary>
        {isFocused ? (
          <Suspense fallback={<CameraLoading />}>
            <CameraViewfinder />
          </Suspense>
        ) : (
          <CameraLoading />
        )}
      </CameraErrorBoundary>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
});
