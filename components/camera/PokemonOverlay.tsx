import { PokemonImage } from '@/components/pokemon/PokemonImage';
import { POKEMON_SPRITE_SIZE } from '@/lib/face-overlay';
import type { Pokemon } from '@/services/pokeapi';
import { View } from 'react-native';

type PokemonOverlayProps = {
  pokemon: Pokemon;
};

export function PokemonOverlay({ pokemon }: PokemonOverlayProps) {
  return (
    <View className="size-full items-center justify-center">
      <View
        className="items-center justify-center rounded-2xl bg-white/90 shadow-lg"
        style={{
          width: POKEMON_SPRITE_SIZE,
          height: POKEMON_SPRITE_SIZE,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 6,
        }}>
        <PokemonImage uri={pokemon.image} id={pokemon.id} size={56} />
      </View>
    </View>
  );
}
