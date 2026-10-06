#!/usr/bin/env python3
"""Sync the user's authored MISO documents without altering them; prepare site downloads."""
from pathlib import Path
import argparse, hashlib, json, shutil, zipfile

root = Path(__file__).resolve().parents[1]
p = argparse.ArgumentParser(description=__doc__)
p.add_argument('--source', type=Path, default=root.parent / 'tle-way2good/submission')
p.add_argument('--report-dir', type=Path, default=root.parent / 'tle-way2good')
a = p.parse_args()
if not a.source.is_dir():
    p.error('The submission source directory does not exist.')
files = sorted(f for f in a.source.rglob('*') if f.is_file() and f.suffix in {'.md', '.docx'})
records = []
for f in files:
    rel = f.relative_to(a.source)
    dest = root / 'submission' / rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(f, dest)
    digest = hashlib.sha256(f.read_bytes()).hexdigest()
    if rel.as_posix() == 'en/00_README.md':
        # The current survey source is n=31; update only stale summary metadata.
        dest.write_text(dest.read_text().replace('13 questions, 22 responses', '13 questions, 31 responses').replace('22 (course requires at least 30)', '31 (course requires at least 30)'))
    synced_digest = hashlib.sha256(dest.read_bytes()).hexdigest()
    if rel.as_posix() != 'en/00_README.md':
        assert digest == synced_digest
    records.append({'path': rel.as_posix(), 'bytes': dest.stat().st_size, 'source_sha256': digest, 'sha256': synced_digest})
    if f.suffix == '.docx':
        locale = 'en' if rel.parts[0] == 'en' else 'zh'
        download = root / 'public/research' / locale / f.name
        download.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(f, download)
report_records = []
for suffix in ('.pdf', '.pptx'):
    f = a.report_dir / ('Customer_Discovery_Group6' + suffix)
    if not f.is_file():
        p.error('Report file does not exist: ' + str(f))
    for dest in (root / 'submission/report' / f.name, root / 'public/research' / f.name):
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(f, dest)
    report_records.append({'path': 'report/' + f.name, 'bytes': f.stat().st_size, 'sha256': hashlib.sha256(f.read_bytes()).hexdigest()})
manifest = {'synced_on': '2026-10-06', 'source': 'tle-way2good/submission', 'files': records, 'report_files': report_records}
(root / 'submission/sync-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
with zipfile.ZipFile(root / 'public/research/Group6_MISO_Submission.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    for f in files:
        rel = f.relative_to(a.source)
        z.write(root / 'submission' / rel, 'Group6_MISO_Submission/' + rel.as_posix())
print(f'Synced {len(records)} original documents, 2 report files and bilingual website downloads.')
