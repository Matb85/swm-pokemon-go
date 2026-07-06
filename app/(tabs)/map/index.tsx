import { Text } from '@/components/ui/text';
import { isMapboxConfigured } from '@/lib/mapbox';
import { Suspense, lazy } from 'react';
import { ActivityIndicator, View } from 'react-native';

const LazyMapContent = lazy(() =>
  import('@/components/map/MapContent').then((module) => ({ default: module.MapContent }))
);

function MapUnavailable() {
  return (
    <View className="flex-1 items-center justify-center bg-[#f8f8f8] px-8">
      <Text className="text-center text-lg font-semibold text-[#333]">Map unavailable</Text>
      <Text className="mt-3 text-center text-sm leading-5 text-[#777]">
        Add your Mapbox public token to{' '}
        <Text className="font-medium text-[#173EA5]">EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN</Text>, then
        rebuild the dev client with{' '}
        <Text className="font-medium text-[#173EA5]">npm run rebuild:ios</Text>.
      </Text>
    </View>
  );
}

function MapLoading() {
  return (
    <View className="flex-1 items-center justify-center bg-[#f5f5f5]">
      <ActivityIndicator size="large" color="#173EA5" />
    </View>
  );
}

export default function MapScreen() {
  if (!isMapboxConfigured()) {
    return <MapUnavailable />;
  }

  return (
    <Suspense fallback={<MapLoading />}>
      <LazyMapContent />
    </Suspense>
  );
}
