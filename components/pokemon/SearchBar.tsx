import { Search } from 'lucide-react-native';
import { TextInput, View } from 'react-native';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export function SearchBar({ value, onChangeText }: SearchBarProps) {
  return (
    <View className="border-b border-[#f2f2f2] bg-white px-4 pb-4 pt-2">
      <View className="h-12 flex-row items-center gap-2 rounded-full border border-[#ccc] px-4">
        <Search size={20} color="#666" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Search Pokémon..."
          placeholderTextColor="#999"
          className="flex-1 text-sm text-[#333]"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  );
}
