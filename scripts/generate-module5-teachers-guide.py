"""Generate the Module 5 Teacher's Guide PDF.

Module 5 covers Legacy and Estate Planning: Survivor Benefit Plan (SBP),
Dependency & Indemnity Compensation (DIC) and the 2023 offset elimination,
estate documents and VA burial benefits, beneficiary designations, and
planning for cognitive decline and elder financial exploitation.
"""

import os

from reportlab.platypus import PageBreak, Paragraph, Spacer

from _teacher_guide_common import (  # type: ignore[import-not-found]
    CALLOUT_DO_NOT_BG, CALLOUT_DO_NOT_BORDER,
    CALLOUT_NUMBERS_BG, CALLOUT_NUMBERS_BORDER,
    CALLOUT_WATCH_BG, CALLOUT_WATCH_BORDER,
    build_cover_page, build_pdf, callout, data_table, make_styles,
    numbers_table, part_header, prep_checklist_section, qa_callout,
)


def build_cover(styles: dict) -> list:
    return build_cover_page(
        styles,
        module_label="MODULE 5",
        title="Teacher's Guide",
        subtitle="Legacy &amp; Estate Planning &mdash; SBP, DIC, Beneficiaries &amp; Cognitive-Decline Prep",
        purpose_html=(
            "Module 5 is the closing class. By now your students have learned the income side; this is the "
            "&quot;what happens to my family&quot; side. SBP is the most consequential decision they ever "
            "made (or didn't make). Beneficiary forms control more money than wills do. And the hardest "
            "conversation &mdash; planning for cognitive decline &mdash; is the one that prevents the worst "
            "outcomes."
            "<br/><br/>This module is also the most personal one you'll teach. Some of your students elected "
            "SBP and want to know if it's still a good deal. Some declined and may regret it. Some are "
            "widowed and worried. Some are caring for an aging parent and trying to figure out the next "
            "decade. Lead with empathy and let the questions come."
        ),
        north_star_html=(
            "You are an <b>educator</b>, not an <b>estate-planning attorney</b>. When a student asks "
            "&quot;should I get a trust?&quot; or &quot;should I drop SBP?&quot; the answer is always: "
            "&quot;Here's what the rule does &mdash; here's what to think through &mdash; then talk to a "
            "VA-accredited elder-law attorney or your base legal-assistance office.&quot; This module "
            "is full of <i>irreversible</i> decisions. SBP is irrevocable. Beneficiary forms override "
            "wills. Trusts are expensive to undo. Always recommend professional help for the actual "
            "decision."
        ),
        toc_rows=[
            ("1", "Survivor Benefit Plan (SBP) &mdash; Mechanics &amp; Choices", "2"),
            ("2", "DIC &amp; the 2023 Offset Elimination", "5"),
            ("3", "Estate Documents &amp; VA Burial Benefits", "7"),
            ("4", "Beneficiaries &amp; Cognitive-Decline Planning", "10"),
            ("5", "The Day Before Class &mdash; Your Prep Checklist", "12"),
        ],
    )


def build_part1_sbp(styles: dict) -> list:
    story: list = []
    story.extend(part_header(styles, "Part 1 &mdash; The Survivor Benefit Plan (SBP)"))

    story.append(Paragraph("What SBP Is, In One Sentence", styles["h2"]))
    story.append(Paragraph(
        "The <b>Survivor Benefit Plan (SBP)</b> is a DoD-administered, government-subsidized annuity that "
        "pays a designated beneficiary &mdash; usually a spouse &mdash; <b>55% of the retiree's selected "
        "base amount</b> for life when the retiree dies. Premiums are deducted from retired pay (pre-tax), "
        "and after the retiree dies, payments to the survivor are taxable income to them. SBP "
        "automatically adjusts with COLA, so it's inflation-protected for the survivor's lifetime.",
        styles["body"]
    ))
    story.append(Paragraph(
        "SBP is selected at the moment of retirement on <b>DD Form 2656</b>. The election is "
        "<b>irrevocable</b> &mdash; the retiree cannot drop it later (with limited exceptions during "
        "Congressional Open Seasons). Spouses are notified in writing if the retiree elects less than full "
        "coverage; spousal concurrence is required. Most veterans you'll teach made this decision 10-30 "
        "years ago.",
        styles["body"]
    ))

    story.append(numbers_table(styles, [
        ("Annuity to spouse", "55% of selected base amount"),
        ("Premium", "6.5% of base amount, deducted from pre-tax retired pay"),
        ("COLA", "Annual, matches CPI"),
        ("Election form", "DD Form 2656 (at retirement)"),
        ("&quot;Paid-Up&quot; status", "After 360 months (30 yrs) of premiums AND age 70"),
        ("Survivor benefit duration", "Life (suspended if survivor remarries before 55, reinstated if remarriage ends)"),
        ("Tax treatment of premiums", "Pre-tax (reduces current income)"),
        ("Tax treatment to survivor", "Ordinary income"),
    ]))

    story.append(Spacer(1, 6))
    story.append(Paragraph("The Pros &amp; Cons &mdash; Why It's a Real Decision", styles["h2"]))

    story.append(Paragraph("<b>What SBP does well:</b>", styles["body_bold"]))
    story.append(Paragraph(
        "&bull; <b>Lifetime guarantee.</b> The survivor cannot outlive the benefit, the way they could a "
        "drawn-down portfolio.<br/>"
        "&bull; <b>Inflation-protected.</b> Annual COLA matches CPI &mdash; private annuities almost never do this.<br/>"
        "&bull; <b>DoD-subsidized.</b> The premium covers about 60% of the actuarial cost; the government "
        "covers the rest. Equivalent commercial coverage costs significantly more.<br/>"
        "&bull; <b>No medical underwriting.</b> A retiree in poor health pays the same premium as a healthy one.<br/>"
        "&bull; <b>Spouse remarriage protection.</b> Coverage suspends only if remarriage occurs before "
        "age 55, and reinstates if that marriage ends.",
        styles["body"]
    ))

    story.append(Paragraph("<b>Where SBP can disappoint:</b>", styles["body_bold"]))
    story.append(Paragraph(
        "&bull; <b>Irrevocable election.</b> Once you check the box at retirement, you're locked in (with "
        "narrow Congressional Open Season exceptions).<br/>"
        "&bull; <b>No principal access.</b> Premiums don't build cash value. If the beneficiary dies first, "
        "premiums are not refunded.<br/>"
        "&bull; <b>Taxable to survivor.</b> Beneficiary pays ordinary income tax on the annuity.<br/>"
        "&bull; <b>Suspends if remarriage before 55.</b> Surviving spouse who remarries young loses "
        "benefits during that marriage.",
        styles["body"]
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("&quot;Paid-Up&quot; Status &mdash; What It Actually Means", styles["h2"]))
    story.append(Paragraph(
        "After <b>360 months (30 years) of premium payments AND reaching age 70</b>, SBP becomes "
        "&quot;paid-up.&quot; Premiums stop. Coverage continues. <b>Both</b> conditions must be met &mdash; "
        "30 years alone isn't enough; age 70 alone isn't enough.",
        styles["body"]
    ))
    story.append(Paragraph(
        "For a 20-year retiree who retired at 38 with full SBP, premiums stop at age 68 (the 30-year mark) "
        "or 70, whichever comes later &mdash; so 70. For a 30-year retiree who retired at 50, premiums also "
        "stop at age 70 (which is also the 20-year mark of premiums in that case &mdash; wait, no, that's "
        "20 years; they need 30 of premiums). The math: <b>start year + 30 = year premiums COULD stop, but "
        "actually stop at age 70 if that's later</b>. Most veterans hit paid-up status around 70.",
        styles["body"]
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("&quot;What If I Declined SBP?&quot; &mdash; The Quiet Crisis", styles["h2"]))
    story.append(Paragraph(
        "A meaningful percentage of your students declined SBP at retirement. Some had reasons (separate "
        "savings, term life, predecessor wife). Some were given bad advice. Some didn't realize what they "
        "were declining. Most cannot reverse the decision &mdash; with two narrow exceptions:",
        styles["body"]
    ))
    story.append(Paragraph(
        "&bull; <b>Congressional Open Seasons.</b> The 2023&ndash;2024 NDAA created a one-year SBP Open "
        "Season for retirees who had previously declined. Future Open Seasons may be authorized again. "
        "<i>Watch for them and tell students to act fast when one is announced.</i><br/>"
        "&bull; <b>Marriage after retirement.</b> A retiree who marries (or remarries) after their original "
        "SBP decision has a one-year window to elect SBP for the new spouse.",
        styles["body"]
    ))
    story.append(Paragraph(
        "If neither exception applies, the choices are the imperfect commercial alternatives:",
        styles["body"]
    ))
    story.append(Paragraph(
        "&bull; <b>Term life insurance</b> &mdash; cheap if healthy and young; expensive or unavailable in "
        "older age. Eventually the term expires.<br/>"
        "&bull; <b>Permanent (whole or universal) life</b> &mdash; expensive, complex, frequently oversold "
        "to veterans. Most are not worth the premium.<br/>"
        "&bull; <b>Self-insure with investments</b> &mdash; possible if portfolio is large enough, but "
        "subject to market risk and longevity risk.<br/>"
        "&bull; <b>VGLI / SGLI conversion</b> &mdash; lower priority but still relevant for some.",
        styles["body"]
    ))

    story.append(callout(
        styles,
        "WATCH OUT &mdash; The SBP Replacement Annuity Pitch",
        "After a veteran retires without SBP, insurance agents pitch <b>&quot;SBP replacement annuities&quot;</b> "
        "&mdash; expensive whole-life or annuity products marketed as equivalent. <b>They are not.</b> Almost "
        "none have COLA. None are DoD-subsidized. None are tax-equivalent. Tell students: <b>&quot;If "
        "someone says they have a product as good as SBP, they're wrong &mdash; and probably collecting "
        "a commission to convince you otherwise.&quot;</b>",
        CALLOUT_WATCH_BG, CALLOUT_WATCH_BORDER,
    ))

    story.append(qa_callout(styles, "IF A STUDENT ASKS&hellip;", [
        (
            "I declined SBP. Was that a mistake?",
            "<b>You cannot answer this for them.</b> It depends on their spouse's other resources, savings, "
            "what they did with the premium money instead, and survivor longevity. Frame it: &quot;SBP is "
            "guaranteed, inflation-protected, and DoD-subsidized &mdash; nothing private fully replaces "
            "those features. If your spouse outlives you and her other resources are thin, that's where "
            "SBP would have helped most. If you want to revisit, watch for the next Open Season.&quot;",
        ),
        (
            "I have SBP and full life insurance. Should I drop SBP to save the premium?",
            "<b>You cannot drop SBP outside an Open Season.</b> But also, dropping it generally makes no "
            "sense even if it were possible &mdash; SBP's COLA-protected, lifetime, government-subsidized "
            "structure is hard to beat. Life insurance pays a one-time benefit; SBP pays for life. They "
            "complement each other.",
        ),
        (
            "What happens to SBP if my spouse dies before me?",
            "Coverage <b>suspends.</b> The retiree can re-elect SBP for a new spouse if they remarry, "
            "within one year of remarriage. They can also designate a child or, in limited cases, a "
            "<b>natural person with insurable interest</b> as beneficiary &mdash; this is rare and has "
            "specific rules.",
        ),
        (
            "If my wife remarries after I die, does she lose the benefit?",
            "<b>Only if she remarries before age 55.</b> Remarriage at 55 or later does NOT terminate SBP. "
            "If she remarries before 55, SBP suspends during that marriage. If that marriage ends "
            "(divorce, death, annulment), SBP resumes.",
        ),
    ]))

    story.append(PageBreak())
    return story


def build_part2_dic(styles: dict) -> list:
    story: list = []
    story.extend(part_header(styles, "Part 2 &mdash; DIC &amp; the 2023 Offset Elimination"))

    story.append(Paragraph("What DIC Is", styles["h2"]))
    story.append(Paragraph(
        "<b>Dependency and Indemnity Compensation (DIC)</b> is a <b>tax-free monthly benefit</b> from the "
        "VA paid to surviving spouses (and certain children/parents) when a veteran's death is service-connected. "
        "Because it's a VA program, it's regulated by Title 38 and is <b>completely separate</b> from SBP "
        "(which comes from DoD).",
        styles["body"]
    ))
    story.append(Paragraph(
        "<b>Three pathways</b> to DIC eligibility (any one suffices):",
        styles["body"]
    ))
    story.append(Paragraph(
        "&bull; The veteran <b>died from a service-connected condition</b>.<br/>"
        "&bull; The veteran <b>died on active duty</b>, in active or inactive duty for training.<br/>"
        "&bull; The veteran was <b>rated totally disabled (100%)</b> from a service-connected condition for "
        "10+ years before death (or 5+ years from discharge, or 1+ year if a former POW).",
        styles["body"]
    ))

    story.append(numbers_table(styles, [
        ("Base DIC rate (2026, surviving spouse)", "$1,699.36/month"),
        ("Plus &mdash; spouse with dependent children", "+$432.27/month per child"),
        ("Plus &mdash; eligibility for A&amp;A or housebound", "Additional amounts"),
        ("Tax treatment", "Tax-free, federal &amp; state"),
        ("COLA", "Annual"),
        ("Application form", "VA Form 21P-534EZ"),
        ("Where filed", "va.gov/burials-and-memorials/dependency-indemnity-compensation"),
    ]))

    story.append(Spacer(1, 6))
    story.append(Paragraph("The 2023 Offset Elimination &mdash; Why This Matters", styles["h2"]))
    story.append(Paragraph(
        "Until <b>January 1, 2023</b>, federal law required SBP to be reduced (offset) dollar-for-dollar by "
        "any DIC the survivor received. Surviving spouses who qualified for both effectively only got DIC "
        "&mdash; SBP became a refund of the dead retiree's premiums. This was widely known as the "
        "&quot;widow's tax.&quot; It had been protested for decades.",
        styles["body"]
    ))
    story.append(Paragraph(
        "The 2020 NDAA phased out the offset over three years (2021-2022-2023). As of <b>January 1, 2023</b>, "
        "the offset is <b>fully eliminated</b>. Surviving spouses now receive <b>both SBP and DIC in full</b>, "
        "with no reduction. For families where the veteran has a service-connected condition, this dramatically "
        "increased the value of SBP.",
        styles["body"]
    ))

    story.append(callout(
        styles,
        "TALKING POINT &mdash; The 2023 Change Re-Argues SBP",
        "If you teach this section right, half your room will leave with their understanding of SBP "
        "updated. Before 2023, SBP&ndash;DIC offset made SBP feel pointless for service-connected veterans. "
        "<b>That logic is gone.</b> A surviving spouse can now receive a full SBP annuity AND full tax-free "
        "DIC stacked together. For a veteran with a service-connected condition that may shorten life, "
        "SBP is now strictly more valuable than it was before. <b>Tell students: if their reasoning for "
        "declining SBP was the offset, that reasoning is obsolete.</b>",
        CALLOUT_NUMBERS_BG, CALLOUT_NUMBERS_BORDER,
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("Survivor Income Stack &mdash; What a Spouse Actually Receives", styles["h2"]))
    story.append(Paragraph(
        "When a covered military retiree dies, the surviving spouse may stack <b>several</b> survivor "
        "incomes simultaneously. The combination is potent and often surprises people. A worked example, "
        "spouse of a 100%-rated retired veteran whose death is service-connected:",
        styles["body"]
    ))

    story.append(data_table(
        styles,
        ["Source", "Approximate amount", "Tax treatment"],
        [
            ["SBP annuity (55% of base)", "Varies by election; e.g. $2,200/mo", "Ordinary income"],
            ["DIC base", "$1,699/mo (2026)", "Tax-free"],
            ["Social Security survivor benefit", "Up to 100% of veteran's PIA", "0&ndash;85% taxable (provisional)"],
            ["VA pension to survivor (if low income)", "Up to ~$1,558/mo with A&amp;A", "Tax-free"],
            ["TSP / IRA inheritance", "Whatever balance was left", "Per beneficiary form"],
            ["VGLI / SGLI death benefit", "Up to $500,000 lump sum", "Tax-free"],
        ],
        col_widths=[2.6, 2.0, 2.2],
    ))

    story.append(Spacer(1, 4))
    story.append(callout(
        styles,
        "WATCH OUT &mdash; Apply for DIC Right Away",
        "DIC is <b>not</b> automatic. The surviving spouse has to apply (VA Form 21P-534EZ). The benefit "
        "is paid retroactively to the date of the veteran's death IF applied for within one year; "
        "otherwise it's only retroactive to the application date. <b>Tell students to make sure their "
        "spouse knows this</b> &mdash; missing the window leaves money on the table.",
        CALLOUT_WATCH_BG, CALLOUT_WATCH_BORDER,
    ))

    story.append(qa_callout(styles, "IF A STUDENT ASKS&hellip;", [
        (
            "Is DIC tax-free even if my wife works?",
            "<b>Yes &mdash; tax-free always.</b> DIC is excluded from income at federal and state level. It "
            "doesn't affect Social Security taxation, doesn't trigger IRMAA, doesn't show up on the 1040. "
            "Same as VA disability for living veterans.",
        ),
        (
            "Will my wife get my Social Security AND DIC AND SBP?",
            "<b>Yes, all three</b> &mdash; if she qualifies. Social Security survivor benefits are paid by "
            "SSA. SBP is paid by DFAS. DIC is paid by VA. Three different agencies, three different "
            "applications, three different deposits. All three stack with no offset.",
        ),
        (
            "I'm 70% rated &mdash; would my wife qualify for DIC if I die of natural causes?",
            "<b>Maybe not.</b> DIC pays when death is service-connected, OR when the veteran was "
            "<b>100%-rated for 10+ years before death</b> (or 5+ years from discharge, or 1 year if POW). "
            "A 70%-rated veteran who dies of unrelated causes generally does NOT trigger DIC. <b>This is "
            "why aiming for an accurate rating matters &mdash; even decades after retirement.</b>",
        ),
        (
            "What if my service-connected condition was the cause of my death but isn't on my death certificate?",
            "The spouse can still file for DIC and request a service-connection determination. The VA will "
            "review medical evidence. <b>Refer the surviving spouse to a VSO immediately</b> &mdash; this "
            "is exactly the kind of claim where free, accredited help is essential.",
        ),
    ]))

    story.append(PageBreak())
    return story


def build_part3_estate(styles: dict) -> list:
    story: list = []
    story.extend(part_header(styles, "Part 3 &mdash; Estate Documents &amp; VA Burial"))

    story.append(Paragraph("The Four Documents Every Veteran Needs", styles["h2"]))
    story.append(Paragraph(
        "Estate planning at retirement age is not about who gets the lake house. It's about preventing "
        "courts and strangers from making decisions when the veteran (or spouse) cannot. Four documents do "
        "almost all of the heavy lifting:",
        styles["body"]
    ))

    story.append(data_table(
        styles,
        ["Document", "What it does", "Without it&hellip;"],
        [
            [
                "Will (Last Will &amp; Testament)",
                "Directs distribution of probate assets; names guardian for minor dependents.",
                "State intestacy law decides &mdash; often not what the veteran wanted.",
            ],
            [
                "Durable Power of Attorney (financial)",
                "Names someone to manage finances if the veteran is incapacitated.",
                "Family must petition court for guardianship &mdash; slow &amp; expensive.",
            ],
            [
                "Healthcare Power of Attorney",
                "Names someone to make medical decisions if the veteran can't.",
                "Hospitals follow next-of-kin rules; family disputes happen.",
            ],
            [
                "Advance Directive (Living Will)",
                "States the veteran's wishes for end-of-life medical care.",
                "Family must guess; emotional disagreements cause harm.",
            ],
        ],
        col_widths=[2.0, 2.6, 2.2],
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("Where to Get Them &mdash; Free &amp; Cheap Options", styles["h2"]))
    story.append(Paragraph(
        "&bull; <b>Active military legal-assistance offices</b> &mdash; some bases continue to serve "
        "retirees. Free.<br/>"
        "&bull; <b>VSO offices</b> (DAV, VFW, American Legion) &mdash; many have free notarization and "
        "can refer to volunteer attorneys.<br/>"
        "&bull; <b>State and local Veterans Affairs offices</b> &mdash; often have estate-planning clinics.<br/>"
        "&bull; <b>VA-accredited attorneys</b> &mdash; for complex estates or trusts; expect $300-$1,500 "
        "for a basic package.<br/>"
        "&bull; <b>State bar referral services</b> &mdash; sliding scale based on income.",
        styles["body"]
    ))

    story.append(callout(
        styles,
        "DO NOT SAY &mdash; The Online-Forms Trap",
        "Do not recommend <b>LegalZoom, Rocket Lawyer, or other online form services</b> for veterans with "
        "any complexity (kids from a prior marriage, real estate in multiple states, special-needs heir, "
        "blended family, business interests). The forms are valid documents, but the <i>strategy</i> &mdash; "
        "what to put in them &mdash; is the part that matters. A $300 attorney visit can prevent six-figure "
        "probate disasters. Tell students: <b>&quot;The forms are easy. The strategy is what an attorney "
        "is paid to think through.&quot;</b>",
        CALLOUT_DO_NOT_BG, CALLOUT_DO_NOT_BORDER,
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("VA Burial Benefits &mdash; What's Free, What's Reimbursed", styles["h2"]))
    story.append(Paragraph(
        "Every veteran with an honorable or general discharge is entitled to a set of <b>burial benefits</b> "
        "from the VA. These are real money, and most families don't know what's available until after the "
        "death &mdash; when they're least equipped to navigate the paperwork. Pre-planning costs nothing "
        "and saves families thousands at the worst possible moment.",
        styles["body"]
    ))

    story.append(numbers_table(styles, [
        ("Burial in a national cemetery", "Free (gravesite, perpetual care, opening/closing)"),
        ("Government headstone or marker", "Free"),
        ("Burial flag", "Free"),
        ("Presidential Memorial Certificate", "Free"),
        ("Military funeral honors (flag detail, taps)", "Free upon request"),
        ("Burial allowance, service-connected death", "Up to $2,000+"),
        ("Burial allowance, non-service-connected (eligible)", "Up to $948 burial + $948 plot (varies)"),
        ("Pre-need eligibility determination", "VA Form 40-10007"),
    ]))

    story.append(Spacer(1, 6))
    story.append(Paragraph("The Pre-Plan Step Veterans Skip", styles["h2"]))
    story.append(Paragraph(
        "<b>VA Form 40-10007</b> (&quot;Application for Pre-Need Determination of Eligibility for Burial in "
        "a VA National Cemetery&quot;) lets a veteran confirm eligibility <i>before</i> death. The VA "
        "issues a determination letter the family can keep with their records. When the veteran dies, the "
        "family hands the letter to the funeral home and avoids days of paperwork during the worst week of "
        "their lives.",
        styles["body"]
    ))
    story.append(Paragraph(
        "The form is free. It takes about 30 minutes. And the family hours saved at the worst possible "
        "moment is enormous. <b>Make this a homework assignment if you have the time</b> &mdash; many of "
        "your students will not have done it.",
        styles["body"]
    ))

    story.append(qa_callout(styles, "IF A STUDENT ASKS&hellip;", [
        (
            "Can my spouse be buried with me at a VA national cemetery?",
            "<b>Yes</b> &mdash; spouses are eligible to be buried with the veteran at a VA national "
            "cemetery, even if the spouse predeceases the veteran. Same headstone shows both. The "
            "spouse's burial is no charge.",
        ),
        (
            "I'm cremated &mdash; do I still get a flag and burial allowance?",
            "<b>Yes.</b> All burial benefits apply to cremated remains. Cremation does not affect "
            "eligibility. Cremated remains can be interred at a national cemetery's columbarium or in "
            "an in-ground gravesite.",
        ),
        (
            "What if I want to be buried in a private cemetery?",
            "Veterans can be buried in any private cemetery and still receive a free <b>government "
            "headstone or marker</b>. The burial allowance ($948 + $948 plot if non-service-connected and "
            "eligible) reimburses some private burial costs but does not pay for the gravesite itself.",
        ),
        (
            "Where do I keep my discharge document (DD-214)?",
            "Multiple places. <b>Originals</b> in a fireproof safe at home. <b>Copies</b> with spouse, "
            "another trusted family member, and your VSO. <b>Digital scan</b> in a password-protected "
            "cloud folder. Your DD-214 is the most important document of your military career &mdash; "
            "the family will need it for every benefit claim.",
        ),
    ]))

    story.append(PageBreak())
    return story


def build_part4_beneficiaries(styles: dict) -> list:
    story: list = []
    story.extend(part_header(styles, "Part 4 &mdash; Beneficiaries &amp; Cognitive-Decline Planning"))

    story.append(Paragraph("The One Form That Beats the Will", styles["h2"]))
    story.append(Paragraph(
        "<b>Beneficiary designations override wills.</b> If a veteran's will leaves everything to their "
        "current spouse, but their TSP-3 form still shows their ex-wife from 1992 as beneficiary, "
        "<b>the ex-wife gets the TSP balance.</b> The will doesn't touch it. This happens constantly &mdash; "
        "and there is no recourse for the family.",
        styles["body"]
    ))
    story.append(Paragraph(
        "Make this the most repeated sentence of the entire course: <b>&quot;Beneficiary designations "
        "override your will. Check them every year.&quot;</b>",
        styles["body"]
    ))

    story.append(Spacer(1, 4))
    story.append(Paragraph("The Annual Beneficiary Review &mdash; A Specific List", styles["h2"]))

    story.append(data_table(
        styles,
        ["Account / Plan", "Form", "Where to update"],
        [
            ["TSP", "Form TSP-3", "tsp.gov / ThriftLine 1-877-968-3778"],
            ["Civilian 401(k) / 403(b)", "Plan-specific form", "Plan administrator"],
            ["IRAs (Traditional, Roth)", "Custodian's beneficiary form", "Bank/brokerage"],
            ["SBP", "DD Form 2656 / DD 2656-1 (post-retirement events)", "DFAS / mypay.dfas.mil"],
            ["SGLI / VGLI", "SGLV-8286 / VGLI form", "milconnect.dmdc.osd.mil"],
            ["VA insurance (SDVI, etc.)", "VA Form 29-336", "insurance.va.gov"],
            ["Bank accounts (POD/TOD)", "Bank's beneficiary card", "In-person at bank"],
            ["Brokerage / taxable accounts", "TOD / beneficiary form", "Brokerage"],
            ["Life insurance (private)", "Insurer-specific", "Insurance company"],
        ],
        col_widths=[2.0, 2.4, 2.4],
    ))

    story.append(Spacer(1, 4))
    story.append(callout(
        styles,
        "WATCH OUT &mdash; The Divorce / Remarriage Time Bomb",
        "Most outdated beneficiary forms are from <b>old marriages</b>. A veteran who divorces in 2010 and "
        "remarries in 2014 frequently never updates their TSP, SGLI, IRA, and 401(k) beneficiaries. "
        "<b>Their ex inherits.</b> This is real money, lost to people the veteran would have wanted "
        "differently. Tell students: do this annually, and especially after divorce or remarriage.",
        CALLOUT_WATCH_BG, CALLOUT_WATCH_BORDER,
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("Cognitive Decline &mdash; The Hardest Conversation", styles["h2"]))
    story.append(Paragraph(
        "Roughly 1 in 9 Americans 65+ has Alzheimer's or another dementia. The number rises sharply with "
        "age. Almost no one in your room thinks they will be the one. Most who are diagnosed lose financial "
        "decision-making capacity well before they realize they have. The math is sobering, but the "
        "preparation is straightforward &mdash; and it has to happen <i>while the veteran is still sharp</i>.",
        styles["body"]
    ))

    story.append(Paragraph("The Four-Step Cognitive-Decline Plan", styles["h3"]))
    story.append(Paragraph(
        "&bull; <b>Sign a durable power of attorney.</b> &quot;Durable&quot; means it remains in effect if "
        "the veteran becomes incapacitated. A regular POA does NOT. Verify the document explicitly "
        "includes the word <b>durable</b>.<br/>"
        "&bull; <b>Set up a trusted contact at every financial institution.</b> Bank, brokerage, TSP. The "
        "trusted contact is someone the institution can call if they suspect exploitation or capacity "
        "issues. Setting one up is free and takes 5 minutes per institution.<br/>"
        "&bull; <b>Name a successor trustee</b> if there's a trust. Have a backup who can step in.<br/>"
        "&bull; <b>Nominate a VA fiduciary</b> if VA disability is significant. The VA appoints fiduciaries "
        "to manage benefits for veterans who can't &mdash; nominating a trusted person ahead of time is "
        "cheaper than letting the VA pick a stranger.",
        styles["body"]
    ))

    story.append(Spacer(1, 4))
    story.append(callout(
        styles,
        "TALKING POINT &mdash; The Conversation Itself",
        "&quot;Tell your family <b>three things</b> before next month: (1) <b>where your documents are</b>, "
        "(2) <b>who your financial contacts are</b>, and (3) <b>what accounts you have</b>. Write it all "
        "on a single piece of paper. Put a copy with your will. Put a copy in a safe deposit box. Tell "
        "two people where the copies are. This single act prevents more financial chaos when something "
        "happens than any expensive document.&quot; &mdash; This is one of the most useful sentences in "
        "the entire course. Repeat it three times in class.",
        CALLOUT_NUMBERS_BG, CALLOUT_NUMBERS_BORDER,
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("Elder Financial Exploitation &mdash; The Warning Signs", styles["h2"]))
    story.append(Paragraph(
        "Veterans are targeted because of guaranteed income (Module 2 covered the scam landscape). For "
        "older or cognitively declining veterans, the threat shifts from external scammers to "
        "<b>family, caregivers, and acquaintances</b>. The most heartbreaking cases involve adult children "
        "or new romantic partners who isolate the veteran and drain accounts.",
        styles["body"]
    ))
    story.append(Paragraph(
        "<b>Warning signs to teach the family to recognize:</b>",
        styles["body"]
    ))
    story.append(Paragraph(
        "&bull; Sudden changes to bank account, beneficiary forms, or POA<br/>"
        "&bull; A new caregiver or romantic partner controlling access to the veteran<br/>"
        "&bull; The veteran being asked to sign documents they don't understand<br/>"
        "&bull; Family members being blocked from communication with the veteran<br/>"
        "&bull; Unexplained withdrawals or transfers from the veteran's accounts<br/>"
        "&bull; A previously generous veteran suddenly stopping gifts to family or charities",
        styles["body"]
    ))

    story.append(Paragraph("If a student suspects exploitation:", styles["h3"]))
    story.append(Paragraph(
        "&bull; <b>VA Office of Inspector General</b>: 1-800-488-8244<br/>"
        "&bull; <b>Adult Protective Services</b> (each state): "
        "<font name='Courier' size='9'>napsa-now.org</font><br/>"
        "&bull; <b>Eldercare Locator</b>: 1-800-677-1116<br/>"
        "&bull; <b>State Attorney General</b>: most have an elder-fraud unit",
        styles["body"]
    ))

    story.append(qa_callout(styles, "IF A STUDENT ASKS&hellip;", [
        (
            "How do I set up a trusted contact at my bank?",
            "Walk in, ask to speak to a banker, and say: &quot;I want to add a trusted contact to my "
            "accounts.&quot; They have a form. The trusted contact has <b>no</b> authority to access the "
            "money &mdash; they're just a person the bank can call if something looks wrong. <b>5 minutes. "
            "Free. Should be done at every financial institution.</b>",
        ),
        (
            "Is a will enough or do I need a trust?",
            "<b>You cannot answer this</b>, because it depends on assets, family complexity, and state "
            "law. Frame it: a <b>will</b> directs probate assets but goes through court. A <b>revocable "
            "living trust</b> avoids probate, provides privacy, and helps if there's real estate in "
            "multiple states &mdash; but costs more to set up and requires retitling assets. Refer to a "
            "VA-accredited estate attorney for the right call.",
        ),
        (
            "My memory is starting to slip. What should I do RIGHT NOW?",
            "Three things this week: (1) verify your <b>durable power of attorney</b> is in place and the "
            "word &quot;durable&quot; is in it; (2) call each of your financial institutions and add a "
            "<b>trusted contact</b>; (3) write down your <b>account list and document locations</b> on "
            "one page and give it to your spouse or trusted family member. <b>Don't wait for a diagnosis.</b>",
        ),
        (
            "What if I don't trust any of my children to be my POA?",
            "The POA doesn't have to be a child. It can be a trusted friend, a sibling, a professional "
            "fiduciary, or an attorney. State laws vary, but most allow non-relatives. A <b>professional "
            "fiduciary</b> charges a fee but is regulated and bonded &mdash; sometimes the cleanest "
            "solution for blended or strained family situations. An estate attorney can help structure this.",
        ),
    ]))

    story.append(PageBreak())
    return story


def build_part5_prep(styles: dict) -> list:
    return prep_checklist_section(
        styles,
        part_label="Part 5 &mdash; The Day Before Class",
        checklist_rows=[
            ("1. Re-read Parts 1&ndash;4 of this guide", "Module 5 is the most personal &mdash; know it cold. ~12 min"),
            ("2. Open the presentation and click through all 13 slides", "Last class &mdash; pacing matters. ~5 min"),
            ("3. Have the SBP Decision Worksheet handout ready", "Many students will fill this in real-time"),
            ("4. Have VA Form 40-10007 link/printed", "Pre-need burial determination &mdash; assign as homework"),
            ("5. Know your local VA-accredited elder-law attorney", "Refer for trust/POA questions"),
            ("6. Be ready for emotional moments", "Widows, caregivers, and recent diagnoses all show up here"),
            ("7. Save 15 min at the end for course wrap-up", "Reinforce the resources, the disclaimers, the next steps"),
        ],
        resource_rows=[
            ("SBP overview", "militarypay.defense.gov/Benefits/Survivor-Benefit-Program", "Official SBP rules and forms."),
            ("DIC info", "va.gov/burials-and-memorials/dependency-indemnity-compensation", "Eligibility, rates, application."),
            ("VA burial benefits", "va.gov/burials-and-memorials", "Pre-need application Form 40-10007 and benefits list."),
            ("TSP beneficiary update", "tsp.gov", "Update Form TSP-3 online or via ThriftLine."),
            ("milConnect", "milconnect.dmdc.osd.mil", "SGLI/VGLI updates, retiree info, dependent enrollment."),
            ("Find an estate attorney", "VA-accredited list at va.gov/ogc/accreditation.asp", "Verify accreditation; many do estate work."),
            ("State Adult Protective Services", "napsa-now.org", "Find APS in any state for elder-abuse reports."),
            ("Eldercare Locator", "1-800-677-1116 or eldercare.acl.gov", "Connects to local aging services."),
            ("VA OIG (fraud)", "1-800-488-8244", "Report VA-related elder fraud or exploitation."),
        ],
        final_reminder_html=(
            "<b>This is the last class. End it well.</b> The course you delivered taught your students "
            "vocabulary they didn't have, gave them resources they couldn't find before, and reminded them "
            "that what they earned in service is worth understanding. They will not remember every "
            "number. They will remember <i>that you cared enough to make sure they had the tools</i>. "
            "Close by reminding them: this whole course is on file at the VUB office. They can come back "
            "for the handouts anytime. You are not the only resource they have &mdash; but for the next "
            "few weeks, you might be the most important one."
        ),
        footer_text=(
            "Teacher's Guide prepared for Britt Legg &mdash; VUB Financial Readiness Course, Spring 2026. "
            "Information reflects 2026 rules; verify before citing specific dollar amounts."
        ),
    )


def main() -> None:
    styles = make_styles()
    story: list = []
    story.extend(build_cover(styles))
    story.extend(build_part1_sbp(styles))
    story.extend(build_part2_dic(styles))
    story.extend(build_part3_estate(styles))
    story.extend(build_part4_beneficiaries(styles))
    story.extend(build_part5_prep(styles))

    output_path = build_pdf(
        output_filename="module5-teachers-guide.pdf",
        title="Module 5 Teacher's Guide",
        story=story,
    )
    print(f"PDF generated: {os.path.basename(output_path)} (in Teacher Guides folder)")


if __name__ == "__main__":
    main()
