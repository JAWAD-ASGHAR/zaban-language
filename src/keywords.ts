export const KEYWORDS = [
  "shuru",
  "khatam",
  "ye",
  "hai",
  "likho",
  "agar",
  "nahi",
  "to",
  "warna",
  "jab",
  "tak",
  "ghoomo",
  "bas",
  "agla",
  "sach",
  "jhoot",
  "khaali",
];

export type KeywordUnion = (typeof KEYWORDS)[number];

export const KEYWORD_SET = new Set<KeywordUnion>(KEYWORDS);

export function isKeyword(word: string): word is KeywordUnion {
  return KEYWORD_SET.has(word as KeywordUnion);
}
