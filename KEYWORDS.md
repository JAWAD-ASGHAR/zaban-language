# Zaban Keyword Reference (Urdu to English)

Keywords use **Roman Urdu** (Latin script) for terminal compatibility.

## Program structure

| Urdu | English | Usage |
|---|---|---|
| `shuru` | start | Begin program |
| `khatam` | end | End program |

Code outside `shuru` … `khatam` is ignored when those markers are present. Without them, the whole file runs as a program.

## Statements

| Urdu | English | Usage |
|---|---|---|
| `likho` | print | `likho "salam"` or `likho x, y` |
| `ye hai` | declare | `ye hai a = 10` |
| `=` / `+=` / `-=` | assign | `a = 5` or `b += 1` |
| `agar` | if | `agar (x < 5) { ... }` |
| `nahi to agar` | else if | chained after first `agar` |
| `jab tak` | while | `jab tak (b < 5) { ... }` |
| `bas` | break | exit loop |
| `agla` | continue | next iteration |

## Literals

| Urdu | English |
|---|---|
| `sach` | true |
| `jhoot` | false |
| `khaali` | null |

Numbers, `"strings"`, and operators (`+`, `-`, `*`, `/`, `==`, `!=`, `<`, `>`) work as usual. Semicolons are optional. No type annotations — values are dynamically typed.

## Example

```
shuru
  likho "Hello World"
  ye hai b = 0
  jab tak (b < 3) {
    likho b
    b += 1
  }
khatam
```

Output:

```
Hello World
0
1
2
```
