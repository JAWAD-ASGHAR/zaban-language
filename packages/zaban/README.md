# Zaban

Urdu programming language — Roman Urdu keywords, dynamically typed, `.zbn` files.

**Playground:** [github.com/JAWAD-ASGHAR/zaban-language](https://github.com/JAWAD-ASGHAR/zaban-language)

## Install

```bash
npm i zaban-lang
```

## CLI

```bash
npx zaban run program.zbn
npx zaban help
```

Global install (optional):

```bash
npm i -g zaban-lang
zaban run program.zbn
```

## Library

```typescript
import { runSource } from "zaban-lang";

const lines = runSource(`
  shuru
    likho "Salam Dunya"
  khatam
`);

console.log(lines.join("\n"));
```

## Exports

```typescript
import {
  runSource,
  Interpreter,
  tokenize,
  Parser,
  KEYWORDS,
  ZabanError,
} from "zaban-lang";
```

---

## Program structure

| Urdu | English | Usage |
|---|---|---|
| `shuru` | start | Begin program block |
| `khatam` | end | End program block |

- When both `shuru` and `khatam` are present, only code between them runs.
- Without markers, the entire file is treated as a program.
- Semicolons are optional. No type annotations — values are dynamically typed.
- Variables declared inside `{ }` blocks are scoped to that block.

---

## Statements

| Urdu | English | Usage |
|---|---|---|
| `likho` | print | `likho "salam"` or `likho x, y` |
| `ye hai` | declare | `ye hai a = 10` |
| `=` / `+=` / `-=` / `*=` / `/=` | assign | `a = 5`, `b += 1` |
| `agar` | if | `agar (x < 5) { ... }` |
| `nahi to agar` | else if | chained after first `agar` |
| `nahi to` / `warna` | else | `nahi to { ... }` or `warna { ... }` |
| `jab tak` | while | `jab tak (b < 5) { ... }` |
| `bas` | break | exit loop immediately |
| `agla` | continue | skip to next iteration |

---

## Literals

| Urdu | English | Notes |
|---|---|---|
| `sach` | true | Boolean |
| `jhoot` | false | Boolean |
| `khaali` | null | Empty value |
| `42`, `3.14` | number | Integers and decimals |
| `"hello"` | string | Double-quoted text |

---

## Operators

| Category | Symbols | Notes |
|---|---|---|
| Arithmetic | `+` `-` `*` `/` | Standard precedence |
| Comparison | `<` `>` `<=` `>=` | Returns `sach` or `jhoot` |
| Equality | `==` `!=` | Loose equality |
| Unary | `-` | e.g. `-5` or `-(a + b)` |
| Assignment | `=` `+=` `-=` `*=` `/=` | Update variables |

---

## Examples

### Hello World

```
shuru
  likho "Salam Dunya"
khatam
```

Output: `Salam Dunya`

### Variables & loop

```
shuru
  ye hai i = 0
  jab tak (i < 3) {
    likho i
    i += 1
  }
khatam
```

Output:

```
0
1
2
```

### If / else if / else

```
shuru
  ye hai score = 50

  agar (score >= 90) {
    likho "A"
  } nahi to agar (score >= 80) {
    likho "B"
  } nahi to {
    likho "Fail"
  }
khatam
```

Output: `Fail`

### Arithmetic

```
shuru
  ye hai result = 3 + 4 * 5
  likho result
khatam
```

Output: `23`

### Booleans & null

```
shuru
  ye hai active = sach
  ye hai deleted = jhoot
  ye hai user = khaali

  likho active
  likho deleted
  likho user
khatam
```

Output:

```
true
false
null
```

### Comparison

```
shuru
  ye hai a = 10
  ye hai b = 20

  likho a < b
  likho a > b
  likho a == b
  likho a != b
khatam
```

Output:

```
true
false
false
true
```

### Compound assignment

```
shuru
  ye hai score = 10
  score += 5
  score -= 2
  score *= 3
  score /= 2
  likho score
khatam
```

Output: `19.5`

### Nested if

```
shuru
  ye hai age = 20
  ye hai score = 90

  agar (age >= 18) {
    agar (score >= 80) {
      likho "Eligible"
    }
  }
khatam
```

Output: `Eligible`

### Nested loops

```
shuru
  ye hai i = 0
  jab tak (i < 3) {
    ye hai j = 0
    jab tak (j < 2) {
      likho j
      j += 1
    }
    i += 1
  }
khatam
```

Output:

```
0
1
0
1
0
1
```

### If inside loop

```
shuru
  ye hai a = 3
  ye hai b = 0

  jab tak (b < 5) {
    agar (b == a) {
      likho "b barabar a hai"
    } nahi to agar (b == 0) {
      likho "b sifar hai"
    } nahi to {
      likho b
    }
    b += 1
  }
khatam
```

Output:

```
b sifar hai
1
2
b barabar a hai
4
```

More sample programs: [examples on GitHub](https://github.com/JAWAD-ASGHAR/zaban-language/tree/main/packages/zaban/examples)

---

## Error messages

Errors include line and column numbers, e.g. `Line 3, Col 5: Variable 'x' mojood nahi`.

Common messages (Roman Urdu):

- `Variable 'x' mojood nahi` — variable not defined
- `Variable 'x' pehle se mojood hai` — variable already declared
- `Zero se divide nahi ho sakta` — division by zero
- `String band nahi hui` — unclosed string

---

## License

MIT
