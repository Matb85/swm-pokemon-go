import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const mapboxToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? '';

  return {
    ...config,
    name: config.name ?? 'swm-pokemon-go',
    slug: config.slug ?? 'swm-pokemon-go',
    plugins: [
      ...(config.plugins ?? []),
      [
        'expo-location',
        {
          locationWhenInUsePermission:
            'Allow $(PRODUCT_NAME) to use your location to center the map on your position.',
        },
      ],
      [
        'expo-media-library',
        {
          photosPermission: 'Allow $(PRODUCT_NAME) to access your photos.',
          savePhotosPermission: 'Allow $(PRODUCT_NAME) to save photos to your gallery.',
          isAccessMediaLocationEnabled: false,
        },
      ],
    ],
    ios: {
      ...config.ios,
      infoPlist: {
        ...config.ios?.infoPlist,
        NSCameraUsageDescription:
          'Allow $(PRODUCT_NAME) to access your camera to try on Pokémon.',
        MBXAccessToken: mapboxToken,
      },
    },
    android: {
      ...config.android,
      permissions: [...(config.android?.permissions ?? []), 'android.permission.CAMERA'],
      // @ts-expect-error Expo supports stringResource but types may lag
      stringResource: {
        mapbox_access_token: mapboxToken,
      },
    },
    extra: {
      ...config.extra,
      mapboxAccessToken: mapboxToken,
    },
  };
};
