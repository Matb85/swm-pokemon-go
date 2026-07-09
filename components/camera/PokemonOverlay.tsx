import { PokemonImage } from '@/components/pokemon/PokemonImage';
import { POKEMON_SPRITE_SIZE } from '@/lib/face-overlay';
import type { Pokemon } from '@/services/pokeapi';
import { View } from 'react-native';

type PokemonOverlayProps = {
  pokemon: Pokemon;
  spriteSize?: number;
  imageSize?: number;
};

export function PokemonOverlay({
  pokemon,
  spriteSize = POKEMON_SPRITE_SIZE,
  imageSize = 56,
}: PokemonOverlayProps) {
  return (
    <View className="size-full items-center justify-center">
      <View
        className="items-center justify-center rounded-2xl bg-white/90 shadow-lg"
        style={{
          width: spriteSize,
          height: spriteSize,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 6,
        }}>
        <PokemonImage uri={pokemon.image} id={pokemon.id} size={imageSize} />
      </View>
    </View>
  );
}
