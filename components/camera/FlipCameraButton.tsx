import { RefreshCw } from 'lucide-react-native';
import { Pressable } from 'react-native';

type FlipCameraButtonProps = {
  onPress: () => void;
};

export function FlipCameraButton({ onPress }: FlipCameraButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Switch camera"
      className="size-11 items-center justify-center rounded-full bg-white active:opacity-80"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
      }}>
      <RefreshCw size={22} color="#173EA5" strokeWidth={2} />
    </Pressable>
  );
}
