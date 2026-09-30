# Fonts

Self-hosted, subset to the 566 glyphs this page actually uses. No CDN, no third-party request.

| File | Family | Axes | Size | License |
|---|---|---|---|---|
| `pc-serif.woff2` | Noto Serif SC | wght 200–900 | 170 KB | OFL 1.1 — `licenses/notoserifsc-OFL.txt` |
| `pc-sans.woff2` | Noto Sans SC | wght 100–900 | 131 KB | OFL 1.1 — `licenses/notosanssc-OFL.txt` |
| `pc-latin.woff2` | Inter | opsz, wght 100–900 | 39 KB | OFL 1.1 — `licenses/inter-OFL.txt` |
| `pc-mono.woff2` | JetBrains Mono | wght 100–800 | 29 KB | OFL 1.1 — see `licenses/` |

Total 369 KB — one variable file per family, so all weights come from four files.

Rebuild with **`python3 tools/subset-fonts.py`** — it downloads the OFL sources from Google Fonts
into `.fontwork/src/` (git-ignored), reads the glyph set from `.fontwork/chars.txt`, and writes the
four woff2 files. **Re-run it after any copy change**: a glyph that is missing from the subset
silently falls back to a system font. The character set is extracted from the built pages,
`app.js` and `content.mjs` plus a margin of digits/punctuation the form can inject.

CJK in a `--font-mono` element falls back to `PC Sans` (JetBrains Mono has no CJK), which is why
the stack is `'PC Mono','PC Sans',ui-monospace,…`: numbers and Latin come from the mono face,
Chinese labels from the sans face.
