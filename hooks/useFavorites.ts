import { FAVORITES_KEY } from '@/lib/storage';
import { useMMKVObject } from 'react-native-mmkv';

const EMPTY_FAVORITE_IDS: number[] = [];

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useMMKVObject<number[]>(FAVORITES_KEY);

  const ids = favoriteIds ?? EMPTY_FAVORITE_IDS;
  const favoriteIdSet = new Set(ids);

  const isFavorite = (id: number) => favoriteIdSet.has(id);

  const toggleFavorite = (id: number) => {
    const current = favoriteIds ?? EMPTY_FAVORITE_IDS;
    if (current.includes(id)) {
      setFavoriteIds(current.filter((item) => item !== id));
    } else {
      setFavoriteIds([...current, id]);
    }
  };

  return {
    favoriteIds: ids,
    favoriteIdSet,
    isFavorite,
    toggleFavorite,
  };
}
