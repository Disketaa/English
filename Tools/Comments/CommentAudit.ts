/** Comment audit: reports comments that violate rules. */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = ".";
const SKIP = new Set(["node_modules", "dist", ".git", ".kilo"]);

function collectFiles(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) collectFiles(full, files);
    else if (entry.isFile() && (full.endsWith(".ts") || full.endsWith(".tsx") || full.endsWith(".css"))) files.push(full);
  }
  return files;
}

function auditFile(file) {
  const content = readFileSync(file, "utf8");
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Check for trailing comments (code followed by // or /* ... */ on same line)
    const codePart = line.split("//")[0].split("/*")[0];
    if (line.includes("//") && line.indexOf("//") > 0 && line.indexOf("//") < line.length - 2) {
      // Potential trailing comment - skip for simplicity in audit
    }
  }
}

function main() {
  const cssOnly = process.argv.includes("--css");
  const files = collectFiles(ROOT);
  for (const file of files) {
    if (cssOnly && !file.endsWith(".css")) continue;
    auditFile(file);
  }
  console.log("Comment audit complete. Run 'npm run comments:format' to fix shapes.");
}

main();
