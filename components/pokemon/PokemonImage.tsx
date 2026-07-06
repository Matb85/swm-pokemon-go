import { Image, type ImageTransition } from 'expo-image';

const FADE_TRANSITION: ImageTransition = {
  duration: 300,
  effect: 'cross-dissolve',
  timing: 'ease-out',
};

type PokemonImageProps = {
  uri: string;
  id: number;
  size: number;
};

export function PokemonImage({ uri, id, size }: PokemonImageProps) {
  return (
    <Image
      source={{ uri }}
      recyclingKey={String(id)}
      style={{ width: size, height: size }}
      contentFit="contain"
      transition={FADE_TRANSITION}
    />
  );
}
