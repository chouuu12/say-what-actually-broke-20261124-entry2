// Say What Actually Broke — entry 2
// Reads line.txt, validates it (single line, 1-200 chars, not only whitespace),
// and writes it to $MAKEFUN_OUTPUT_DIR/entry.txt (default /output/entry.txt).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const line = readFileSync(join(here, "line.txt"), "utf8");

if (line.length < 1 || line.length > 200) {
  throw new Error(`line must be 1-200 characters, got ${line.length}`);
}
if (/[\r\n]/.test(line)) {
  throw new Error("line must be a single line");
}
if (line.trim().length === 0) {
  throw new Error("line must not be only whitespace");
}
// Reject control characters (other than none allowed here) so the gate's
// UTF-8 text check can never trip on an invisible byte, and verify the
// string survives a UTF-8 round-trip unchanged.
if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(line)) {
  throw new Error("line must not contain control characters");
}
if (Buffer.from(line, "utf8").toString("utf8") !== line) {
  throw new Error("line is not valid UTF-8 text");
}

const rawOutDir = (process.env.MAKEFUN_OUTPUT_DIR || "").trim();
const outDir = rawOutDir === "" ? "/output" : rawOutDir;
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, line, "utf8");
console.log(`wrote ${line.length} chars to ${outPath}`);
