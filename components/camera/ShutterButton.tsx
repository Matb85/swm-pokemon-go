import { Pressable, View } from 'react-native';

type ShutterButtonProps = {
  onPress: () => void;
  disabled?: boolean;
};

export function ShutterButton({ onPress, disabled }: ShutterButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel="Take photo"
      className="items-center justify-center active:opacity-80"
      style={{ opacity: disabled ? 0.5 : 1 }}>
      <View
        className="items-center justify-center rounded-full border-4 border-white/60"
        style={{ width: 80, height: 80 }}>
        <View className="rounded-full bg-white" style={{ width: 64, height: 64 }} />
      </View>
    </Pressable>
  );
}
