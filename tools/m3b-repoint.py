#!/usr/bin/env python3
"""M3 Phase B: re-point internal links to the consolidated canonical layout.
Binary-mode replace preserves line endings exactly and handles UTF-8 emoji bytes.
Run from anywhere: python tools/m3b-repoint.py
"""
import os, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def edit(rel, repls):
    p = os.path.join(ROOT, rel)
    b = open(p, "rb").read(); orig = b
    for old, new in repls:
        b = b.replace(old.encode("utf-8"), new.encode("utf-8"))
    if b != orig:
        open(p, "wb").write(b)
    return b != orig

changed = []

# 1) GLOBAL emoji-folder -> kebab (same-named targets) across the courses/ tree
for d, _, fs in os.walk(os.path.join(ROOT, "courses")):
    for fn in fs:
        if fn.endswith((".html", ".md")):
            rel = os.path.relpath(os.path.join(d, fn), ROOT)
            if edit(rel, [("\U0001F4D8 Assessments/", "assessments/"),
                          ("\U0001F4D8 Study Resources/", "study-resources/"),
                          ("\U0001F4D8 Handouts/", "handouts/")]):
                changed.append(rel)

# 2) FR SPA: Teacher Guides moved to /instructors/ (depth from courses/financial-readiness/ = ../../)
edit("courses/financial-readiness/financial-readiness.html",
     [("\U0001F4D8 Teacher Guides/", "../../instructors/teacher-guides/")]) and changed.append("fr.html teacher-guides")

# 3) ICS dashboard (courses/computer-skills/index.html): drop the ICS prefix, fix logo/shared/home
edit("courses/computer-skills/index.html", [
    ('"intermediate-computer-skills/', '"'),                       # href/src prefix drop -> weeks/..., syllabus-overview.html
    ('src="assets/vub-logo.svg"', 'src="../../assets/vub-seal.svg"'),
    ('src="shared/progress.js"', 'src="../../shared/progress.js"'),
    ('src="shared/glossary.js"', 'src="../../shared/glossary.js"'),
    ('href="index.html"', 'href="../../index.html"'),              # brand + "Back to Courses"
]) and changed.append("computer-skills/index.html")

# 4) ICS week presentations: shared/ is one level deeper now (+1 ../)
for p in glob.glob(os.path.join(ROOT, "courses/computer-skills/weeks/week-0*/presentation.html")):
    rel = os.path.relpath(p, ROOT)
    if edit(rel, [("../../../shared/", "../../../../shared/")]):
        changed.append(rel)

# 5) instructors/intake.html + syllabus-overview.html: assets/ and home now one level up
for f in ["instructors/intake.html", "instructors/syllabus-overview.html"]:
    if edit(f, [('href="assets/', 'href="../assets/'),
                ('src="assets/', 'src="../assets/'),
                ('href="index.html"', 'href="../index.html"')]):
        changed.append(f)

# 6) instructors/classes/index.html: logo -> seal, home depth +1 (intake stays ../intake.html)
edit("instructors/classes/index.html", [
    ('src="../VUB Financial Readiness Course/assets/vub-logo.svg"', 'src="../../assets/vub-seal.svg"'),
    ('href="../index.html"', 'href="../../index.html"'),
]) and changed.append("classes/index.html")

# 7) instructors/classes/.../beckley/index.html: logo, ICS tests -> canonical course, home depth +1
edit("instructors/classes/computer-skills-spring-2026-beckley/index.html", [
    ('src="../../VUB Financial Readiness Course/assets/vub-logo.svg"', 'src="../../../assets/vub-seal.svg"'),
    ('../../VUB Intermediate Computer Course/weeks/', '../../../courses/computer-skills/weeks/'),
    ('href="../../index.html"', 'href="../../../index.html"'),
]) and changed.append("beckley/index.html")

# 8) assessment forms: "Back to course" -> the FR course page (no index.html in the course dir)
for p in glob.glob(os.path.join(ROOT, "courses/financial-readiness/assessments/*.html")):
    rel = os.path.relpath(p, ROOT)
    if edit(rel, [('href="../index.html"', 'href="../financial-readiness.html"')]):
        changed.append(rel)

# 9) Homepage index.html: re-point course/test/resume links to /courses/ (order: specials first)
edit("index.html", [
    ("VUB Financial Readiness Course/intermediate-computer-skills.html", "courses/computer-skills/index.html"),
    ("VUB Financial Readiness Course/\U0001F4D8 Assessments/", "courses/financial-readiness/assessments/"),
    ("VUB Financial Readiness Course/\U0001F4D8 Study Resources/", "courses/financial-readiness/study-resources/"),
    ("VUB Financial Readiness Course/", "courses/financial-readiness/"),
    ("VUB Intermediate Computer Course/weeks/", "courses/computer-skills/weeks/"),
]) and changed.append("index.html")

print(f"re-pointing applied to {len(changed)} files/areas")
for c in changed:
    print("  " + c)
