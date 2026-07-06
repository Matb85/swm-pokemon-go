import Constants from 'expo-constants';

export const MAPBOX_ACCESS_TOKEN =
  process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ??
  (Constants.expoConfig?.extra?.mapboxAccessToken as string | undefined) ??
  '';

let mapboxInitialized = false;

export function isMapboxConfigured() {
  return MAPBOX_ACCESS_TOKEN.length > 0;
}

export function ensureMapboxInitialized() {
  if (!isMapboxConfigured() || mapboxInitialized) {
    return;
  }

  // biome-ignore lint/style/noRestrictedImports: defer native Mapbox binding until the map tab mounts
  const Mapbox = require('@rnmapbox/maps').default;
  Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);
  mapboxInitialized = true;
}
