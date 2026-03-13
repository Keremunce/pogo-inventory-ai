import type { PokemonDetails } from "@/app/context/collection-context";

export function parseDetailScreenshot(text: string): PokemonDetails {
  if (!text) return {};

  const normalized = text.replace(/\s+/g, " ").trim();

  const attackMatch = normalized.match(/(?:ATK|ATTACK)\s*(\d{1,2})/i);
  const defenseMatch = normalized.match(/(?:DEF|DEFENSE)\s*(\d{1,2})/i);
  const staminaMatch = normalized.match(/(?:STA|STAMINA|HP)\s*(\d{1,2})/i);
  const levelMatch = normalized.match(/(?:LV|LEVEL)\s*(\d{1,2})/i);

  const fastMoveMatch = normalized.match(/FAST MOVE\s*([A-Za-z \-']{3,})/i);
  const chargedMoveMatches = Array.from(
    normalized.matchAll(/CHARGED MOVE\s*([A-Za-z \-']{3,})/gi)
  );

  const chargedMoves = chargedMoveMatches
    .map((match) => match[1]?.trim())
    .filter(Boolean) as string[];

  return {
    attack: attackMatch ? Number(attackMatch[1]) : undefined,
    defense: defenseMatch ? Number(defenseMatch[1]) : undefined,
    stamina: staminaMatch ? Number(staminaMatch[1]) : undefined,
    level: levelMatch ? Number(levelMatch[1]) : undefined,
    fastMove: fastMoveMatch ? fastMoveMatch[1].trim() : undefined,
    chargedMoves: chargedMoves.length ? chargedMoves : undefined
  };
}
