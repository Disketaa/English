import js from "@eslint/js";
import tseslint from "typescript-eslint";
import checkFile from "eslint-plugin-check-file";
import prettier from "eslint-config-prettier";
import { commentPlugin } from "./Tools/Comments/CommentRules.js";
import { encodingPlugin } from "./Tools/Encoding/EncodingRules.js";

const rootDir = import.meta.dirname;

const deepImport = {
  regex: "^@/(?!Design/(Primitives|Components)$)[^/]+/.+",
  message:
    "Import through the module index: '@/Module'. For the design system, only '@/Design/Primitives' and '@/Design/Components' are allowed.",
};
const ban = (...modules) => ({
  group: modules.flatMap((m) => [`@/${m}`, `@/${m}/**`]),
  message: `This layer cannot import: ${modules.join(", ")}.`,
});
const layer = (folder, banned) => {
  const patterns = [deepImport];
  if (banned.length > 0) patterns.push(ban(...banned));
  return {
    files: [`Source/${folder}/**/*.{ts,tsx}`],
    rules: {
      "no-restricted-imports": ["error", { patterns }],
    },
  };
};

export default tseslint.config(
  { ignores: ["dist", "node_modules", ".kilo", "Source/Design/Tokens.css"] },
  { languageOptions: { parserOptions: { tsconfigRootDir: rootDir } } },
  {
    files: ["Tools/**/*.{js,mjs}"],
    languageOptions: { globals: { process: "readonly", console: "readonly" } },
    rules: { "no-console": "off" },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx,mts}"],
    plugins: { encoding: encodingPlugin },
    rules: {
      "eol-last": ["error", "always"],
      "encoding/no-mojibake": "error",
    },
  },
  {
    files: ["Source/**/*.{ts,tsx}"],
    plugins: { "check-file": checkFile, comments: commentPlugin },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/consistent-type-assertions": ["error", { assertionStyle: "never" }],
      "no-console": "error",
      "no-restricted-syntax": [
        "error",
        { selector: "ExportDefaultDeclaration", message: "Only named exports." },
      ],
      "@typescript-eslint/naming-convention": [
        "error",
        { selector: "typeLike", format: ["PascalCase"] },
        { selector: "enumMember", format: ["PascalCase"] },
        { selector: "variable", format: ["camelCase", "PascalCase"], leadingUnderscore: "allow" },
        { selector: "function", format: ["camelCase"] },
        { selector: "parameter", format: ["camelCase"], leadingUnderscore: "allow" },
        { selector: "objectLiteralProperty", modifiers: ["requiresQuotes"], format: null },
        { selector: "objectLiteralProperty", format: ["camelCase", "PascalCase"] },
      ],
      "check-file/filename-naming-convention": [
        "error",
        { "Source/**/*.{ts,tsx}": "PASCAL_CASE" },
        { ignoreMiddleExtensions: true },
      ],
      "check-file/folder-naming-convention": ["error", { "Source/**/": "PASCAL_CASE" }],
      "comments/max-lines": "error",
      "comments/no-trailing": "error",
      "comments/no-block-in-ts": "error",
      "comments/form": "error",
      "comments/shape": "error",
      "comments/no-split": "error",
    },
  },
  {
    files: ["Source/**/*.tsx"],
    rules: {
      "@typescript-eslint/naming-convention": [
        "error",
        { selector: "typeLike", format: ["PascalCase"] },
        { selector: "enumMember", format: ["PascalCase"] },
        { selector: "variable", format: ["camelCase", "PascalCase"], leadingUnderscore: "allow" },
        { selector: "function", format: ["camelCase", "PascalCase"] },
        { selector: "parameter", format: ["camelCase"], leadingUnderscore: "allow" },
        { selector: "objectLiteralProperty", modifiers: ["requiresQuotes"], format: null },
        { selector: "objectLiteralProperty", format: ["camelCase", "PascalCase"] },
      ],
    },
  },
  {
    files: ["Source/**/index.ts", "Source/App/main.tsx"],
    rules: { "check-file/filename-naming-convention": "off" },
  },
  layer("Core", ["Content", "Design", "Screens", "App", "Storage"]),
  layer("Content", ["Design", "Screens", "App", "Storage"]),
  layer("Design", ["Content", "Screens", "App", "Storage"]),
  layer("Screens", ["App"]),
  layer("Storage", ["App"]),
  layer("App", []),
);
