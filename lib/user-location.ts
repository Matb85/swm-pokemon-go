import * as Location from 'expo-location';
import { Alert, Linking } from 'react-native';

const LOCATION_ALERT = {
  title: 'Location permission needed',
  message: 'Enable location access in Settings to center the map on your position.',
} as const;

async function ensureForegroundLocationPermission() {
  const current = await Location.getForegroundPermissionsAsync();
  if (current.status === 'granted') {
    return true;
  }

  const requested = await Location.requestForegroundPermissionsAsync();
  if (requested.status === 'granted') {
    return true;
  }

  Alert.alert(LOCATION_ALERT.title, LOCATION_ALERT.message, [
    { text: 'Not now', style: 'cancel' },
    { text: 'Open Settings', onPress: () => Linking.openSettings() },
  ]);

  return false;
}

export async function getUserCoordinate(): Promise<[number, number] | null> {
  const hasPermission = await ensureForegroundLocationPermission();
  if (!hasPermission) {
    return null;
  }

  const servicesEnabled = await Location.hasServicesEnabledAsync();
  if (!servicesEnabled) {
    Alert.alert(
      'Location services disabled',
      'Turn on location services to center the map on your position.'
    );
    return null;
  }

  try {
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return [position.coords.longitude, position.coords.latitude];
  } catch {
    Alert.alert(
      'Unable to find your location',
      'Check that location services are enabled and try again.'
    );
    return null;
  }
}
