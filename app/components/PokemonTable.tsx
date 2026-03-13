"use client";

import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface PokemonEntry {
  name: string;
  cp: number;
}

interface PokemonTableProps {
  data: PokemonEntry[];
  search: string;
  onSearchChange: (value: string) => void;
}

export function PokemonTable({ data, search, onSearchChange }: PokemonTableProps) {
  const filtered = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return data;
    return data.filter((entry) => entry.name.toLowerCase().includes(term));
  }, [data, search]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>3. Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Search Pokemon by name"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />

        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">No matches found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">CP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((entry) => (
                <TableRow key={`${entry.name}-${entry.cp}`}>
                  <TableCell className="font-medium">{entry.name}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {entry.cp}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
