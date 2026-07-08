import { CameraViewfinder } from '@/components/camera/CameraViewfinder';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

export default function CameraScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <CameraViewfinder />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
