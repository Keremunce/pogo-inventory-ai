"use client";

import * as React from "react";

import { useCollection } from "@/app/context/collection-context";
import { useTheme } from "@/app/context/theme-context";
import { exportJson } from "@/app/utils/exportJson";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const { collection, replaceAll, clearAll } = useCollection();
  const { isDark, setTheme } = useTheme();
  const [error, setError] = React.useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement | null>(null);

  const handleImport = async (file: File | null) => {
    if (!file) return;
    setError(null);

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      if (!Array.isArray(parsed)) {
        throw new Error("Invalid data");
      }

      const sanitized = parsed
        .filter((entry) => entry && entry.id && entry.name)
        .map((entry) => ({
          id: entry.id,
          name: entry.name,
          cp: Number(entry.cp) || 0,
          favorite: Boolean(entry.favorite),
          createdAt: Number(entry.createdAt) || Date.now(),
          spriteUrl: entry.spriteUrl ?? null,
          details: entry.details ?? {}
        }));

      replaceAll(sanitized);
    } catch {
      setError("Import failed. Please upload a valid JSON export.");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 px-4 py-10 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="space-y-2">
          <p className="text-sm text-muted-foreground">Preferences</p>
          <h1 className="text-3xl font-semibold sm:text-4xl">Settings</h1>
        </header>

        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Action needed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Dark mode</p>
              <p className="text-xs text-muted-foreground">
                Toggle the UI theme.
              </p>
            </div>
            <Switch
              checked={isDark}
              onCheckedChange={(value) => setTheme(value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={() => exportJson(collection)}>
                Export JSON
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileRef.current?.click()}
              >
                Import JSON
              </Button>
              <Button type="button" variant="destructive" onClick={clearAll}>
                Clear all data
              </Button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(event) => handleImport(event.target.files?.[0] ?? null)}
            />
            <p className="text-xs text-muted-foreground">
              Export your local collection, import it on another device, or clear
              everything.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
