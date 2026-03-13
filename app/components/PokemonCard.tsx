"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

import type { PokemonEntry } from "@/app/context/collection-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PokemonCardProps {
  pokemon: PokemonEntry;
  onToggleFavorite: (id: string) => void;
}

export function PokemonCard({ pokemon, onToggleFavorite }: PokemonCardProps) {
  return (
    <Card className="group relative overflow-hidden border bg-card">
      <div className="absolute right-3 top-3 z-10">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={(event) => {
            event.preventDefault();
            onToggleFavorite(pokemon.id);
          }}
          aria-label={pokemon.favorite ? "Remove favorite" : "Mark as favorite"}
        >
          <Star
            className={
              "h-4 w-4 " +
              (pokemon.favorite
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground")
            }
          />
        </Button>
      </div>
      <Link href={`/pokemon/${pokemon.id}`} className="block">
        <div className="relative flex h-36 w-full items-center justify-center bg-muted/50">
          {pokemon.spriteUrl ? (
            <Image
              src={pokemon.spriteUrl}
              alt={pokemon.name}
              width={120}
              height={120}
              className="h-24 w-24 object-contain transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="h-20 w-20 rounded-full bg-muted" />
          )}
        </div>
        <div className="space-y-1 p-4">
          <p className="text-sm text-muted-foreground">CP {pokemon.cp}</p>
          <h3 className="text-lg font-semibold capitalize">{pokemon.name}</h3>
        </div>
      </Link>
    </Card>
  );
}
