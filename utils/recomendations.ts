import { HerbalRecommendation } from "@/type";

export function parseRecommendation(raw: string): HerbalRecommendation[] {
  const entries = raw.split(/\n\n+/); // Split by double newlines
  const results: HerbalRecommendation[] = [];

  for (const block of entries) {
    const lines = block.split("\n");
    const herbLine = lines.find((l) => l.toLowerCase().startsWith("herb:"));
    const effectLine = lines.find((l) => l.toLowerCase().startsWith("effect:"));
    const dosageLine = lines.find((l) => l.toLowerCase().startsWith("dosage:"));

    if (herbLine && effectLine && dosageLine) {
      results.push({
        herb: herbLine.replace(/herb:/i, "").trim(),
        effect: effectLine.replace(/effect:/i, "").trim(),
        dosage: dosageLine.replace(/dosage:/i, "").trim(),
      });
    }
  }

  return results;
}