export class ZabanError extends Error {
  line: number;
  column: number;
  constructor(
    message: string,
    line: number,
    column: number
  ) {
    super(`Line ${line}, Column ${column}: ${message}`);
    this.line = line;
    this.column = column;
    this.name = "ZabanError";
  }
}
export function zabanError(message: string, line: number, column: number) : never {
  throw new ZabanError(message, line, column);
}
