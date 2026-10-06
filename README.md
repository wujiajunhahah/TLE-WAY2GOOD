# Pet Companionship · Group 6

Bilingual research site for remote pet companionship. Updated on **6 October 2026** from the team's current MISO submission.

**Website:** [中文](https://wujiajunhahah.github.io/TLE-WAY2GOOD/zh/) · [English](https://wujiajunhahah.github.io/TLE-WAY2GOOD/en/)

## Current research

- **5 owner interviews:** Christian, Randy, James, Ajing and Young (23).
- **31 valid survey responses**, with 13 questions. The sample is mainly office workers and students; it is not representative of all pet owners.
- **15 media sources**, including source findings and bias analysis.
- Barbershop field notes; additional observation settings are planned.

The site explains three different gaps: reassurance after seeing a pet, access to everyday moments, and the ability to respond from a distance. Ajing's accepted routine remains a counterexample to universal demand for remote play. Proposed clips, behaviour signals, bounded interaction and care handover are concepts to test, not implemented capabilities or proven demand.

## Materials

- [Full report (PDF)](submission/report/Customer_Discovery_Group6.pdf)
- [Presentation (PPTX)](submission/report/Customer_Discovery_Group6.pptx)
- [中文 MISO documents and sources](submission/)
- [English MISO documents and sources](submission/en/)
- [Sync manifest](submission/sync-manifest.json): source and published SHA-256 checksums.

The ten DOCX files and ten research Markdown files are copied unchanged from `tle-way2good/submission`. The English package README's old survey count is corrected from 22 to 31 in this repository; its source version remains unchanged. The standalone report files come from `Customer_Discovery_Group6.pdf` and `.pptx` in the same project directory. Site metadata for Young uses the researcher's correction: 23 years old.

## Update and build

```sh
python3 tools/sync-submission.py --source=../tle-way2good/submission --report-dir=../tle-way2good
node build.mjs --images=none
python3 tools/subset-fonts.py
node tools/make-og.mjs
node build.mjs --static --images=none --base=/TLE-WAY2GOOD/ --origin=https://wujiajunhahah.github.io/TLE-WAY2GOOD --out=docs
```

`docs/` is the GitHub Pages source on `main`. It contains both language routes, search metadata, fonts and downloadable research files. The existing warm visual design is retained; [DESIGN_NOTES.md](DESIGN_NOTES.md) archives the earlier design decisions and verification history.

For the local Node preview, run `node server.mjs` and open `http://localhost:4317/`. Static Pages has no email signup backend; its page states that registration is not saved. `data/`, local build work and `.DS_Store` files are excluded from Git.
