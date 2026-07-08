import { Text } from '@/components/ui/text';
import { Component, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

type CameraErrorBoundaryProps = {
  children: ReactNode;
};

type CameraErrorBoundaryState = {
  hasError: boolean;
};

export class CameraErrorBoundary extends Component<
  CameraErrorBoundaryProps,
  CameraErrorBoundaryState
> {
  state: CameraErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): CameraErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text className="mb-3 text-center text-lg font-semibold text-white">
            Camera module not available
          </Text>
          <Text className="text-center text-sm text-white/70">
            Rebuild the native app after installing react-native-vision-camera:
          </Text>
          <Text className="mt-4 text-center font-mono text-xs text-white/50">
            npm run rebuild:ios{'\n'}npm run rebuild:android
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 32,
  },
});
