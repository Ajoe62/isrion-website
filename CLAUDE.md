# ISRION website: project conventions

## Writing style

**Never use em dashes in this project.** That means the character U+2014, its
HTML entity (`&mdash;` / `&#8212;`), its JS/CSS escape, and the spaced double
hyphen (`--`) people use in its place. The rule covers everything: site copy,
page titles, meta descriptions, form and email subjects, code comments,
Markdown docs and commit messages.

Use instead, whichever fits the sentence:

- a comma, for a light aside
- a semicolon or full stop, for two joined statements
- a colon, before an explanation or a list
- parentheses, for a parenthetical that already contains commas
- a pipe in page titles, e.g. `Services | ISRION International Ltd`

En dashes (U+2013) remain allowed in numeric ranges only, e.g. `1,783 – 1,959 ppb`.

Before finishing any change, confirm none crept back in:

```bash
grep -rInP '\x{2014}|&mdash;|&#8212;' . \
  --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist --exclude=CLAUDE.md
```
