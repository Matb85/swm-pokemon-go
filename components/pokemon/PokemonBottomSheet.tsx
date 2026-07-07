import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {
  createContext,
  forwardRef,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PokemonDetailContent } from '@/components/pokemon/PokemonDetailContent';
import { fetchPokemon } from '@/services/pokeapi';

const TAB_BAR_HEIGHT = 72;

export type PokemonBottomSheetRef = {
  present: (id: number) => void;
  dismiss: () => void;
};

type PokemonBottomSheetContextValue = {
  openPokemon: (id: number) => void;
};

const PokemonBottomSheetContext = createContext<PokemonBottomSheetContextValue | null>(null);

export function usePokemonBottomSheet() {
  const context = useContext(PokemonBottomSheetContext);
  if (!context) {
    throw new Error('usePokemonBottomSheet must be used within PokemonBottomSheetProvider');
  }
  return context;
}

export function PokemonBottomSheetProvider({ children }: { children: ReactNode }) {
  const sheetRef = useRef<PokemonBottomSheetRef>(null);

  const openPokemon = useCallback((id: number) => {
    sheetRef.current?.present(id);
  }, []);

  const value = useMemo(() => ({ openPokemon }), [openPokemon]);

  return (
    <PokemonBottomSheetContext.Provider value={value}>
      {children}
      <PokemonBottomSheet ref={sheetRef} />
    </PokemonBottomSheetContext.Provider>
  );
}

export const PokemonBottomSheet = forwardRef<PokemonBottomSheetRef>(
  function PokemonBottomSheet(_, ref) {
    const insets = useSafeAreaInsets();
    const sheetRef = useRef<BottomSheetModal>(null);
    const [pokemonId, setPokemonId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [pokemon, setPokemon] = useState<Awaited<ReturnType<typeof fetchPokemon>> | null>(null);

    const snapPoints = useMemo(() => ['55%', '90%'], []);

    useImperativeHandle(ref, () => ({
      present(id: number) {
        setPokemonId(id);
        sheetRef.current?.present();
      },
      dismiss() {
        sheetRef.current?.dismiss();
      },
    }));

    useEffect(() => {
      if (pokemonId === null) return;

      setLoading(true);
      setPokemon(null);

      fetchPokemon(pokemonId)
        .then(setPokemon)
        .finally(() => setLoading(false));
    }, [pokemonId]);

    const tabBarInset = TAB_BAR_HEIGHT + insets.bottom;

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.45}
          style={{ bottom: tabBarInset }}
        />
      ),
      [tabBarInset]
    );

    const handleDismiss = useCallback(() => {
      setPokemonId(null);
      setPokemon(null);
    }, []);

    return (
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        bottomInset={tabBarInset}
        onDismiss={handleDismiss}
        backgroundStyle={{ borderRadius: 20 }}
        handleIndicatorStyle={{ backgroundColor: '#e6e6e6', width: 40 }}>
        <BottomSheetScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}>
          <PokemonDetailContent pokemon={pokemon} loading={loading} />
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);
