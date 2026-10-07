#!/usr/bin/env python3
"""Build the self-hosted, subset fonts for the landing page.

Downloads the OFL sources from Google Fonts once into .fontwork/src/, then subsets each face
down to the glyphs the page actually contains (.fontwork/chars.txt) and writes public/fonts/.

    python3 tools/subset-fonts.py            # fetch (if needed) + subset
    python3 tools/subset-fonts.py --refetch  # force re-download

The character set comes from the built pages + app.js + content.mjs, so **re-run this after any
copy change** — a missing glyph falls back to a system font and is easy to miss.
"""
import html
import os
import re
import subprocess
import sys
from fontTools.ttLib import TTFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DIR = os.path.join(ROOT, '.fontwork', 'src')
TEXT = os.path.join(ROOT, '.fontwork', 'chars.txt')
OUTDIR = os.path.join(ROOT, 'public', 'fonts')

GF = 'https://raw.githubusercontent.com/google/fonts/main/ofl'
SOURCES = {
    'serif': f'{GF}/notoserifsc/NotoSerifSC%5Bwght%5D.ttf',
    'sans': f'{GF}/notosanssc/NotoSansSC%5Bwght%5D.ttf',
    'latin': f'{GF}/inter/Inter%5Bopsz%2Cwght%5D.ttf',
    'mono': f'{GF}/jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf',
}

# extra glyphs the JavaScript can inject at runtime (form messages, placeholders)
EXTRA = (
    "0123456789"
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    "abcdefghijklmnopqrstuvwxyz"
    " .,:;!?()[]{}%$·—–-/\\'\"’“”…&@#*+=<>°"
)


def fetch(name: str, url: str, refetch: bool) -> str:
    os.makedirs(SRC_DIR, exist_ok=True)
    dest = os.path.join(SRC_DIR, f'{name}.ttf')
    if refetch or not os.path.exists(dest) or os.path.getsize(dest) < 100_000:
        print(f'fetch {name}: {url.rsplit("/", 1)[-1]}')
        # curl rather than urllib: the system python here has no CA bundle installed
        subprocess.run(['curl', '-fsSL', '-o', dest, url], check=True)
    print(f'  {name:6s} source {os.path.getsize(dest) // 1024 // 1024} MB')
    return dest


def extract_chars() -> set:
    """Every printable character the page can render: the built HTML, the script, and the
    content source. Missing one means a silent fallback to a system font."""
    chars = set()
    for rel in ('public/zh/index.html', 'public/en/index.html', 'public/app.js', 'content.mjs', 'build.mjs'):
        path = os.path.join(ROOT, rel)
        if not os.path.exists(path):
            continue
        raw = open(path, encoding='utf-8').read()
        raw = re.sub(r'<script.*?</script>', '', raw, flags=re.S)
        raw = re.sub(r'<style.*?</style>', '', raw, flags=re.S)
        chars |= set(html.unescape(re.sub(r'<[^>]+>', ' ', raw)))
    return chars


def main() -> None:
    refetch = '--refetch' in sys.argv
    # union of the current page copy, whatever was here before, and the runtime margin
    chars = extract_chars() | set(open(TEXT, encoding='utf-8').read()) | set(EXTRA)
    text = ''.join(sorted(c for c in chars if c.isprintable()))
    open(TEXT, 'w', encoding='utf-8').write(text)
    cjk = sum(1 for c in text if '\u4e00' <= c <= '\u9fff')
    print(f'glyph set: {len(text)} chars ({cjk} CJK)')

    os.makedirs(OUTDIR, exist_ok=True)
    total = 0
    for name, url in SOURCES.items():
        src = fetch(name, url, refetch)
        out = os.path.join(OUTDIR, f'pc-{name}.woff2')
        cmd = [
            'pyftsubset', src, f'--text-file={TEXT}', '--flavor=woff2', f'--output-file={out}',
            '--layout-features=kern,liga,calt,zero,tnum,vert,vrt2,ccmp,locl,palt',
            '--no-hinting', '--desubroutinize', '--drop-tables+=DSIG',
        ]
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode != 0:
            print(f'{name}: FAILED {res.stderr.strip()[:200]}')
            continue
        size = os.path.getsize(out)
        total += size
        f = TTFont(out)
        axes = [a.axisTag for a in f['fvar'].axes] if 'fvar' in f else 'static'
        missing = [c for c in text if '\u4e00' <= c <= '\u9fff' and ord(c) not in f.getBestCmap()]
        flag = 'OK' if not missing else f'MISSING {len(missing)}: {"".join(missing[:10])}'
        print(f'  pc-{name:6s} {size / 1024:6.0f} KB  axes={axes}  cjk {flag}')
    print(f'total: {total / 1024:.0f} KB')


if __name__ == '__main__':
    main()
