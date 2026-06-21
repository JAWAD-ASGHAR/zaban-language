import { describe, it, expect } from "vitest";
import { runSource } from "../src/interpreter.js";

describe("interpreter", () => {
  it("runs hello world", () => {
    const output = runSource(`
      shuru
        likho "Salam Dunya"
      khatam
    `);
    expect(output).toEqual(["Salam Dunya"]);
  });

  it("runs variable declaration and print", () => {
    const output = runSource(`
      shuru
        ye hai x = 10
        likho x
      khatam
    `);
    expect(output).toEqual(["10"]);
  });

  it("runs arithmetic with precedence", () => {
    const output = runSource(`
      shuru
        ye hai result = 3 + 4 * 5
        likho result
      khatam
    `);
    expect(output).toEqual(["23"]);
  });

  it("runs assignment operators", () => {
    const output = runSource(`
      shuru
        ye hai score = 10
        score += 5
        score -= 2
        score *= 3
        score /= 2
        likho score
      khatam
    `);
    expect(output).toEqual(["19.5"]);
  });

  it("runs while loop", () => {
    const output = runSource(`
      shuru
        ye hai i = 0
        jab tak (i < 3) {
          likho i
          i += 1
        }
      khatam
    `);
    expect(output).toEqual(["0", "1", "2"]);
  });

  it("runs if/else-if/else chain", () => {
    const output = runSource(`
      shuru
        ye hai score = 85
        agar (score >= 90) {
          likho "A"
        } nahi to agar (score >= 80) {
          likho "B"
        } nahi to {
          likho "Fail"
        }
      khatam
    `);
    expect(output).toEqual(["B"]);
  });

  it("runs warna else branch", () => {
    const output = runSource(`
      shuru
        ye hai x = 1
        agar (x == 2) {
          likho "yes"
        } warna {
          likho "no"
        }
      khatam
    `);
    expect(output).toEqual(["no"]);
  });

  it("runs boolean and null literals", () => {
    const output = runSource(`
      shuru
        ye hai t = sach
        ye hai f = jhoot
        ye hai n = khaali
        likho t, f, n
      khatam
    `);
    expect(output).toEqual(["true", "false", "null"]);
  });

  it("runs unary minus", () => {
    const output = runSource(`
      shuru
        ye hai x = -(3 + 2)
        likho x
      khatam
    `);
    expect(output).toEqual(["-5"]);
  });

  it("runs break in while loop", () => {
    const output = runSource(`
      shuru
        ye hai i = 0
        jab tak (sach) {
          likho i
          i += 1
          agar (i == 2) {
            bas
          }
        }
      khatam
    `);
    expect(output).toEqual(["0", "1"]);
  });

  it("runs continue in while loop", () => {
    const output = runSource(`
      shuru
        ye hai i = 0
        jab tak (i < 4) {
          i += 1
          agar (i == 2) {
            agla
          }
          likho i
        }
      khatam
    `);
    expect(output).toEqual(["1", "3", "4"]);
  });

  it("runs big_demo example", () => {
    const output = runSource(`
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
    `);
    expect(output).toEqual([
      "b sifar hai",
      "1",
      "2",
      "b barabar a hai",
      "4",
    ]);
  });

  it("throws on undefined variable", () => {
    expect(() =>
      runSource(`
        shuru
          likho x
        khatam
      `)
    ).toThrow(/mojood nahi/);
  });

  it("throws on divide by zero", () => {
    expect(() =>
      runSource(`
        shuru
          ye hai x = 1 / 0
        khatam
      `)
    ).toThrow(/Zero se divide/);
  });
});
