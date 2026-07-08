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
    ],
    ios: {
      ...config.ios,
      infoPlist: {
        ...config.ios?.infoPlist,
        MBXAccessToken: mapboxToken,
      },
    },
    android: {
      ...config.android,
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
