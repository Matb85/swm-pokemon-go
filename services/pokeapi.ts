const POKEAPI_BASE = 'https://pokeapi.co/api/v2';

export type Pokemon = {
  id: number;
  name: string;
  image: string;
  types: string[];
};

type PokemonPageResult = {
  name: string;
  url: string;
};

function extractIdFromUrl(url: string) {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? Number.parseInt(match[1], 10) : 0;
}

export async function fetchPokemonPage(offset: number, limit = 20) {
  const response = await fetch(
    `${POKEAPI_BASE}/pokemon?limit=${limit}&offset=${offset}`
  );
  const data = await response.json();

  return {
    results: data.results as PokemonPageResult[],
    hasMore: Boolean(data.next),
  };
}

export async function fetchPokemon(id: number): Promise<Pokemon> {
  const response = await fetch(`${POKEAPI_BASE}/pokemon/${id}`);
  const data = await response.json();

  return {
    id: data.id,
    name: data.name,
    image:
      data.sprites.other?.['official-artwork']?.front_default ??
      data.sprites.front_default,
    types: data.types.map((entry: { type: { name: string } }) => entry.type.name),
  };
}

export async function fetchPokemonListWithDetails(offset: number, limit = 20) {
  const page = await fetchPokemonPage(offset, limit);
  const ids = page.results
    .map((result) => extractIdFromUrl(result.url))
    .filter((id) => id > 0);

  const pokemon = await Promise.all(ids.map((id) => fetchPokemon(id)));

  return {
    pokemon,
    hasMore: page.hasMore,
  };
}

export async function fetchPokemonByIds(ids: number[]): Promise<Pokemon[]> {
  if (ids.length === 0) return [];

  const pokemon = await Promise.all(ids.map((id) => fetchPokemon(id)));
  return pokemon;
}
