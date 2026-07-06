import { FAVORITES_KEY } from '@/lib/storage';
import { useCallback, useMemo } from 'react';
import { useMMKVObject } from 'react-native-mmkv';

const EMPTY_FAVORITE_IDS: number[] = [];

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useMMKVObject<number[]>(FAVORITES_KEY);

  const ids = favoriteIds ?? EMPTY_FAVORITE_IDS;

  const favoriteIdSet = useMemo(() => new Set(ids), [ids]);

  const isFavorite = useCallback((id: number) => favoriteIdSet.has(id), [favoriteIdSet]);

  const toggleFavorite = useCallback(
    (id: number) => {
      const current = favoriteIds ?? EMPTY_FAVORITE_IDS;
      if (current.includes(id)) {
        setFavoriteIds(current.filter((item) => item !== id));
      } else {
        setFavoriteIds([...current, id]);
      }
    },
    [favoriteIds, setFavoriteIds]
  );

  return {
    favoriteIds: ids,
    favoriteIdSet,
    isFavorite,
    toggleFavorite,
  };
}
