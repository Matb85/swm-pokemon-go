import { RefreshCw } from 'lucide-react-native';
import { Pressable } from 'react-native';

type FlipCameraButtonProps = {
  onPress: () => void;
  disabled?: boolean;
};

export function FlipCameraButton({ onPress, disabled }: FlipCameraButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel="Switch camera"
      className="size-11 items-center justify-center rounded-full bg-white active:opacity-80"
      style={{
        opacity: disabled ? 0.5 : 1,
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
