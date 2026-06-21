export const DEFAULT_CODE = `shuru
  likho "Salam Dunya"

  ye hai i = 0
  jab tak (i < 3) {
    likho i
    i += 1
  }
khatam`;

export const GITHUB_URL = "https://github.com/JAWAD-ASGHAR/zaban-language";
export const NPM_URL = "https://www.npmjs.com/package/zaban-lang";
export const NPM_INSTALL = "npm i zaban-lang";
export const NPM_PACKAGE = "zaban-lang";

export const CREATORS = [
  { name: "Jawad", linkedin: "https://www.linkedin.com/in/jawad-a-dev/" },
  { name: "Abdullah Razi", linkedin: "https://www.linkedin.com/in/abdullah-razi-a7b566324/" },
] as const;

export const PROGRAM_STRUCTURE = [
  { urdu: "shuru", english: "start", usage: "Begin program block" },
  { urdu: "khatam", english: "end", usage: "End program block" },
] as const;

export const STATEMENTS = [
  { urdu: "likho", english: "print", usage: 'likho "salam" or likho x, y' },
  { urdu: "ye hai", english: "declare", usage: "ye hai a = 10" },
  { urdu: "= / += / -= / *= / /=", english: "assign", usage: "a = 5 or b += 1" },
  { urdu: "agar", english: "if", usage: "agar (x < 5) { ... }" },
  { urdu: "nahi to agar", english: "else if", usage: "chained after first agar" },
  { urdu: "nahi to / warna", english: "else", usage: "nahi to { ... } or warna { ... }" },
  { urdu: "jab tak", english: "while", usage: "jab tak (b < 5) { ... }" },
  { urdu: "bas", english: "break", usage: "exit loop immediately" },
  { urdu: "agla", english: "continue", usage: "skip to next loop iteration" },
] as const;

export const LITERALS = [
  { urdu: "sach", english: "true", usage: "Boolean true" },
  { urdu: "jhoot", english: "false", usage: "Boolean false" },
  { urdu: "khaali", english: "null", usage: "Empty / null value" },
  { urdu: "42, 3.14", english: "number", usage: "Integers and decimals" },
  { urdu: '"hello"', english: "string", usage: "Double-quoted text" },
] as const;

export const OPERATORS = [
  { category: "Arithmetic", symbols: "+  -  *  /", note: "Standard precedence (* and / before + and -)" },
  { category: "Comparison", symbols: "<  >  <=  >=", note: "Return sach or jhoot" },
  { category: "Equality", symbols: "==  !=", note: "Loose equality" },
  { category: "Unary", symbols: "-", note: "Unary minus on numbers, e.g. -5 or -(a + b)" },
  { category: "Assignment", symbols: "=  +=  -=  *=  /=", note: "Update existing variables" },
] as const;

export const DOC_NOTES = [
  "Keywords use Roman Urdu (Latin script) for terminal compatibility.",
  "Wrap programs in shuru … khatam. Code outside those markers is ignored when both are present.",
  "Without shuru/khatam, the entire file runs as a program.",
  "Semicolons are optional. No type annotations — values are dynamically typed.",
  "Use blocks { } for if, else, and loop bodies. Variables declared inside a block are scoped to it.",
] as const;

export type DocExample = {
  title: string;
  description: string;
  code: string;
  output: string;
};

export const DOC_EXAMPLES: DocExample[] = [
  {
    title: "Hello World",
    description: "Print a greeting with likho.",
    code: `shuru
  likho "Salam Dunya"
khatam`,
    output: "Salam Dunya",
  },
  {
    title: "Variables & loops",
    description: "Declare with ye hai and count with jab tak.",
    code: `shuru
  ye hai i = 0
  jab tak (i < 3) {
    likho i
    i += 1
  }
khatam`,
    output: "0\n1\n2",
  },
  {
    title: "If / else if / else",
    description: "Branch on conditions with agar and nahi to agar.",
    code: `shuru
  ye hai score = 50

  agar (score >= 90) {
    likho "A"
  } nahi to agar (score >= 80) {
    likho "B"
  } nahi to {
    likho "Fail"
  }
khatam`,
    output: "Fail",
  },
  {
    title: "Arithmetic",
    description: "Operators follow standard precedence.",
    code: `shuru
  ye hai result = 3 + 4 * 5
  likho result
khatam`,
    output: "23",
  },
  {
    title: "Booleans & null",
    description: "Use sach, jhoot, and khaali as literals.",
    code: `shuru
  ye hai active = sach
  ye hai deleted = jhoot
  ye hai user = khaali

  likho active
  likho deleted
  likho user
khatam`,
    output: "true\nfalse\nnull",
  },
  {
    title: "Comparison",
    description: "Compare values with ==, !=, <, and >.",
    code: `shuru
  ye hai a = 10
  ye hai b = 20

  likho a < b
  likho a == b
khatam`,
    output: "true\nfalse",
  },
  {
    title: "Compound assignment",
    description: "Update variables with +=, -=, *=, /=.",
    code: `shuru
  ye hai score = 10
  score += 5
  score -= 2
  score *= 3
  score /= 2
  likho score
khatam`,
    output: "19.5",
  },
  {
    title: "Nested loops",
    description: "Loops inside loops for grid-like output.",
    code: `shuru
  ye hai i = 0
  jab tak (i < 3) {
    ye hai j = 0
    jab tak (j < 2) {
      likho j
      j += 1
    }
    i += 1
  }
khatam`,
    output: "0\n1\n0\n1\n0\n1",
  },
];
