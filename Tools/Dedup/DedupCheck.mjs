/** Dedup check: scans Source/ for duplicate function declarations. Reports functions with
 * identical names and similar signatures. No test files required. */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = "Source";

/** Language keywords the method regex also matches (`if (x) {`, `switch (x) {`). */
const KEYWORDS = new Set([
  "if",
  "else",
  "for",
  "while",
  "do",
  "switch",
  "case",
  "catch",
  "try",
  "finally",
  "return",
  "new",
  "typeof",
  "delete",
  "await",
  "function",
]);


function collectFiles(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(full, files);
    } else if (entry.isFile() && (full.endsWith(".ts") || full.endsWith(".tsx"))) {
      files.push(full);
    }
  }
  return files;
}

function extractFunctions(source) {
  const funcs = [];
  // Simple regex-based extraction for duplicate detection
  const funcRegex = /function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\([^)]*\)/g;
  const arrowRegex = /(?:const|let|var)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=[^=]*=>/g;
  const methodRegex = /(?<!function\s)([a-zA-Z_][a-zA-Z0-9_]*)\s*\([^)]*\)\s*\{/g;
  let match;
  while ((match = funcRegex.exec(source)) !== null) {
    funcs.push({ name: match[1], type: "function", line: source.slice(0, match.index).split("\n").length });
  }
  while ((match = arrowRegex.exec(source)) !== null) {
    funcs.push({ name: match[1], type: "arrow", line: source.slice(0, match.index).split("\n").length });
  }
  while ((match = methodRegex.exec(source)) !== null) {
    funcs.push({ name: match[1], type: "method", line: source.slice(0, match.index).split("\n").length });
  }
  return funcs;
}

function main() {
  const files = collectFiles(ROOT);
  const allFuncs = [];
  for (const file of files) {
    const content = readFileSync(file, "utf8");
    const funcs = extractFunctions(content);
    for (const f of funcs) {
      if (KEYWORDS.has(f.name)) continue;
      allFuncs.push({ ...f, file: file.replace(/\\/g, "/") });
    }
  }

  const duplicates = {};
  for (const f of allFuncs) {
    if (!duplicates[f.name]) duplicates[f.name] = [];
    duplicates[f.name].push(f);
  }

  let found = false;
  for (const [name, list] of Object.entries(duplicates)) {
    if (list.length > 1) {
      console.log(`DUPLICATE: ${name} (${list.length} occurrences)`);
      for (const item of list) {
        console.log(`  - ${item.file}:${item.line} (${item.type})`);
      }
      found = true;
    }
  }

  if (!found) {
    console.log("No duplicate functions found.");
  } else {
    console.log(`\nFound ${Object.values(duplicates).filter((l) => l.length > 1).length} duplicate function names.`);
    process.exitCode = 1;
  }
}

main();
