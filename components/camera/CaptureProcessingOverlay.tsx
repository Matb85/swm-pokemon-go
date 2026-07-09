import { Text } from '@/components/ui/text';
import { Check } from 'lucide-react-native';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export type CapturePhase = 'capturing' | 'processing' | 'saving' | 'success';

type CaptureProcessingOverlayProps = {
  phase: CapturePhase | null;
  includesOverlay: boolean;
};

const PHASE_LABELS: Record<Exclude<CapturePhase, 'processing'>, string> = {
  capturing: 'Taking photo…',
  saving: 'Saving to gallery…',
  success: 'Saved to gallery!',
};

function getProcessingLabel(includesOverlay: boolean) {
  return includesOverlay ? 'Adding Pokémon…' : 'Processing photo…';
}

export function CaptureProcessingOverlay({ phase, includesOverlay }: CaptureProcessingOverlayProps) {
  const label = phase
    ? phase === 'processing'
      ? getProcessingLabel(includesOverlay)
      : PHASE_LABELS[phase]
    : '';
  const isSuccess = phase === 'success';

  return (
    <Modal visible={phase != null} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.backdrop}>
        {phase ? (
          <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(180)} style={styles.card}>
            {isSuccess ? (
              <View style={styles.successIcon}>
                <Check color="#173EA5" size={28} strokeWidth={2.5} />
              </View>
            ) : (
              <ActivityIndicator color="#173EA5" size="large" />
            )}
            <Text className="mt-4 text-center text-base font-semibold text-[#173EA5]">{label}</Text>
          </Animated.View>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 32,
  },
  card: {
    minWidth: 220,
    maxWidth: 280,
    alignItems: 'center',
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    paddingHorizontal: 28,
    paddingVertical: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  successIcon: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
    backgroundColor: 'rgba(23, 62, 165, 0.1)',
  },
});
