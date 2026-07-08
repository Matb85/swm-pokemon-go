import { LocateFixed } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type LocateMeButtonProps = {
  onLocate: () => Promise<void>;
};

export function LocateMeButton({ onLocate }: LocateMeButtonProps) {
  const insets = useSafeAreaInsets();
  const [locating, setLocating] = useState(false);

  const handlePress = useCallback(async () => {
    if (locating) return;

    setLocating(true);
    try {
      await onLocate();
    } finally {
      setLocating(false);
    }
  }, [locating, onLocate]);

  return (
    <Pressable
      onPress={handlePress}
      disabled={locating}
      accessibilityRole="button"
      accessibilityLabel="Locate me on the map"
      className="absolute right-4 z-10 size-11 items-center justify-center rounded-full bg-white"
      style={{
        top: insets.top + 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
      }}>
      {locating ? (
        <ActivityIndicator size="small" color="#173EA5" />
      ) : (
        <LocateFixed size={22} color="#173EA5" strokeWidth={2} />
      )}
    </Pressable>
  );
}
