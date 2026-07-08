import { Check } from 'lucide-react-native';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { Text } from '@/components/ui/text';

type FilterOption<T extends string | null> = {
  value: T;
  label: string;
};

type FilterPickerModalProps<T extends string | null> = {
  visible: boolean;
  title: string;
  options: FilterOption<T>[];
  selectedValue: T;
  onSelect: (value: T) => void;
  onClose: () => void;
};

export function FilterPickerModal<T extends string | null>({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}: FilterPickerModalProps<T>) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/40" onPress={onClose}>
        <Pressable className="max-h-[70%] rounded-t-[20px] bg-white" onPress={() => {}}>
          <View className="items-center pt-3">
            <View className="h-1 w-10 rounded-full bg-[#e6e6e6]" />
          </View>

          <Text className="px-4 pb-3 pt-4 text-lg font-semibold text-black">{title}</Text>

          <ScrollView className="px-2 pb-8">
            {options.map((option) => {
              const isSelected = option.value === selectedValue;

              return (
                <Pressable
                  key={option.label}
                  onPress={() => {
                    onSelect(option.value);
                    onClose();
                  }}
                  className={`mb-1 flex-row items-center justify-between rounded-xl px-4 py-3 ${
                    isSelected ? 'bg-[#173EA5]/10' : 'bg-transparent'
                  }`}>
                  <Text
                    className={`text-base ${isSelected ? 'font-semibold text-[#173EA5]' : 'text-[#333]'}`}>
                    {option.label}
                  </Text>
                  {isSelected ? <Check size={18} color="#173EA5" /> : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
