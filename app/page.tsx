"use client";

import * as React from "react";

import { PokemonCard } from "@/app/components/PokemonCard";
import { OcrUploader } from "@/app/components/OcrUploader";
import { useCollection } from "@/app/context/collection-context";
import { parseBagScreenshot } from "@/app/utils/parseBagScreenshot";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const sortOptions = [
  { value: "cp", label: "CP descending" },
  { value: "name", label: "Name A-Z" },
  { value: "recent", label: "Recently added" }
] as const;

type SortOption = (typeof sortOptions)[number]["value"];

export default function ListingPage() {
  const { collection, addPokemon, toggleFavorite } = useCollection();
  const [search, setSearch] = React.useState("");
  const [sortBy, setSortBy] = React.useState<SortOption>("cp");
  const [error, setError] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    const base = term
      ? collection.filter((pokemon) => pokemon.name.toLowerCase().includes(term))
      : collection;

    const sorted = [...base];

    if (sortBy === "cp") {
      sorted.sort((a, b) => b.cp - a.cp);
    } else if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      sorted.sort((a, b) => b.createdAt - a.createdAt);
    }

    return sorted;
  }, [collection, search, sortBy]);

  const handleOcrText = async (text: string) => {
    setError(null);
    const entries = parseBagScreenshot(text);
    if (entries.length === 0) {
      setError("No Pokemon detected. Try a clearer bag screenshot.");
      return;
    }
    await addPokemon(entries);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 px-4 py-10 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Local Pokemon Collection
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            Pokebag Manager
          </h1>
          <p className="text-sm text-muted-foreground">
            Capture bag screenshots, manage favorites, and keep everything local.
          </p>
        </header>

        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Add via OCR</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <OcrUploader
              label="Upload bag screenshot"
              onText={handleOcrText}
              onError={setError}
            />
            <p className="text-xs text-muted-foreground">
              Bag OCR extracts name + CP and adds to your collection.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Collection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Input
                placeholder="Search by name"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="sm:max-w-xs"
              />
              <div className="flex flex-wrap items-center gap-2">
                {sortOptions.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={sortBy === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortBy(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No Pokemon yet. Upload a bag screenshot to get started.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((pokemon) => (
                  <PokemonCard
                    key={pokemon.id}
                    pokemon={pokemon}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
