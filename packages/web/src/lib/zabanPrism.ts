import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";

const ZABAN_KEYWORDS =
  /\b(?:nahi to agar|nahi to|ye hai|jab tak|shuru|khatam|likho|agar|warna|bas|agla|sach|jhoot|khaali|nahi|ye|hai|to|jab|tak)\b/;

languages.zaban = {
  comment: {
    pattern: /#.*/,
  },
  string: {
    pattern: /"(?:\\.|[^"\\])*"/,
    greedy: true,
  },
  number: {
    pattern: /\b\d+(?:\.\d+)?\b/,
  },
  keyword: ZABAN_KEYWORDS,
  operator: /(?:==|!=|<=|>=|\+=|-=|\*=|\/=|[+\-*/%=<>!])/,
  punctuation: /[{}();,.]/,
};

export function highlightZaban(code: string): string {
  return highlight(code, languages.zaban, "zaban");
}
