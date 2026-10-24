/** Encoding rule: text decoded twice (mojibake). */
import { findMojibake } from "./Mojibake.mjs";

const MESSAGE = "Encoding is UTF-8. This text was decoded twice and has to be written again from the original.";

export const encodingPlugin = {
  rules: {
    "no-mojibake": {
      meta: {
        type: "problem",
        fixable: null,
        docs: { description: "Disallow text that was decoded twice." },
        messages: { mojibake: MESSAGE },
        schema: [],
      },
      create(context) {
        const source = context.sourceCode ?? context.getSourceCode();
        return {
          Program() {
            const match = findMojibake(source.getText());
            if (match === null) return;
            context.report({ loc: source.getLocFromIndex(match.index), messageId: "mojibake" });
          },
        };
      },
    },
  },
};
