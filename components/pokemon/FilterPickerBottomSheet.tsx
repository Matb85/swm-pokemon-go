import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { Check } from 'lucide-react-native';
import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';

const TAB_BAR_HEIGHT = 72;
const SNAP_POINTS = ['70%'];

type FilterOption<T extends string | null> = {
  value: T;
  label: string;
};

type PresentConfig<T extends string | null> = {
  title: string;
  options: FilterOption<T>[];
  selectedValue: T;
  onSelect: (value: T) => void;
};

export type FilterPickerBottomSheetRef = {
  present: <T extends string | null>(config: PresentConfig<T>) => void;
  dismiss: () => void;
};

type FilterOptionRowProps = {
  label: string;
  isSelected: boolean;
  onPress: () => void;
};

function FilterOptionRow({ label, isSelected, onPress }: FilterOptionRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`mb-1 flex-row items-center justify-between rounded-xl px-4 py-3 ${
        isSelected ? 'bg-[#173EA5]/10' : 'bg-transparent'
      }`}>
      <Text
        className={`text-base ${isSelected ? 'font-semibold text-[#173EA5]' : 'text-[#333]'}`}>
        {label}
      </Text>
      {isSelected ? <Check size={18} color="#173EA5" /> : null}
    </Pressable>
  );
}

export const FilterPickerBottomSheet = forwardRef<FilterPickerBottomSheetRef>(
  function FilterPickerBottomSheet(_, ref) {
    const insets = useSafeAreaInsets();
    const sheetRef = useRef<BottomSheetModal>(null);
    const onSelectRef = useRef<(value: string | null) => void>(() => {});
    const configRef = useRef<PresentConfig<string | null>>({
      title: '',
      options: [],
      selectedValue: null,
      onSelect: () => {},
    });
    const [, setRevision] = useState(0);

    const tabBarInset = TAB_BAR_HEIGHT + insets.bottom;
    const { title, options, selectedValue } = configRef.current;

    useImperativeHandle(ref, () => ({
      present<T extends string | null>(config: PresentConfig<T>) {
        configRef.current = {
          title: config.title,
          options: config.options as FilterOption<string | null>[],
          selectedValue: config.selectedValue,
          onSelect: config.onSelect as (value: string | null) => void,
        };
        onSelectRef.current = configRef.current.onSelect;
        setRevision((revision) => revision + 1);
        requestAnimationFrame(() => {
          sheetRef.current?.present();
        });
      },
      dismiss() {
        sheetRef.current?.dismiss();
      },
    }));

    const handleSelect = (value: string | null) => {
      onSelectRef.current(value);
      sheetRef.current?.dismiss();
    };

    const renderBackdrop = (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.45}
        pressBehavior="close"
        style={{ bottom: tabBarInset }}
      />
    );

    const renderItem = ({ item }: { item: FilterOption<string | null> }) => (
      <FilterOptionRow
        label={item.label}
        isSelected={item.value === selectedValue}
        onPress={() => handleSelect(item.value)}
      />
    );

    const listHeader = (
      <Text className="px-4 pb-3 pt-1 text-lg font-semibold text-black">{title}</Text>
    );

    return (
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={SNAP_POINTS}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        bottomInset={tabBarInset}
        backgroundStyle={{ borderRadius: 20 }}
        handleIndicatorStyle={{ backgroundColor: '#e6e6e6', width: 40 }}>
        <BottomSheetFlatList
          data={options}
          keyExtractor={(item) => item.label}
          renderItem={renderItem}
          ListHeaderComponent={listHeader}
          contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: insets.bottom + 16 }}
        />
      </BottomSheetModal>
    );
  }
);
