type PokemonEntry = { name: string; cp: number };

export function parsePokemonText(rawText: string): PokemonEntry[] {
  const regex = /(.*)\sCP\s(\d+)/g;
  const entries: PokemonEntry[] = [];
  const seen = new Set<string>();

  if (!rawText) {
    return entries;
  }

  let match: RegExpExecArray | null;

  while ((match = regex.exec(rawText)) !== null) {
    const name = match[1]?.trim();
    const cp = Number(match[2]);

    if (!name || !Number.isFinite(cp)) {
      continue;
    }

    const key = `${name.toLowerCase()}|${cp}`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    entries.push({ name, cp });
  }

  return entries;
}
