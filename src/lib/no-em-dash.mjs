// ---------------------------------------------------------------------------
// House style guard: the site never shows an em dash (see CLAUDE.md).
//
// Editors posting through the CMS can't be expected to know the rule, so the
// build rewrites any that slip in, along with the spaced double hyphen people
// type in their place, as a comma. It runs on article text (as a remark plugin,
// registered in astro.config.mjs) and on front matter strings (through the
// schema in src/content.config.ts). The source files are left as written.
// ---------------------------------------------------------------------------

const EM_DASH = String.fromCodePoint(0x2014);
const DASH_AS_ASIDE = new RegExp(`\\s*${EM_DASH}\\s*|\\s+-{2,3}\\s+`, "g");

/** "Maps of Kano [em dash] and Kaduna" becomes "Maps of Kano, and Kaduna". */
export const noEmDash = (text) => text.replace(DASH_AS_ASIDE, ", ");

/** Remark plugin applying noEmDash to every text node of a Markdown file. */
export function remarkNoEmDash() {
  const walk = (node) => {
    if (node.type === "text") node.value = noEmDash(node.value);
    node.children?.forEach(walk);
  };
  return walk;
}
