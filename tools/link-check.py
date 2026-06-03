#!/usr/bin/env python3
"""Internal-link checker for the VUB platform tree.
Scans HTML files under the given roots, resolves every relative href/src,
and reports any that don't point at a file/dir on disk. External links
(http, //, mailto, tel, #, data:, javascript:) are skipped.

Usage: python tools/link-check.py [root ...]   (default roots: courses instructors index.html)
Exit code 0 if no broken internal links, 1 otherwise.
"""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
roots = sys.argv[1:] or ["courses", "instructors", "index.html"]
REF_RE = re.compile(r'(?:href|src)\s*=\s*["\']([^"\']+)["\']', re.I)
SKIP = ("http://", "https://", "//", "mailto:", "tel:", "#", "data:", "javascript:")

def html_files(paths):
    for p in paths:
        ap = os.path.join(ROOT, p)
        if os.path.isfile(ap) and ap.lower().endswith((".html", ".htm")):
            yield ap
        elif os.path.isdir(ap):
            for d, _, fs in os.walk(ap):
                for f in fs:
                    if f.lower().endswith((".html", ".htm")):
                        yield os.path.join(d, f)

broken, checked = [], 0
for f in html_files(roots):
    base = os.path.dirname(f)
    try:
        text = open(f, encoding="utf-8", errors="replace").read()
    except Exception as e:
        broken.append((f, "<read error>", str(e))); continue
    for ref in REF_RE.findall(text):
        r = ref.strip()
        if not r or r.startswith(SKIP):
            continue
        checked += 1
        target = r.split("#", 1)[0].split("?", 1)[0]
        if not target:
            continue
        resolved = os.path.normpath(os.path.join(base, target))
        if not os.path.exists(resolved):
            broken.append((os.path.relpath(f, ROOT), ref, os.path.relpath(resolved, ROOT)))

print(f"checked {checked} internal refs across roots {roots}")
print(f"BROKEN: {len(broken)}")
# group broken by a coarse signature of the ref for readability
from collections import Counter
sig = Counter()
for _, ref, _ in broken:
    t = ref.split("#")[0].split("?")[0]
    if "📘" in t: sig["emoji-folder"] += 1
    elif "intermediate-computer-skills" in t: sig["ics-path"] += 1
    elif "VUB Financial Readiness Course" in t: sig["fr-subrepo-path"] += 1
    elif "VUB Intermediate Computer Course" in t: sig["ics-subrepo-path"] += 1
    elif "vub-logo.svg" in t: sig["old-logo"] += 1
    elif t.startswith("shared/") or "/shared/" in t: sig["shared"] += 1
    elif t.endswith(".mp4"): sig["local-mp4"] += 1
    else: sig["other"] += 1
def category(t):
    if "\U0001F4D8" in t: return "emoji-folder"
    if "intermediate-computer-skills" in t: return "ics-path"
    if "VUB Financial Readiness Course" in t: return "fr-subrepo-path"
    if "VUB Intermediate Computer Course" in t: return "ics-subrepo-path"
    if "vub-logo.svg" in t: return "old-logo"
    if t.startswith("shared/") or "/shared/" in t: return "shared"
    if t.endswith(".mp4"): return "local-mp4"
    return "other"

for k, v in sig.most_common():
    print(f"  {k:18} {v}")

# distinct broken refs per category (encoding-safe, Python-side)
from collections import defaultdict
bycat = defaultdict(lambda: defaultdict(set))  # cat -> ref -> set(files)
for f, ref, _ in broken:
    t = ref.split("#")[0].split("?")[0]
    bycat[category(t)][ref].add(f)
print("=== distinct broken refs per category ===")
for cat in sorted(bycat):
    print(f"\n## {cat} ({sum(len(v) for v in bycat[cat].values())} occurrences, {len(bycat[cat])} distinct)")
    for ref in sorted(bycat[cat]):
        files = sorted(bycat[cat][ref])
        sample = files[0] + (f"  (+{len(files)-1} more)" if len(files) > 1 else "")
        print(f"  {ref}\n      in: {sample}")
sys.exit(1 if broken else 0)
