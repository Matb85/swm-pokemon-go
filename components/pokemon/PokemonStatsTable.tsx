import { Text } from '@/components/ui/text';
import { getStatLabel, type Pokemon, type PokemonStatName } from '@/services/pokeapi';
import { View } from 'react-native';

type PokemonStatsTableProps = {
  pokemon: Pokemon;
};

type StatRow = {
  label: string;
  value: string;
};

function formatMeasurement(value: number, unit: string) {
  return `${value.toFixed(1)} ${unit}`;
}

export function PokemonStatsTable({ pokemon }: PokemonStatsTableProps) {
  const rows: StatRow[] = [
    { label: 'Height', value: formatMeasurement(pokemon.height, 'm') },
    { label: 'Weight', value: formatMeasurement(pokemon.weight, 'kg') },
    ...Object.entries(pokemon.stats).map(([stat, value]) => ({
      label: getStatLabel(stat as PokemonStatName),
      value: value.toString(),
    })),
  ];

  return (
    <View className="w-full overflow-hidden rounded-[15px] bg-[#ecf1f3]">
      <Text className="px-4 pb-2 pt-4 text-sm font-semibold text-[#333]">Stats</Text>
      {rows.map((row, index) => (
        <View
          key={row.label}
          className="flex-row items-center justify-between px-4 py-3"
          style={
            index < rows.length - 1 ? { borderBottomWidth: 1, borderBottomColor: '#ffffff' } : undefined
          }>
          <Text className="text-sm text-[#666]">{row.label}</Text>
          <Text className="text-sm font-semibold text-black">{row.value}</Text>
        </View>
      ))}
    </View>
  );
}
