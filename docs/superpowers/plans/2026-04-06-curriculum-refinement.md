# Curriculum Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the 5-module Financial Readiness Course to fit 10 hours of instruction (5 weeks x 2 hours) by cutting wrong-audience content, reducing slide count from 69 to ~55, expanding Social Security coverage, reframing Module 4 around income management, strengthening fraud content, and cleaning up supporting documents.

**Architecture:** Single-page app in `index.html` with presentation slides per module, sidebar navigation per module with chapter/slide lists, and completion stats. Each module has its own `<section>` with a `pres-sidebar` nav and `pres-slide-area`. Slide counts, chapter lists, and completion stats must stay in sync with actual slide content.

**Tech Stack:** HTML5, CSS3 (custom properties), vanilla JS, Font Awesome 6.4, Google Fonts (Inter + Outfit)

**Key constraint:** 10-12 slides per module for realistic 2-hour pacing with older adult learners. Target: ~55 slides total.

---

## File Map

| File | Action | What Changes |
|:-----|:-------|:-------------|
| `index.html` | Modify | All 5 modules: cut/add/rewrite slides, update sidebar navs, update completion stats |
| `course-description.html` | Modify | Remove wrong-audience references (BDD, transitioning service members, federal employees) |
| `syllabus.html` | Modify | Update module names, slide counts, and topic lists to match new curriculum |
| `CLAUDE.md` | Modify | Update module descriptions, remove BDD/FEHB/CSRS references, update slide counts |
| `handouts/retirement-transition-checklist.html` | Modify | Rename/reframe: remove transition-specific content, refocus on retirement income review |

---

## Task 1: Module 1 — Remove FEHB/BDD Slide, Expand Social Security

**Files:**
- Modify: `index.html:91-362` (Module 1 section)

**Current state:** 14 slides (13 content + 1 completion). Slide 10 (line 292) is "Federal Employees: Critical Deadlines" covering FEHB 5-year rule and BDD claims — wrong audience per memory `feedback_veterans_only.md` and `user_student_demographics.md`.

**Target state:** 12 slides (11 content + 1 completion). Remove FEHB/BDD slide. Add a new "Social Security: The Dollar Math" slide replacing it. Update sidebar nav, slide counter, key takeaways, and completion stats.

- [ ] **Step 1: Remove the FEHB/BDD slide**

Delete the entire `<div class="pres-slide" data-chapter="ss">` block at lines 292-319 (the "Federal Employees: Critical Deadlines" slide).

- [ ] **Step 2: Remove FEHB/BDD from sidebar nav**

In the sidebar `pres-chapter-list` (line 106), remove the slide item `FEHB & BDD Deadlines` (data-slide="10") from the Social Security chapter.

- [ ] **Step 3: Add new slide — "Social Security: The Dollar Math"**

Insert a new slide after the "Spousal & Survivor" slide (after line 277), within the `ss` chapter. This slide makes the financial case for delayed claiming concrete:

```html
<div class="pres-slide" data-chapter="ss">
    <h2><i class="fa-solid fa-dollar-sign text-blue"></i> Social Security: The Dollar Math</h2>
    <p>The decision of when to claim is worth <strong>$200,000&ndash;$500,000</strong> over a couple's lifetime. Here's why delaying matters:</p>
    <div class="pres-stat-grid">
        <div class="pres-stat-card"><span class="pres-stat-number">62</span><span class="pres-stat-label">~$2,100/mo<br>Permanently reduced ~30%</span></div>
        <div class="pres-stat-card"><span class="pres-stat-number">67</span><span class="pres-stat-label">~$3,000/mo<br>Full Retirement Age</span></div>
        <div class="pres-stat-card"><span class="pres-stat-number">70</span><span class="pres-stat-label">~$3,720/mo<br>Maximum &mdash; 24% above FRA</span></div>
    </div>
    <div class="glass-panel mt-4">
        <h3>Why This Matters for Veterans</h3>
        <ul class="feature-list">
            <li><i class="fa-solid fa-check text-gold"></i> <strong>You have a pension floor:</strong> Military retired pay + VA disability means you may not NEED Social Security at 62 &mdash; letting it grow is free money</li>
            <li><i class="fa-solid fa-check text-gold"></i> <strong>Survivor protection:</strong> Your surviving spouse inherits your benefit amount. Claiming at 70 protects them for decades</li>
            <li><i class="fa-solid fa-check text-gold"></i> <strong>Break-even age ~82:</strong> If you live past 82, you come out ahead by waiting. Average 65-year-old male lives to 84</li>
            <li><i class="fa-solid fa-check text-gold"></i> <strong>VA disability doesn't count:</strong> Your VA pay is not counted as income for Social Security taxation thresholds</li>
        </ul>
    </div>
</div>
```

- [ ] **Step 4: Add "The Dollar Math" to sidebar nav**

In the Social Security chapter's `pres-slide-list`, add a new item after "Spousal & Survivor":

```html
<li class="pres-slide-item" tabindex="0" data-slide="9">The Dollar Math</li>
```

Renumber subsequent slides: "Your SS Plan" becomes data-slide="10".

- [ ] **Step 5: Update key takeaways slide**

In the Module 1 Key Takeaways slide (line 321), remove:
- "Federal employees: verify FEHB 5-year enrollment before retirement"
- "File BDD claims 90-180 days before separation for fastest processing"

Add:
- "Delaying Social Security from 62 to 70 can mean $200K-$500K more over a couple's lifetime"
- "Your military pension floor means you may not need SS early — let it grow"

- [ ] **Step 6: Update Module 1 sidebar slide counter**

Change `<span class="pres-total">14</span>` to `<span class="pres-total">12</span>` (line 110).

- [ ] **Step 7: Update Module 1 completion stats**

Change the completion slide (line 337) stats:
- "14 Slides Completed" → "12 Slides Completed"
- Keep "3 Income Sources Covered" and "5 TSP Funds Reviewed"

- [ ] **Step 8: Renumber all data-slide attributes in Module 1**

Walk through all `data-slide` attributes in both the sidebar nav items and ensure they are sequential 0-11 (12 slides total, 0-indexed).

- [ ] **Step 9: Verify in browser**

Open `index.html` in Chrome. Navigate to Module 1. Verify:
- 12 slides total in counter
- All sidebar nav items clickable and highlight correctly
- Arrow navigation works through all 12 slides
- No FEHB/BDD content visible
- New "Dollar Math" slide renders correctly
- Progress bar reaches 100% on last slide

---

## Task 2: Module 3 — Convert VA Priority Groups to Handout Reference

**Files:**
- Modify: `index.html:607-873` (Module 3 section)

**Current state:** 15 slides. VA Priority Groups slide (line 638) is reference material better served as a handout.

**Target state:** 12 slides (11 content + 1 completion). Remove Priority Groups as a full slide, add a brief mention in the Medicare slide instead. Compress Medicaid interaction to a single callout within the Aid & Attendance section rather than a standalone slide.

- [ ] **Step 1: Remove VA Priority Groups slide**

Delete the full `<div class="pres-slide" data-chapter="vahealth">` block at lines 638-654.

- [ ] **Step 2: Remove Medicaid Interaction standalone slide**

Delete the Medicaid Interaction slide (line 810) — the `<div class="pres-slide" data-chapter="aid">` containing Medicaid content. Add a single info-callout about Medicaid to the Aid & Attendance "Eligibility & the 5 ADLs" slide instead:

```html
<div class="info-callout mt-4 alert-warning">
    <i class="fa-solid fa-triangle-exclamation"></i>
    <div><strong>Medicaid interaction:</strong> If you enter a Medicaid-funded facility, VA pension is reduced to approximately $90/month. Medicaid eligibility has its own asset limits and a look-back period. Consult an elder law attorney before transferring assets.</div>
</div>
```

- [ ] **Step 3: Add VA priority group reference to Medicare slide**

In the "Medicare at Age 65" slide (line 679), add a brief reference:

```html
<div class="info-callout mt-4">
    <i class="fa-solid fa-lightbulb"></i>
    <div><strong>VA Healthcare:</strong> Your VA priority group (1-8) determines copays and access. Even if you have Medicare, enroll in VA healthcare to keep your options open. See the Healthcare Benefits Reference handout for the full priority group breakdown.</div>
</div>
```

- [ ] **Step 4: Update Module 3 sidebar nav**

Remove "Priority Groups" slide item from the VA Health chapter. Remove "Medicaid Interaction" from the Aid & Attendance chapter. Renumber all data-slide attributes sequentially (0-11).

- [ ] **Step 5: Update Module 3 slide counter**

Change `pres-total` from 15 to 12.

- [ ] **Step 6: Update Module 3 completion stats**

Update the completion slide: "15 Slides Completed" → "12 Slides Completed".

- [ ] **Step 7: Verify in browser**

Navigate to Module 3. Verify 12 slides, sidebar nav works, priority groups mentioned in Medicare slide, Medicaid callout appears in A&A section.

---

## Task 3: Module 4 — Reframe as "Managing Your Income" and Cut Portfolio Theory

**Files:**
- Modify: `index.html:873-1098` (Module 4 section)
- Modify: `index.html:27-35` (main sidebar nav)
- Modify: `index.html:59-88` (home page card grid)

**Current state:** 14 slides. Three slides on portfolio theory (Sequence of Returns, Bucket Strategy, Replenishment) that don't match audience profile (pension + VA disability + SS = guaranteed income floor). Module name "Protecting Your Money" implies portfolio defense.

**Target state:** 11 slides (10 content + 1 completion). Rename to "Managing Your Retirement Income". Cut Sequence of Returns, Bucket Strategy, and Replenishment (3 slides). Add 1 new slide: "Debt in Retirement: The Reality". Keep Income Stacking, Federal Taxation, State Tax, RMDs, Inflation. Reframe 4% Rule as brief context within Income Stacking rather than standalone.

- [ ] **Step 1: Rename Module 4 everywhere**

Update all occurrences of "Protecting Your Money" to "Managing Your Retirement Income":
- Main sidebar nav (line 32): nav link text
- Home card grid (line 77-80): card title and description
- Module 4 title slide (line 899): heading and subtitle
- Module 4 sidebar header (around line 880): `<h3>` text

Update the home card description to: "Tax-efficient withdrawal order, RMD management, state tax impact, and managing debt on a fixed income."

Update the Module 4 icon from `fa-shield-halved` to `fa-coins` in both the main sidebar nav and home card grid (shield-halved is already used for the overall logo).

- [ ] **Step 2: Remove 3 portfolio theory slides**

Delete these slides:
1. "Sequence of Returns Risk" (line 906) — `data-chapter="risk"`
2. "The Three-Bucket Strategy" (line 914) — `data-chapter="bucket"`  
3. "How Replenishment Works" (line 924) — `data-chapter="bucket"`

- [ ] **Step 3: Remove the 4% Rule slide, merge key point into Income Stacking**

Delete the "4% Rule & Safe Withdrawal Rates" slide (line 936). Add a brief callout to the Income Stacking slide:

```html
<div class="info-callout mt-4 alert-warning">
    <i class="fa-solid fa-triangle-exclamation"></i>
    <div><strong>The 4% guideline:</strong> If you're drawing from savings (TSP/IRA), a common rule of thumb is withdrawing no more than 4% of your balance per year. But with military pension + VA disability + Social Security, most veterans in this room have a guaranteed income floor that reduces reliance on portfolio withdrawals.</div>
</div>
```

- [ ] **Step 4: Add new slide — "Debt in Retirement: The Reality"**

Insert after the State Tax slide discussion, before the RMD slide. New chapter: `debt`.

```html
<div class="pres-slide" data-chapter="debt">
    <h2><i class="fa-solid fa-credit-card text-red"></i> Debt in Retirement: The Reality</h2>
    <p>Most people assume they'll be debt-free by retirement. The data says otherwise:</p>
    <div class="pres-stat-grid">
        <div class="pres-stat-card"><span class="pres-stat-number">97%</span><span class="pres-stat-label">of retirement-age Americans carry non-mortgage debt</span></div>
        <div class="pres-stat-card"><span class="pres-stat-number">68%</span><span class="pres-stat-label">of retirees carry credit card balances</span></div>
        <div class="pres-stat-card"><span class="pres-stat-number">$7,484</span><span class="pres-stat-label">average credit card balance for adults 65+</span></div>
    </div>
    <div class="glass-panel mt-4">
        <h3>Action Steps</h3>
        <ul class="feature-list">
            <li><i class="fa-solid fa-check text-gold"></i> <strong>Pay off high-interest debt before retirement</strong> &mdash; even if it means delaying retirement 6-12 months</li>
            <li><i class="fa-solid fa-check text-gold"></i> <strong>Don't tap TSP/IRA to service credit card debt</strong> &mdash; the tax hit plus lost growth makes it worse</li>
            <li><i class="fa-solid fa-check text-gold"></i> <strong>Consider mortgage payoff math:</strong> if your rate is under 4%, investing may beat early payoff. If over 6%, paying it off gives guaranteed return</li>
            <li><i class="fa-solid fa-check text-gold"></i> <strong>Avoid new debt in retirement</strong> &mdash; on fixed income, there's no earning power to dig out</li>
        </ul>
    </div>
</div>
```

- [ ] **Step 5: Update Module 4 sidebar nav**

Rebuild the chapter list to reflect new structure:
- **Intro** chapter: Title & Objectives (slide 0)
- **Income** chapter: Income Stacking (slide 1), Discussion: Map Your Income (slide 2)
- **Taxes** chapter: Federal Taxation (slide 3), State Tax 2026 (slide 4), Discussion: State Tax Impact (slide 5)
- **Debt** chapter: Debt in Retirement (slide 6)
- **Protection** chapter: Managing RMDs (slide 7), Inflation & Buying Power (slide 8)
- **Wrapup** chapter: Key Takeaways (slide 9), Module Complete (slide 10)

- [ ] **Step 6: Update Module 4 learning objectives**

Replace current objectives with:
- Understand how to stack income sources for tax efficiency
- Know federal and state tax treatment of your retirement income
- Manage RMDs to avoid penalties and control your tax bracket
- Recognize the impact of debt on fixed-income retirement

- [ ] **Step 7: Update Module 4 key takeaways**

Replace current takeaways:
- Stack your income sources — know which are taxable vs. tax-free
- Your state's tax treatment of military pensions can save (or cost) thousands
- Never miss an RMD — the 25% penalty is unforgiving
- Consider Roth conversions before RMD age to reduce future obligations
- Pay off high-interest debt before or early in retirement
- Military pay, VA pay, and Social Security all have COLA — private income doesn't

- [ ] **Step 8: Update Module 4 slide counter and completion stats**

Change `pres-total` to 11. Update completion stats: "11 Slides Completed". Change other stats to match new content (e.g., "5 Income Streams Mapped", "9 No-Tax States Listed").

- [ ] **Step 9: Verify in browser**

Navigate to Module 4. Verify 11 slides, renamed module throughout, no portfolio theory content, new debt slide renders, sidebar nav works, progress bar correct.

---

## Task 4: Module 2 — Add VA Pension/Lookback Slide, Strengthen Scams

**Files:**
- Modify: `index.html:364-607` (Module 2 section)

**Current state:** 12 slides. Scams slide (line 542) covers pension poaching, claims sharks, VA impersonation, and A&A mills in a single slide. VA Pension eligibility and the 36-month lookback rule are not covered.

**Target state:** 12 slides (same count — swap content). Replace the thin scams overview with two stronger slides: one on VA Pension eligibility + lookback, one deeper fraud/scam slide.

- [ ] **Step 1: Replace "Social Security & VA Interaction" slide with "VA Pension & the Lookback Rule"**

The SS & VA Interaction slide (line 530) covers content already taught in Module 1. Replace it entirely:

```html
<div class="pres-slide" data-chapter="awareness">
    <h2><i class="fa-solid fa-hand-holding-dollar text-blue"></i> VA Pension &amp; the 36-Month Lookback</h2>
    <p>The VA pension is a needs-based benefit for wartime veterans with limited income and assets. It's separate from disability compensation &mdash; and one of the most underutilized benefits in the VA system.</p>
    <div class="glass-panel mt-4">
        <ul class="feature-list">
            <li><i class="fa-solid fa-check text-gold"></i> <strong>Wartime service required:</strong> 90+ days active duty, at least 1 day during a wartime period</li>
            <li><i class="fa-solid fa-check text-gold"></i> <strong>Age 65+ or permanently disabled</strong></li>
            <li><i class="fa-solid fa-check text-gold"></i> <strong>2026 net worth limit:</strong> $163,699 (includes most assets except home and vehicle)</li>
            <li><i class="fa-solid fa-check text-gold"></i> <strong>Enhanced by Aid &amp; Attendance</strong> (covered in Module 3)</li>
        </ul>
    </div>
    <div class="info-callout mt-4 alert-warning">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <div><strong>The 36-month lookback:</strong> The VA reviews asset transfers made in the 36 months before your application. If you moved money to appear eligible, your claim can be denied or you may be required to repay benefits. This is exactly what pension poaching scams exploit &mdash; "advisors" who restructure your assets to qualify, leaving you exposed.</div>
    </div>
</div>
```

- [ ] **Step 2: Expand the scams slide with specific dollar amounts**

Replace the existing "Veteran Benefit Scams" slide (line 542) with a more impactful version:

```html
<div class="pres-slide" data-chapter="awareness">
    <h2><i class="fa-solid fa-skull-crossbones text-red"></i> Veteran Benefit Scams: A $584 Million Crisis</h2>
    <p>Veterans lost <strong>$584 million to fraud in 2024</strong>. Twenty-seven percent of all veterans have lost money to a scam at some point. You are specifically targeted because of your guaranteed income.</p>
    <div class="glass-panel mt-4 border-red">
        <h3>Top Threats for This Room</h3>
        <ul class="feature-list">
            <li><i class="fa-solid fa-xmark text-red"></i> <strong>Claim Sharks:</strong> Charge $3,000-$10,000+ to file VA claims. This is illegal &mdash; VSOs do it free</li>
            <li><i class="fa-solid fa-xmark text-red"></i> <strong>Pension Poaching:</strong> "Advisors" restructure your assets into annuities to qualify you for VA pension, then pocket fees while you risk repayment</li>
            <li><i class="fa-solid fa-xmark text-red"></i> <strong>VA Impersonation:</strong> Phone/email scams claiming you owe money or must "verify" your account. The VA will never call demanding payment</li>
            <li><i class="fa-solid fa-xmark text-red"></i> <strong>Predatory Financial Products:</strong> High-fee annuities, whole life insurance, and crypto sold to veterans receiving lump-sum back-pay</li>
        </ul>
    </div>
    <div class="glass-panel mt-4 border-green">
        <h3>Protect Yourself</h3>
        <ul class="feature-list">
            <li><i class="fa-solid fa-check text-green"></i> <strong>Never pay</strong> for VA claims assistance &mdash; use accredited VSOs (DAV, VFW, American Legion)</li>
            <li><i class="fa-solid fa-check text-green"></i> Verify anyone offering benefit help at <strong>va.gov/vso</strong></li>
            <li><i class="fa-solid fa-check text-green"></i> Report scams to the <strong>VA OIG: 1-800-488-8244</strong> or <strong>FTC: reportfraud.ftc.gov</strong></li>
        </ul>
    </div>
</div>
```

- [ ] **Step 3: Update Module 2 sidebar nav**

Rename the "Social Security & VA" item to "VA Pension & Lookback" and the scams item to "Scams: $584M Crisis". Keep slide count at 12.

- [ ] **Step 4: Update Module 2 key takeaways**

Replace the SS/VA interaction takeaway with:
- "VA pension is needs-based with a 36-month asset lookback — don't fall for restructuring scams"
- "Veterans lost $584M to fraud in 2024 — never pay for claims assistance"

- [ ] **Step 5: Verify in browser**

Navigate to Module 2. Verify 12 slides, new VA Pension slide, stronger scams slide, sidebar nav correct.

---

## Task 5: Module 5 — Expand Exploitation Prevention, Compress Estate Docs

**Files:**
- Modify: `index.html:1100-1373` (Module 5 section)

**Current state:** 14 slides. Estate documents get 4 slides (essentials, burial, beneficiary checklist, discussion). Exploitation/cognitive decline gets 1 slide.

**Target state:** 12 slides (11 content + 1 completion). Compress estate essentials + burial into 1 combined slide. Add a "Cognitive Decline Planning" slide in the Protection chapter.

- [ ] **Step 1: Merge Estate Essentials and VA Burial into one slide**

Replace the "Estate Planning Essentials" slide (line 1235) with a combined version that covers both the 4 documents and burial benefits concisely:

```html
<div class="pres-slide" data-chapter="estate">
    <h2><i class="fa-solid fa-gavel text-blue"></i> Estate Essentials &amp; VA Burial</h2>
    <div class="grid-2-col">
        <div class="glass-panel">
            <h3>Four Documents Every Veteran Needs</h3>
            <ul class="feature-list">
                <li><i class="fa-solid fa-check text-gold"></i> <strong>Will</strong> &mdash; directs asset distribution</li>
                <li><i class="fa-solid fa-check text-gold"></i> <strong>Durable Power of Attorney</strong> &mdash; financial decisions if incapacitated</li>
                <li><i class="fa-solid fa-check text-gold"></i> <strong>Healthcare Power of Attorney</strong> &mdash; medical decisions</li>
                <li><i class="fa-solid fa-check text-gold"></i> <strong>Advance Directive</strong> &mdash; end-of-life care wishes</li>
            </ul>
            <p class="mt-3"><strong>Free help:</strong> Military legal offices and VSOs offer free estate planning.</p>
        </div>
        <div class="glass-panel">
            <h3>VA Burial Benefits (Free)</h3>
            <ul class="feature-list">
                <li><i class="fa-solid fa-check text-gold"></i> National cemetery gravesite at no cost</li>
                <li><i class="fa-solid fa-check text-gold"></i> Government headstone/marker</li>
                <li><i class="fa-solid fa-check text-gold"></i> Burial flag &amp; Presidential Memorial Certificate</li>
                <li><i class="fa-solid fa-check text-gold"></i> Burial allowance: up to $2,000+ (service-connected)</li>
            </ul>
            <p class="mt-3"><strong>Pre-plan:</strong> File VA Form 40-10007 now.</p>
        </div>
    </div>
</div>
```

- [ ] **Step 2: Remove the standalone VA Burial Benefits slide**

Delete the "VA Burial Benefits" slide (line 1260) since it's now merged into Step 1.

- [ ] **Step 3: Add "Cognitive Decline Planning" slide**

Insert after the existing "Protecting Your Estate" slide (line 1310), within the `protect` chapter:

```html
<div class="pres-slide" data-chapter="protect">
    <h2><i class="fa-solid fa-brain text-blue"></i> Planning for Cognitive Decline</h2>
    <p>Nobody wants to think about this, but it's one of the most important financial decisions you can make <strong>while you're still sharp enough to make it.</strong></p>
    <div class="glass-panel mt-4">
        <h3>Act Now, While You Can</h3>
        <ul class="feature-list">
            <li><i class="fa-solid fa-check text-gold"></i> <strong>Durable Power of Attorney:</strong> "Durable" means it stays in effect if you become incapacitated. A regular POA does not. Make sure yours says "durable"</li>
            <li><i class="fa-solid fa-check text-gold"></i> <strong>Trusted Contact Person:</strong> Authorize your bank and brokerage to contact someone if they notice unusual activity. This is free and takes 5 minutes</li>
            <li><i class="fa-solid fa-check text-gold"></i> <strong>Successor Trustee:</strong> If you have a trust, name a backup trustee who can step in</li>
            <li><i class="fa-solid fa-check text-gold"></i> <strong>VA Representative Payee:</strong> If you can no longer manage VA benefits, the VA can appoint a fiduciary. Nominate someone you trust before it's needed</li>
        </ul>
    </div>
    <div class="info-callout mt-4">
        <i class="fa-solid fa-lightbulb"></i>
        <div><strong>The conversation:</strong> Tell your spouse or adult children where your documents are, who your financial contacts are, and what accounts you have. Write it down. This single act prevents more financial chaos than any legal document.</div>
    </div>
</div>
```

- [ ] **Step 4: Update Module 5 sidebar nav**

Rebuild chapter list:
- **Introduction**: Title & Objectives (0)
- **Survivor Benefit Plan**: Understanding Your SBP (1), Premiums & Paid-Up (2), What If You Declined? (3), Discussion: Your SBP (4)
- **DIC & Planning**: DIC Overview (5), Financial Modeling (6)
- **Estate & Burial**: Estate Essentials & VA Burial (7), Beneficiary Checklist (8), Discussion: When Did You Last Check? (9)
- **Protection**: Protecting Your Estate (10), Cognitive Decline Planning (11)
- **Course Complete**: Key Takeaways (12), Course Complete (13)

Wait — that's 14 slides. We removed 1 (burial merged) and added 1 (cognitive decline) = net 0 change. We need to cut 1 more. Remove the "Financial Modeling Recommendation" slide (line 1218) — it's generic advisor advice, not actionable in a classroom. Fold its one key point (SBP-DIC offset eliminated 2023) into the DIC Overview slide as a callout.

Updated chapter list:
- **Introduction**: Title & Objectives (0)
- **Survivor Benefit Plan**: Understanding Your SBP (1), Premiums & Paid-Up (2), What If You Declined? (3), Discussion: Your SBP (4)
- **DIC**: DIC Overview (5)
- **Estate & Burial**: Estate Essentials & VA Burial (6), Beneficiary Checklist (7), Discussion: When Did You Last Check? (8)
- **Protection**: Protecting Your Estate (9), Cognitive Decline Planning (10)
- **Course Complete**: Key Takeaways (11), Course Complete (12)

That's 13 slides (12 content + 1 completion) — but we're targeting ~12. Close enough, and the content is all high-value.

- [ ] **Step 5: Remove Financial Modeling slide, merge into DIC**

Delete the "Financial Modeling Recommendation" slide (line 1218). Add to the DIC Overview slide:

```html
<div class="info-callout mt-4">
    <i class="fa-solid fa-lightbulb"></i>
    <div><strong>Consult a financial advisor</strong> to model your family's specific SBP + DIC + Social Security survivor income. The interaction between these benefits is complex and worth professional analysis.</div>
</div>
```

- [ ] **Step 6: Update Module 5 key takeaways**

Add:
- "Set up a trusted contact at your bank — it takes 5 minutes and can prevent exploitation"
- "Tell your family where your documents are and what accounts you have"

- [ ] **Step 7: Update Module 5 slide counter and completion stats**

Change `pres-total` to 13. Update completion stats: "13 Slides Completed".

- [ ] **Step 8: Update final course completion stats**

In the "Course Complete" slide (line 1349), change "69 Slides Reviewed" to the new total (~55).

- [ ] **Step 9: Verify in browser**

Navigate to Module 5. Verify 13 slides, merged estate/burial slide, new cognitive decline slide, no financial modeling slide, sidebar nav works.

---

## Task 6: Update Home Page and Main Sidebar

**Files:**
- Modify: `index.html:27-88` (sidebar nav + home section)

- [ ] **Step 1: Update Module 4 in main sidebar nav**

Change line 32:
- Text: "Module 4: Managing Income" (shorter for sidebar)
- Icon: `fa-coins` instead of `fa-shield-halved`

- [ ] **Step 2: Update Module 4 home card**

Update the card (lines 77-80):
- Title: "Managing Your Retirement Income"
- Description: "Tax-efficient withdrawal order, RMD management, state tax impact, and managing debt on fixed income."
- Icon: `fa-coins`

- [ ] **Step 3: Verify home page**

Load `index.html`. Check all 5 module cards display correct titles and descriptions. Click each card to navigate to the right module.

---

## Task 7: Update Supporting Documents

**Files:**
- Modify: `course-description.html`
- Modify: `syllabus.html`
- Modify: `CLAUDE.md`

- [ ] **Step 1: Clean course-description.html**

Remove or replace:
- "BDD claims, BRS, DD-214, retirement pay, TSP, TAP" → "Retirement pay, TSP, Social Security optimization"
- "Veterans transitioning from active duty to civilian life" → remove this line entirely from "Who Should Attend"
- Any FEHB/CSRS/FERS references
- Update Module 4 name to "Managing Your Retirement Income"
- Update slide count references

- [ ] **Step 2: Clean syllabus.html**

Update:
- Module 4 name and topic description
- Slide counts per module (12, 12, 12, 11, 13 = ~60)
- Remove BDD/FEHB references from Module 1 topics
- Add VA Pension/Lookback and expanded scams to Module 2 topics
- Add Debt and Cognitive Decline to relevant module topics

- [ ] **Step 3: Update CLAUDE.md**

Update the Course Modules table:
- Module 1: Remove "BDD claims, BRS options, CSRS/FERS timelines", add "Social Security claiming strategy"
- Module 3: Remove "FEHB integration"
- Module 4: Rename to "Managing Your Retirement Income", update focus
- Update project overview to remove "federal employees" from purpose line
- Update slide counts in any references

- [ ] **Step 4: Verify all three documents**

Open each in browser/editor. Search for any remaining wrong-audience terms: BDD, FEHB, CSRS, FERS, "transitioning", "federal employee" (unless specifically about veterans with federal civilian careers).

---

## Task 8: Final Slide Count Verification and Cross-Module Consistency

**Files:**
- Modify: `index.html` (any remaining discrepancies)

- [ ] **Step 1: Count all slides per module**

Run a grep to count `class="pres-slide"` occurrences per module section. Expected:
- Module 1: 12
- Module 2: 12
- Module 3: 12
- Module 4: 11
- Module 5: 13
- **Total: ~60**

- [ ] **Step 2: Verify all sidebar nav data-slide attributes are sequential**

For each module, ensure data-slide values run 0, 1, 2, ... N-1 with no gaps or duplicates.

- [ ] **Step 3: Verify all pres-total counters match actual slide counts**

Search for all `pres-total` spans and verify each matches its module's actual count.

- [ ] **Step 4: Verify all completion stat numbers match**

Each module's completion slide should show the correct "N Slides Completed".

- [ ] **Step 5: Test full navigation**

Open in Chrome. For each module:
- Click through all slides with Next/Previous buttons
- Use keyboard arrows
- Click sidebar nav items
- Verify progress bar reaches 100%
- Verify completion slide renders

- [ ] **Step 6: Test dark mode**

Toggle dark mode. Verify all new slides render correctly in both themes.

- [ ] **Step 7: Commit**

```bash
git add index.html course-description.html syllabus.html CLAUDE.md
git commit -m "refactor: refine curriculum for 10-hour delivery

- Remove FEHB/BDD content (wrong audience)
- Expand Social Security claiming strategy (highest-impact topic)
- Reframe Module 4 as income management, cut portfolio theory
- Add VA Pension lookback rule and expanded fraud content
- Add debt in retirement and cognitive decline planning slides
- Compress estate docs, merge VA burial into combined slide
- Reduce from 69 to ~60 slides for realistic pacing
- Clean supporting docs of wrong-audience references"
```
