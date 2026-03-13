"use client";

import * as React from "react";

const STORAGE_KEY = "pogo-collection";

export type PokemonDetails = {
  attack?: number;
  defense?: number;
  stamina?: number;
  level?: number;
  fastMove?: string;
  chargedMoves?: string[];
};

export type PokemonEntry = {
  id: string;
  name: string;
  cp: number;
  favorite: boolean;
  createdAt: number;
  spriteUrl?: string | null;
  details: PokemonDetails;
};

type CollectionContextValue = {
  collection: PokemonEntry[];
  addPokemon: (entries: Array<{ name: string; cp: number }>) => Promise<void>;
  updatePokemon: (id: string, patch: Partial<PokemonEntry>) => void;
  updatePokemonDetails: (id: string, patch: PokemonDetails) => void;
  toggleFavorite: (id: string) => void;
  replaceAll: (entries: PokemonEntry[]) => void;
  clearAll: () => void;
};

const CollectionContext = React.createContext<CollectionContextValue | undefined>(
  undefined
);

function formatNameForApi(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[\.']/g, "");
}

async function fetchSprite(name: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_POKEAPI_BASE_URL ?? "https://pokeapi.co/api/v2";
  try {
    const response = await fetch(
      `${baseUrl}/pokemon/${formatNameForApi(name)}`
    );
    if (!response.ok) return null;
    const data = (await response.json()) as {
      sprites?: { front_default?: string | null };
    };
    return data?.sprites?.front_default ?? null;
  } catch {
    return null;
  }
}

export function CollectionProvider({ children }: { children: React.ReactNode }) {
  const [collection, setCollection] = React.useState<PokemonEntry[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as PokemonEntry[];
        setCollection(parsed);
      } catch {
        setCollection([]);
      }
    }
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
  }, [collection, hydrated]);

  const addPokemon = React.useCallback(
    async (entries: Array<{ name: string; cp: number }>) => {
      const enriched = await Promise.all(
        entries.map(async (entry) => {
          const spriteUrl = await fetchSprite(entry.name);
          return {
            id: crypto.randomUUID(),
            name: entry.name,
            cp: entry.cp,
            favorite: false,
            createdAt: Date.now(),
            spriteUrl,
            details: {}
          } satisfies PokemonEntry;
        })
      );

      setCollection((prev) => [...enriched, ...prev]);
    },
    []
  );

  const updatePokemon = React.useCallback((id: string, patch: Partial<PokemonEntry>) => {
    setCollection((prev) =>
      prev.map((pokemon) => (pokemon.id === id ? { ...pokemon, ...patch } : pokemon))
    );
  }, []);

  const updatePokemonDetails = React.useCallback((id: string, patch: PokemonDetails) => {
    setCollection((prev) =>
      prev.map((pokemon) =>
        pokemon.id === id
          ? { ...pokemon, details: { ...pokemon.details, ...patch } }
          : pokemon
      )
    );
  }, []);

  const toggleFavorite = React.useCallback((id: string) => {
    setCollection((prev) =>
      prev.map((pokemon) =>
        pokemon.id === id ? { ...pokemon, favorite: !pokemon.favorite } : pokemon
      )
    );
  }, []);

  const replaceAll = React.useCallback((entries: PokemonEntry[]) => {
    setCollection(entries);
  }, []);

  const clearAll = React.useCallback(() => {
    setCollection([]);
  }, []);

  const value = React.useMemo(
    () => ({
      collection,
      addPokemon,
      updatePokemon,
      updatePokemonDetails,
      toggleFavorite,
      replaceAll,
      clearAll
    }),
    [
      collection,
      addPokemon,
      updatePokemon,
      updatePokemonDetails,
      toggleFavorite,
      replaceAll,
      clearAll
    ]
  );

  return (
    <CollectionContext.Provider value={value}>
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollection() {
  const context = React.useContext(CollectionContext);
  if (!context) {
    throw new Error("useCollection must be used within CollectionProvider");
  }
  return context;
}
