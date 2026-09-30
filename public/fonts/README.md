# Fonts

Self-hosted, subset to the 571 glyphs this page actually uses (`.fontwork/chars.txt`,
regenerate with `/tmp/fonts/subset.py` after changing copy). No CDN, no third-party request.

| File | Family | Source | License |
|---|---|---|---|
| `pc-serif.woff2` | Noto Serif SC (variable 200–900) | Google Fonts | OFL 1.1 — `licenses/notoserifsc-OFL.txt` |
| `pc-sans-400.woff2`, `pc-sans-700.woff2` | Noto Sans SC | Google Fonts | OFL 1.1 — `licenses/notosanssc-OFL.txt` |
| `pc-latin-400.woff2`, `pc-latin-500.woff2` | Inter | Google Fonts | OFL 1.1 — `licenses/inter-OFL.txt` |

All three families are licensed under the SIL Open Font License 1.1, which permits use,
modification and redistribution (including subsetting) as long as the license travels with the
files. Monospace text uses the system stack (`ui-monospace`, SF Mono, Menlo, Consolas). The
subset was produced with `pyftsubset --flavor=woff2 --layout-features=kern,liga,calt,vert,vrt2,ccmp,locl,palt
--no-hinting --desubroutinize`.
