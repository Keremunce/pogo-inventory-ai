"use client";

import * as React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

import { OcrUploader } from "@/app/components/OcrUploader";
import { useCollection } from "@/app/context/collection-context";
import { parseDetailScreenshot } from "@/app/utils/parseDetailScreenshot";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function PokemonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { collection, updatePokemon, updatePokemonDetails } = useCollection();
  const [isEditing, setIsEditing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const pokemon = collection.find((entry) => entry.id === id);

  const [formState, setFormState] = React.useState({
    cp: "",
    attack: "",
    defense: "",
    stamina: "",
    level: "",
    fastMove: "",
    chargedMoves: ""
  });

  React.useEffect(() => {
    if (!pokemon) return;
    setFormState({
      cp: pokemon.cp.toString(),
      attack: pokemon.details.attack?.toString() ?? "",
      defense: pokemon.details.defense?.toString() ?? "",
      stamina: pokemon.details.stamina?.toString() ?? "",
      level: pokemon.details.level?.toString() ?? "",
      fastMove: pokemon.details.fastMove ?? "",
      chargedMoves: pokemon.details.chargedMoves?.join(", ") ?? ""
    });
  }, [pokemon]);

  if (!pokemon) {
    return (
      <main className="min-h-screen px-4 py-10">
        <div className="mx-auto max-w-2xl">
          <Alert variant="destructive">
            <AlertTitle>Pokemon not found</AlertTitle>
            <AlertDescription>
              This Pokemon does not exist in your local collection.
            </AlertDescription>
          </Alert>
        </div>
      </main>
    );
  }

  const handleSave = () => {
    const cp = Number(formState.cp) || pokemon.cp;
    updatePokemon(pokemon.id, { cp });

    updatePokemonDetails(pokemon.id, {
      attack: formState.attack ? Number(formState.attack) : undefined,
      defense: formState.defense ? Number(formState.defense) : undefined,
      stamina: formState.stamina ? Number(formState.stamina) : undefined,
      level: formState.level ? Number(formState.level) : undefined,
      fastMove: formState.fastMove.trim() || undefined,
      chargedMoves: formState.chargedMoves
        ? formState.chargedMoves.split(",").map((move) => move.trim())
        : undefined
    });

    setIsEditing(false);
  };

  const handleOcrText = (text: string) => {
    setError(null);
    const details = parseDetailScreenshot(text);
    if (!Object.keys(details).length) {
      setError("No detail data detected. Try a clearer detail screenshot.");
      return;
    }
    updatePokemonDetails(pokemon.id, details);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 px-4 py-10 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Pokemon Detail</p>
            <h1 className="text-2xl font-semibold capitalize sm:text-3xl">
              {pokemon.name}
            </h1>
          </div>
          <Button type="button" variant="outline" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </header>

        {error ? (
          <Alert variant="destructive">
            <AlertTitle>OCR issue</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <Card>
          <CardContent className="flex flex-col gap-6 py-6 sm:flex-row sm:items-center">
            <div className="flex h-40 w-40 items-center justify-center rounded-2xl bg-muted/60">
              {pokemon.spriteUrl ? (
                <Image
                  src={pokemon.spriteUrl}
                  alt={pokemon.name}
                  width={160}
                  height={160}
                  className="h-28 w-28 object-contain"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-muted" />
              )}
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">CP</p>
              <p className="text-3xl font-semibold">{pokemon.cp}</p>
              <p className="text-sm text-muted-foreground">
                Added {new Date(pokemon.createdAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Stats</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "IV Attack", value: pokemon.details.attack },
              { label: "IV Defense", value: pokemon.details.defense },
              { label: "IV Stamina", value: pokemon.details.stamina },
              { label: "Level", value: pokemon.details.level },
              { label: "Fast Move", value: pokemon.details.fastMove },
              {
                label: "Charged Moves",
                value: pokemon.details.chargedMoves?.join(", ")
              }
            ].map((item) => (
              <div key={item.label} className="rounded-lg border p-4">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-base font-medium">
                  {item.value === undefined || item.value === "" ? "—" : item.value}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {isEditing ? (
          <Card>
            <CardHeader>
              <CardTitle>Edit Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  type="number"
                  value={formState.cp}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, cp: event.target.value }))
                  }
                  placeholder="CP"
                />
                <Input
                  type="number"
                  value={formState.level}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, level: event.target.value }))
                  }
                  placeholder="Level"
                />
                <Input
                  type="number"
                  value={formState.attack}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, attack: event.target.value }))
                  }
                  placeholder="IV Attack"
                />
                <Input
                  type="number"
                  value={formState.defense}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, defense: event.target.value }))
                  }
                  placeholder="IV Defense"
                />
                <Input
                  type="number"
                  value={formState.stamina}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, stamina: event.target.value }))
                  }
                  placeholder="IV Stamina"
                />
              </div>
              <Input
                value={formState.fastMove}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, fastMove: event.target.value }))
                }
                placeholder="Fast Move"
              />
              <Input
                value={formState.chargedMoves}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, chargedMoves: event.target.value }))
                }
                placeholder="Charged Moves (comma separated)"
              />
              <div className="flex flex-wrap gap-2">
                <Button type="button" onClick={handleSave}>
                  Save updates
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Detail OCR</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <OcrUploader
              label="Upload detail screenshot"
              onText={handleOcrText}
              onError={setError}
            />
            <p className="text-xs text-muted-foreground">
              OCR will attempt to fill IVs, level, and moves for this Pokemon.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
