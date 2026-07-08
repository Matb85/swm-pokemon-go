import { Trash2 } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { useFavorites } from '@/hooks/useFavorites';
import type { Pokemon } from '@/services/pokeapi';
import { FavoriteButton } from './FavoriteButton';
import { PokemonListCard } from './PokemonListCard';

type PokemonCardProps = {
  pokemon: Pokemon;
  onPress?: () => void;
  onDelete?: () => void;
};

export function PokemonCard({ pokemon, onPress, onDelete }: PokemonCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(pokemon.id);

  const trailingAction = onDelete ? (
    <DeletePinButton onPress={onDelete} />
  ) : (
    <FavoriteButton isFavorite={favorited} onPress={() => toggleFavorite(pokemon.id)} />
  );

  return <PokemonListCard pokemon={pokemon} onPress={onPress} trailingAction={trailingAction} />;
}

function DeletePinButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Remove pin from map"
      className="size-8 items-center justify-center rounded-full border-[1.5px] border-white bg-black/30">
      <Trash2 size={16} color="#fff" strokeWidth={2} />
    </Pressable>
  );
}
