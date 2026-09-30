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

## 2. Design decisions and why

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

**Layout variety is deliberate:** hero → fact band → timeline → evidence+table → full-bleed
photo → dark pivot band → principle grid → numbered rows → form panel. No template repeats seven
times, which was the main criticism of the previous version.

## 3. Assets

The source PDF has no separate photo files: each page *is* one 1672×941 image, and the old page
displayed an entire slide inside a CSS crop box (its hero image was byte-identical to page 7,
text and all). This rebuild crops real photos out of the slide images and saves them as proper
assets: `hero.jpg` (1056×922), `away.jpg` (810×274, used full-bleed), `hold.jpg` (466×448),
`devices.jpg` (780×396, the competitor devices). Screenshots have visible AI-ish details reduced
by cropping (the glowing heart trail is pushed to the frame edge on the hero) but the heart motif
is the source deck's own graphic language, so it was not painted out.

## 4. Verification (all of it re-runnable)

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

## 5. Known limitations

- The competitor device shot and the three photos come from the source deck, so they are
  decorative rather than documentary; a real photograph of the team's own prototype would be
  stronger when one exists.
- The page states the research stage explicitly and promises nothing. Do not add product claims
  without new evidence.
- No analytics, no email service, no unsubscribe flow yet — unchanged from the original scope.
- English copy is a faithful translation of the Chinese, not a separately written page.
