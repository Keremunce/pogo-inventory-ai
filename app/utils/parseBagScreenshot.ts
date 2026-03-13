export type BagEntry = { name: string; cp: number };

export function parseBagScreenshot(text: string): BagEntry[] {
  const regex = /(.*)\sCP\s(\d+)/g;
  const entries: BagEntry[] = [];
  const seen = new Set<string>();

  if (!text) return entries;

  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    const name = match[1]?.trim();
    const cp = Number(match[2]);

    if (!name || !Number.isFinite(cp)) continue;

    const key = `${name.toLowerCase()}|${cp}`;
    if (seen.has(key)) continue;

    seen.add(key);
    entries.push({ name, cp });
  }

  return entries;
}
