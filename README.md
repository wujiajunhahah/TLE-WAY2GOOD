# Pet Companionship — landing page v4

Rebuild of the project's landing page: **UI + content**. Built in its own directory so it
cannot collide with the copy that another agent was editing at `../pet-companionship`
(that server keeps running untouched on `http://localhost:4317`).

Preview: **http://localhost:4320** (`node server.mjs`, default port 4320).

```sh
node build.mjs     # content.mjs -> public/{zh,en}/index.html
node server.mjs    # serves public/ + POST /api/subscribe -> data/subscribers.jsonl
```

---

## 1. Where the content comes from

Two files, nothing invented:

| Source | What was taken |
|---|---|
| `宠物远程陪伴_用户场景痛点_3页PPT.pptx` | target user (3 groups + shared trait); the five-moment journey and its break point; Remote Monitoring → Remote Companionship; the HMW sentence |
| `Pet_Companionship.pdf` (8 pages, market & competitive analysis) | market numbers (312.6 RMB bn, +4.1% YoY, 126m urban cats+dogs, 90s/00s cohorts); five competitor products with prices and their gaps; white space; empathy-map pain points and needs; "seeing a pet is not the same as feeling connected"; the four design principles (Informed / Connected / Respectful / Supportive); the four concept directions; design direction |
| Photos | cropped out of the PDF pages themselves (the PDF is one full-page image per slide, and the old page displayed a *whole slide* inside a CSS crop box — see §3) |

Every factual claim on the page is traceable to those two files. Prices are labelled with an
access date; the KPMG report is linked because the URL was verified. The USDA FAS report is
named in plain text rather than inventing a link.

## 2. Design research (what the references actually do)

Measured from live sites rather than guessed (computed colours, font families, h1 metrics,
radii, SVG counts):

| Reference | Palette | Type | Geometry | Visuals |
|---|---|---|---|---|
| Tuft & Paw (pet) | bone #f2f1f0, brick #d0433a, indigo #1c1f51 blocks | Centra No 2, h1 72px at **1.0** line-height | asymmetric pills `0 200 200 0` | 96 photos + **247 SVGs** |
| Petlibro (pet) | white + deep olive #315800 as the only accent | Sohne grotesque | sharp 4px | 264 photos |
| Litter-Robot (pet) | white + amber #fbb040 | StabilGrotesk, h1 64/700 | mixed 0–35px | 140 photos |
| Tractive (pet) | ink #121623 + violet #4a14a2 | Poppins, h1 56/500 at 1.08 | pill 400px | 100 photos + 134 SVGs |
| Raycast | #07080a near-black, Inter + GeistMono | h1 64/600 | 16/8/6px | 117 photos + 173 SVGs |
| J!NX | #1f1f21 + acid lime | Figtree + Oswald condensed | 0–5px | — |

Shared DNA, which is what the theme copies: **one loud accent**, deep ink, **huge tight display
type**, arch/pill geometry, and vector-drawn imagery rather than photography. Kickstarter,
Rover and The Farmer's Dog sit behind Cloudflare and could not be measured.

Theme **"Arch"** (pet register):
- bone `#F5F1E8` canvas, ink `#191713`, **indigo `#1E2154`** blocks, **honey amber `#E8912F`**,
  clay `#C0442B` for the problem side. Amber is a *block* colour (ink on amber = 7.3:1), never
  small text on bone (2.2:1) — small amber text uses `#9A5410` (5.1:1).
- the **arch** (a cat door, a cat's back) is the signature shape: `border-radius:999px 999px 0 0`
  on the hero panel, the comparison panels, the trait block and the break quote.
- the hero object is **a cat drawn as one continuous line whose tail becomes the connection
  line**, with pulses travelling both ways — SVG, no assets, animated once on scroll, static and
  complete under `prefers-reduced-motion` and with JavaScript disabled.

## 3. Design decisions and why

**Identity: a printed research brief, not a startup landing page.** The project is a research
stage with a market/competitive deck behind it, so the page borrows the authority of a document:
a sticky left margin rail carries each section's number and label, hairline rules divide
sections, and the reading column is offset from the rail. This is what makes it look like a
study instead of generic marketing.

**The two-way thesis is carried structurally, not decoratively.** Every pair on the page is a
pair on purpose: single chain vs two-way chain, owner-side green vs pet-side clay, "what exists"
vs "what is missing", today vs opportunity. Colour is semantic throughout (owner/today = deep
green, pet/opportunity = clay) instead of decorative.

**The five-moment journey is the spine.** It is the most interesting object in the source
material, so it gets the loudest treatment on the page: a full-width timeline with node markers,
serif step titles, and beat 05 in clay with a "关键断点" tag. A pull-quote underneath states the
breakpoint in one sentence.

**Type: three voices, no more.** A CJK serif for display and step titles (Songti SC / Source Han
Serif; Iowan Old Style on the English page), a system sans for body, and tabular numerals for
data. Body never drops below 14px, and the scale has real steps: hero 88px → HMW 48px → pivot
52px → section 44px → step 26px → body 17px → meta 12.5px.

**Palette was contrast-checked before it was written**, not after:
`--ink #1B1A17` 15.9:1, `--ink-2 #4F4C44` 7.8:1, `--ink-3 #6E695E` 4.97:1, `--clay #A2452B`
5.59:1, `--green #123A35` 11.4:1, on the dark band `--clay-soft #E8A08D` 5.85:1. The brighter
`#E4694B` is used only for decorative marks, never for small text.

**Deliberately removed** (each was questioned: does it carry information?):
gradients, glows, shadows, rounded cards, an icon set, decorative badges, a `01–0N` micro-label
on every row, boxed "pill" nodes around chain words, the collapsed-accordion FAQ (answers are
now simply readable), scroll-reveal animation, and lazy-loaded images that could render as empty
boxes. Images are square-cornered and used as full-bleed or composed blocks, never as cards.

**Pamir-derived, asset-free moves** (the reference site is ~2 photos + 91 inline SVG/DOM elements,
so its polish comes from type and motion rather than素材):
- a **mono register** for numbers and micro-labels (system `ui-monospace`), which is what makes
  data read as instrumented rather than decorative;
- a **connection diagram drawn in SVG** in the pivot band — one-way today, two-way as the
  opportunity — with travelling flow dots (`stroke-dasharray`/`dashoffset`, no libraries, no
  images), complete and static when JS is off, animated only when it scrolls into view, and
  fully disabled under `prefers-reduced-motion`;
- a **concept-sketch section**: three dark "device screen" cards built entirely from DOM
  (notification / moment / device state), each labelled 概念稿 / CONCEPT so nothing reads as a
  shipped product;
- deliberately NOT copied: their studio product render and frame-sequence scroll animation —
  those are the only genuinely asset-dependent parts, and this project has no physical product
  to photograph yet.

**Layout variety is deliberate:** hero → fact band → timeline → evidence+table → full-bleed
photo → dark pivot band → principle grid → numbered rows → form panel. No template repeats seven
times, which was the main criticism of the previous version.

## 4. Assets

The source PDF has no separate photo files: each page *is* one 1672×941 image, and the old page
displayed an entire slide inside a CSS crop box (its hero image was byte-identical to page 7,
text and all). This rebuild crops real photos out of the slide images and saves them as proper
assets: `hero.jpg` (1056×922), `away.jpg` (810×274, used full-bleed), `hold.jpg` (466×448),
`devices.jpg` (780×396, the competitor devices). Screenshots have visible AI-ish details reduced
by cropping (the glowing heart trail is pushed to the frame edge on the hero) but the heart motif
is the source deck's own graphic language, so it was not painted out.

## 5. Verification (all of it re-runnable)

Browser audit (`/tmp/pet-v4/audit-v4.cjs`): 2 locales × 5 widths (1440/1024/768/390/320).

- **0 contrast failures** over ~50 sampled text roles, both locales
- **0 horizontal overflow** at every width, **0 console/page errors**, all 4 images render
- one `h1` per page, landmarks + skip link, focus ring visible, `aria-live` status
- form: success (focus moves to the panel), 500, 429, invalid email, missing consent, and
  double-submit (one request only) — no path shows success on failure
- anchor jumps land below the sticky header; language switch preserves the hash
- signup writes went to an isolated `DATA_DIR`; the real project's data file was never touched

Server fixes applied to this copy (found while reviewing the original):
`POST` with a non-object JSON body → 400 (was 500); malformed percent-encoding → 400 (was 500);
directory requests → 404 (was 500); the decoded path is now normalised before the redirect table,
so a percent-encoded look-alike can no longer serve a file the redirect table means to hide.

## 6. Typography

All display and body type is **self-hosted and subset to this page's 571 glyphs** — no CDN, no
third-party request, and a CJK page that does not download 20 MB:

| Role | Face | Axes | Size |
|---|---|---|---|
| Display (headlines, step titles, pull-quote) | Noto Serif SC | wght 200–900 | 170 KB |
| Body CJK | Noto Sans SC | wght 100–900 | 131 KB |
| Body Latin | Inter | opsz + wght | 39 KB |
| Numerals, prices, micro-labels | JetBrains Mono | wght 100–800 | 29 KB |

369 KB for four variable families; regenerate with `python3 tools/subset-fonts.py` after any copy
change (a glyph missing from the subset falls back silently).

CJK and Latin need different display metrics, so `h1`/`h2` carry per-language line-height and
tracking (`html[lang="zh-CN"]` vs `html[lang="en"]`); negative tracking is only applied to Latin.
Fonts are OFL 1.1 — see `public/fonts/README.md` and `public/fonts/licenses/`.

## 7. Image variants

`--images=all|minimal|none` builds three compositions from the same content. **The deployed root
is `none`** (the typographic version, chosen 2026-09-30): typography, the SVG connection diagram
and the DOM concept sketches carry the page, and no photograph is shipped at all. The other two
remain buildable:

- `all` — 4 photographs
- `minimal` — hero + full-bleed only
- `none` (default deploy) — no photographs

Link previews use `public/og-{zh,en}.jpg`, generated by **typesetting the card with the page's own
font** (`node tools/make-og.mjs`); the generator inlines the woff2 files as data URLs because a
`setContent()` page has an opaque origin and cross-origin font fetches are blocked by CORS.

## 8. Deployment (GitHub Pages)

The repo is served as a project site, so internal links carry the repo sub-path:

```sh
node build.mjs --static --base=/TLE-WAY2GOOD/ \
  --origin=https://wujiajunhahah.github.io/TLE-WAY2GOOD --out=docs
```

`docs/` (committed) is the Pages source: branch `main`, folder `/docs`. It contains both
locales, the root redirect, `robots.txt`, `sitemap.xml`, `.nojekyll`, the stylesheet, the script
and the assets.

**Static hosting has no signup endpoint.** On Pages the form says so plainly
(`当前为静态预览，订阅暂未开启保存。`) instead of pretending to save. Collecting real signups
needs the Node server (`node server.mjs`) or another endpoint — see §7.

Live: <https://wujiajunhahah.github.io/TLE-WAY2GOOD/>

## 9. Known limitations

- The competitor device shot and the three photos come from the source deck, so they are
  decorative rather than documentary; a real photograph of the team's own prototype would be
  stronger when one exists.
- The page states the research stage explicitly and promises nothing. Do not add product claims
  without new evidence.
- No analytics, no email service, no unsubscribe flow yet — unchanged from the original scope.
- English copy is a faithful translation of the Chinese, not a separately written page.
