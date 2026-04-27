"""Generate the Module 3 Teacher's Guide PDF.

Module 3 covers Healthcare and Long-Term Care: VA healthcare priority groups,
CHAMPVA for dependents, Medicare at 65 (Parts A/B/D and IRMAA), TRICARE for
Life as Medicare's wraparound, and VA Aid & Attendance for veterans needing
help with daily activities.
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
        module_label="MODULE 3",
        title="Teacher's Guide",
        subtitle="Healthcare &amp; Long-Term Care &mdash; VA, Medicare, TRICARE for Life &amp; Aid &amp; Attendance",
        purpose_html=(
            "Module 3 is the class with the most expensive mistake in the entire course. A veteran who "
            "skips Medicare Part B at 65 because &quot;I have the VA&quot; can lose TRICARE for Life "
            "permanently and pay 10% more for Medicare Part B for the rest of their life. That single "
            "decision can cost six figures over a long retirement. Your job in this module is to make sure "
            "no one in your room makes that mistake."
            "<br/><br/>This guide gives you a plain-English walkthrough of how the four programs "
            "(VA healthcare, Medicare, TRICARE for Life, and Aid &amp; Attendance) actually fit together, "
            "the dollar amounts that matter, and the questions students will ask. You don't need to "
            "memorize this &mdash; you need to know what to read on Sunday night before you teach Monday."
        ),
        north_star_html=(
            "You are an <b>educator</b>, not a <b>Medicare counselor</b> or <b>elder-law attorney</b>. When "
            "a student asks &quot;should I sign up for Medicare Advantage?&quot; or &quot;should I move my "
            "money to qualify for Aid &amp; Attendance?&quot; the answer is always: &quot;That's exactly "
            "the kind of question your <b>SHIP counselor</b> (free Medicare help) or a "
            "<b>VA-accredited elder-law attorney</b> can answer for your specific situation.&quot; "
            "Tell them how the rules work; never tell them what to choose."
        ),
        toc_rows=[
            ("1", "VA Healthcare &amp; CHAMPVA &mdash; Who Gets What", "2"),
            ("2", "Medicare at 65 &mdash; The Three Parts You Must Know", "4"),
            ("3", "TRICARE for Life &mdash; The Wraparound that Saves Thousands", "7"),
            ("4", "Aid &amp; Attendance &mdash; The Quietest Big Benefit", "9"),
            ("5", "The Day Before Class &mdash; Your Prep Checklist", "11"),
        ],
    )


def build_part1_va_healthcare(styles: dict) -> list:
    story: list = []
    story.extend(part_header(styles, "Part 1 &mdash; VA Healthcare &amp; CHAMPVA"))

    story.append(Paragraph("VA Healthcare &mdash; Priority Groups in One Page", styles["h2"]))
    story.append(Paragraph(
        "VA healthcare is run as a <b>tiered enrollment system</b>, not a universal benefit. Every enrolled "
        "veteran is assigned to one of <b>eight priority groups</b> based on service connection, income, "
        "and special status. Lower group numbers get higher priority for appointments and pay lower copays "
        "(or none). Veterans always think they're &quot;not high enough&quot; to qualify &mdash; in reality, "
        "many of your students will land in Group 5, 6, or 7 just based on income or wartime service.",
        styles["body"]
    ))

    story.append(data_table(
        styles,
        ["Group", "Who's in it", "Copays?"],
        [
            ["1", "50%+ service-connected, or unemployable due to service-connected condition", "None"],
            ["2", "30&ndash;40% service-connected", "None for SC care"],
            ["3", "10&ndash;20% SC, former POWs, Purple Heart, MoH recipients", "None for SC care"],
            ["4", "Catastrophically disabled, Aid &amp; Attendance recipients", "None"],
            ["5", "0% non-compensable SC, low-income non-SC, Medicaid-eligible", "None or low"],
            ["6", "Compensable 0% SC, certain era exposures (Vietnam, Gulf, post-9/11, PACT Act)", "Varies"],
            ["7", "Income below geographic means test &mdash; agree to copay", "Reduced"],
            ["8", "Income above geographic means test &mdash; agree to copay", "Standard"],
        ],
        col_widths=[0.6, 4.6, 1.6],
    ))

    story.append(Spacer(1, 4))
    story.append(callout(
        styles,
        "WATCH OUT &mdash; The PACT Act Reopened Enrollment",
        "The <b>PACT Act of 2022</b> made many previously ineligible veterans eligible for VA healthcare &mdash; "
        "anyone with toxic exposure (burn pits, Agent Orange, radiation, certain water contamination) and "
        "service in covered eras. <b>Even veterans who tried to enroll years ago and were denied may now "
        "qualify.</b> Tell them: enroll once, and you're in &mdash; you don't have to use it. It costs "
        "nothing to enroll and gives them options later.",
        CALLOUT_WATCH_BG, CALLOUT_WATCH_BORDER,
    ))

    story.append(numbers_table(styles, [
        ("Number of priority groups", "8"),
        ("Cost to enroll", "$0"),
        ("Where to enroll", "va.gov/health-care or VA Form 10-10EZ"),
        ("Veterans Crisis Line", "988 then press 1"),
        ("VA general info", "1-800-827-1000"),
        ("Average wait time for first PCP appointment", "Varies by facility &mdash; check with local VA"),
    ]))

    story.append(Spacer(1, 6))
    story.append(Paragraph("CHAMPVA &mdash; The One Most Veterans Forget", styles["h2"]))
    story.append(Paragraph(
        "<b>CHAMPVA</b> (Civilian Health and Medical Program of the Department of Veterans Affairs) is a "
        "health insurance program for the <b>spouse, surviving spouse, or child</b> of a veteran in one of "
        "these specific situations:",
        styles["body"]
    ))
    story.append(Paragraph(
        "&bull; The veteran is rated <b>permanently and totally disabled</b> from a service-connected condition<br/>"
        "&bull; The veteran <b>died from</b> a service-connected condition<br/>"
        "&bull; The veteran was <b>permanently and totally disabled</b> from a service-connected condition "
        "at the time of death (whether or not death was service-related)<br/>"
        "&bull; The veteran <b>died on active duty</b> (and the family is not eligible for TRICARE)",
        styles["body"]
    ))
    story.append(Paragraph(
        "Crucially, CHAMPVA is <b>not</b> the same as TRICARE and <b>not</b> the same as VA healthcare. "
        "It's insurance the spouse/child uses with civilian providers (any Medicare-accepting provider, "
        "essentially). It pays 75% of allowable charges after a small deductible.",
        styles["body"]
    ))

    story.append(numbers_table(styles, [
        ("Annual deductible", "$50/person, $100/family"),
        ("CHAMPVA pays", "75% of allowable charges"),
        ("Annual out-of-pocket cap", "$3,000"),
        ("Application form", "VA Form 10-10d"),
        ("Lifetime cost (CHAMPVA)", "Free &mdash; no monthly premium"),
        ("Drug coverage", "Through Meds-by-Mail or in-network pharmacy"),
        ("Once spouse turns 65 + has Medicare", "CHAMPVA becomes secondary to Medicare"),
    ]))

    story.append(qa_callout(styles, "IF A STUDENT ASKS&hellip;", [
        (
            "I'm rated 100% &mdash; can my wife use VA hospitals?",
            "<b>No.</b> VA healthcare is <i>only for the veteran</i>. Spouses and dependents use "
            "<b>CHAMPVA</b> (different program), and they go to civilian providers. The exception is the "
            "<b>caregiver program</b> at the VA, which provides specific services to family caregivers of "
            "severely disabled vets &mdash; that's not the same as healthcare.",
        ),
        (
            "My spouse has Medicare and CHAMPVA. Which one pays?",
            "<b>Medicare pays first; CHAMPVA pays second.</b> CHAMPVA wraps around Medicare similar to how "
            "TRICARE for Life wraps around Medicare for retirees. The combination is excellent &mdash; "
            "very low out-of-pocket. They need to maintain Medicare Parts A and B to keep CHAMPVA "
            "secondary coverage working that way.",
        ),
        (
            "My buddy has VA care and never signed up for Medicare. Why should I?",
            "Two reasons. <b>One:</b> VA care is excellent at VA facilities, but if they're traveling, in "
            "an emergency, or their VA shuts a service line, Medicare gives them access to any provider "
            "nationwide. <b>Two:</b> If they're a military retiree, <b>Medicare Part B is REQUIRED to "
            "keep TRICARE for Life</b>. We'll cover that in Part 3 &mdash; it's the costliest mistake in "
            "this whole course.",
        ),
    ]))

    story.append(PageBreak())
    return story


def build_part2_medicare(styles: dict) -> list:
    story: list = []
    story.extend(part_header(styles, "Part 2 &mdash; Medicare at 65"))

    story.append(Paragraph("The Four Parts &mdash; What They Are", styles["h2"]))
    story.append(Paragraph(
        "Medicare is divided into four parts, each covering different services. Two are essential for your "
        "students. One is automatic. One is optional. Get the categories right and the rest follows.",
        styles["body"]
    ))

    story.append(data_table(
        styles,
        ["Part", "Covers", "Premium (2026)", "Notes"],
        [
            ["A", "Hospital, skilled nursing, hospice", "$0 for most", "Premium-free if 40 quarters of Medicare-covered work"],
            ["B", "Doctors, outpatient, preventive", "$202.90/month base", "REQUIRED for TRICARE for Life"],
            ["C", "Medicare Advantage (private plan replacing A+B)", "Varies", "Generally NOT recommended for TRICARE for Life retirees"],
            ["D", "Prescription drugs", "Varies (~$35/mo avg)", "Optional &mdash; TRICARE for Life and VA both cover drugs"],
        ],
        col_widths=[0.5, 2.4, 1.3, 2.6],
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("The Initial Enrollment Period &mdash; Don't Miss It", styles["h2"]))
    story.append(Paragraph(
        "Medicare's <b>Initial Enrollment Period (IEP)</b> is a <b>7-month window</b> around the 65th "
        "birthday: 3 months before, the birthday month, and 3 months after. Sign up here and coverage starts "
        "the month they turn 65 (assuming a birthday after the 1st). Sign up <i>after</i> this window and "
        "they may face a <b>permanent late-enrollment penalty</b> &mdash; for life.",
        styles["body"]
    ))
    story.append(Paragraph(
        "Most students who already collect Social Security at 65 are <b>auto-enrolled</b> in Parts A and B. "
        "Anyone who has delayed Social Security past 65 must <b>actively enroll</b> in Medicare during their "
        "IEP. This is the most common gotcha. <b>If they delayed Social Security and assume they're &quot;all "
        "set,&quot; they're not.</b>",
        styles["body"]
    ))

    story.append(numbers_table(styles, [
        ("IEP length", "7 months"),
        ("IEP timing", "3 months before to 3 months after 65th birthday month"),
        ("Auto-enrollment if collecting SS at 65", "Yes (Parts A &amp; B)"),
        ("Auto-enrollment if NOT collecting SS at 65", "NO &mdash; must enroll yourself"),
        ("Part B late penalty", "+10% for every 12 months delayed &mdash; for life"),
        ("Part D late penalty", "+1% of national base premium per month delayed &mdash; for life"),
        ("General Enrollment Period (if missed)", "Jan 1&ndash;Mar 31; coverage starts month after enrollment"),
        ("How to enroll", "ssa.gov/medicare or 1-800-772-1213"),
    ]))

    story.append(Spacer(1, 6))
    story.append(Paragraph("IRMAA &mdash; The High-Income Surcharge", styles["h2"]))
    story.append(Paragraph(
        "<b>IRMAA</b> (Income-Related Monthly Adjustment Amount) is an extra charge on top of standard Part "
        "B and Part D premiums for higher-income beneficiaries. It's based on <b>Modified Adjusted Gross "
        "Income (MAGI) from two years prior</b> &mdash; so 2024 income determines 2026 IRMAA.",
        styles["body"]
    ))
    story.append(Paragraph(
        "Most retired veterans on military pension alone won't trigger it. But the combination of military "
        "pension + Social Security + a big TSP withdrawal can push them over the threshold &mdash; and "
        "IRMAA is a &quot;cliff,&quot; meaning being $1 over a bracket means paying the surcharge for the "
        "whole year. This is exactly why <b>tax-aware withdrawal planning matters</b> (Module 4).",
        styles["body"]
    ))

    story.append(data_table(
        styles,
        ["2024 MAGI (single)", "2024 MAGI (married)", "2026 Part B + IRMAA"],
        [
            ["Up to $109,000", "Up to $218,000", "$202.90 (no IRMAA)"],
            ["$109,001&ndash;$137,000", "$218,001&ndash;$274,000", "~$284 (1st tier)"],
            ["$137,001&ndash;$171,000", "$274,001&ndash;$342,000", "~$406 (2nd tier)"],
            ["$171,001&ndash;$205,000", "$342,001&ndash;$410,000", "~$528 (3rd tier)"],
            ["$205,001&ndash;$500,000", "$410,001&ndash;$750,000", "~$650 (4th tier)"],
            ["$500,001+", "$750,001+", "~$691 (5th tier)"],
        ],
        col_widths=[2.0, 2.2, 2.6],
    ))

    story.append(Spacer(1, 4))
    story.append(callout(
        styles,
        "DO NOT SAY &mdash; The Most Expensive Sentence in the Course",
        "Do <b>not</b> say: &quot;You don't need Medicare Part B if you have VA care.&quot; This is the "
        "single most damaging belief in your room. Skipping Part B at 65 means: (1) <b>permanent loss of "
        "TRICARE for Life</b> for military retirees; (2) <b>10% lifetime late penalty</b> when they sign up "
        "later; (3) <b>limited care options</b> outside VA facilities. The correct sentence is: "
        "&quot;Medicare and the VA work together &mdash; you want both.&quot;",
        CALLOUT_DO_NOT_BG, CALLOUT_DO_NOT_BORDER,
    ))

    story.append(qa_callout(styles, "IF A STUDENT ASKS&hellip;", [
        (
            "I'm working at 65 and have employer insurance. Do I need Medicare?",
            "If they work for an employer with <b>20+ employees</b>, they can typically delay Part B without "
            "penalty (employer coverage is primary, Medicare is secondary). When the job ends, they get a "
            "<b>Special Enrollment Period</b> of 8 months to sign up without penalty. <b>Smaller employers "
            "(under 20):</b> Medicare must be primary, so they should enroll on time. They should sign "
            "up for Part A regardless &mdash; it's free.",
        ),
        (
            "Should I get Medicare Advantage (Part C)?",
            "<b>For TRICARE-for-Life retirees, almost never.</b> Medicare Advantage replaces traditional "
            "Medicare with a private network plan. TFL is designed to wrap around <i>traditional Medicare</i>, "
            "and the coordination breaks under most Advantage plans. Tell them: TFL + traditional Medicare "
            "A &amp; B is the gold standard. Their SHIP counselor can confirm.",
        ),
        (
            "Do I need Part D for prescriptions?",
            "<b>Probably not, if</b> they have TRICARE for Life or VA pharmacy. Both are considered "
            "&quot;creditable coverage,&quot; meaning they avoid the Part D late penalty even if they "
            "decline Part D. Tell them: <b>keep proof of creditable coverage</b> (a letter from TFL or VA) "
            "in case they ever need to enroll later.",
        ),
        (
            "What's IRMAA and how do I avoid it?",
            "IRMAA is the income surcharge described above. They &quot;avoid&quot; it by managing taxable "
            "income, especially in the 2 years before Medicare and after. Strategies include Roth "
            "conversions before age 63, careful TSP withdrawal sequencing, and delaying Social Security. "
            "<b>This is exactly the kind of multi-year planning a fee-only financial planner can map out.</b>",
        ),
    ]))

    story.append(PageBreak())
    return story


def build_part3_tricare(styles: dict) -> list:
    story: list = []
    story.extend(part_header(styles, "Part 3 &mdash; TRICARE for Life"))

    story.append(Paragraph("What TRICARE for Life Actually Is", styles["h2"]))
    story.append(Paragraph(
        "<b>TRICARE for Life (TFL)</b> is the wraparound healthcare benefit available to military retirees "
        "and their eligible family members at age 65, when they become Medicare-eligible. The mechanics are "
        "straightforward but the details surprise people:",
        styles["body"]
    ))
    story.append(Paragraph(
        "&bull; <b>Medicare pays first.</b> The retiree shows their Medicare card at any "
        "Medicare-accepting provider.<br/>"
        "&bull; <b>TFL pays second.</b> TRICARE picks up most of what Medicare doesn't &mdash; deductibles, "
        "copays, and the 20% Medicare doesn't cover.<br/>"
        "&bull; <b>The result:</b> for most covered services, $0 out-of-pocket. The retiree never sees a bill.",
        styles["body"]
    ))
    story.append(Paragraph(
        "TFL is <b>not optional</b> in any meaningful sense for military retirees &mdash; it's the standard "
        "default that comes with retired status. The catch: it's only triggered if they enroll in "
        "<b>Medicare Part B</b>. Skip Part B at 65 and TFL stops working.",
        styles["body"]
    ))

    story.append(numbers_table(styles, [
        ("Cost of TFL", "$0 monthly premium (separate from Medicare)"),
        ("Required to keep TFL", "Medicare Part A AND Part B"),
        ("TFL pays after Medicare", "Most remaining covered amounts"),
        ("Pharmacy benefit", "TRICARE Pharmacy at military, network, or mail-order pharmacies"),
        ("TFL covers worldwide", "Yes (overseas TFL acts as primary)"),
        ("Eligible family members", "Spouse, surviving spouse, certain dependent children"),
        ("Where to verify enrollment", "milconnect.dmdc.osd.mil"),
    ]))

    story.append(Spacer(1, 6))
    story.append(Paragraph("TFL + VA Healthcare &mdash; They Don't Conflict", styles["h2"]))
    story.append(Paragraph(
        "Many veterans believe they have to <b>choose</b> between VA care and TRICARE for Life. <b>They do "
        "not.</b> A retired veteran can be enrolled in VA healthcare (priority group X) AND have TFL "
        "wrapping Medicare AND have CHAMPVA for a dependent &mdash; and use whichever combination fits the "
        "situation.",
        styles["body"]
    ))
    story.append(Paragraph(
        "Practical pattern most retirees fall into:",
        styles["body"]
    ))
    story.append(Paragraph(
        "&bull; <b>Routine primary care:</b> VA facility (free, comprehensive, EHR continuity).<br/>"
        "&bull; <b>Specialist or care while traveling:</b> Civilian provider; Medicare bills, TFL covers "
        "remainder.<br/>"
        "&bull; <b>Pharmacy:</b> VA mail-order or TRICARE Pharmacy &mdash; whichever is more convenient.<br/>"
        "&bull; <b>Emergency:</b> Whichever ER is closest. Bring all three cards.",
        styles["body"]
    ))

    story.append(callout(
        styles,
        "WATCH OUT &mdash; The Three Card Lesson",
        "Tell your students to keep <b>three cards</b> in their wallet at all times: <b>(1) VA ID card</b>, "
        "<b>(2) Medicare card</b>, <b>(3) Uniformed Services ID card (DoD ID)</b>. The Medicare card is "
        "what TRICARE for Life looks for &mdash; without it, civilian providers can't bill correctly. "
        "Photograph the cards and store them in their phone too.",
        CALLOUT_WATCH_BG, CALLOUT_WATCH_BORDER,
    ))

    story.append(qa_callout(styles, "IF A STUDENT ASKS&hellip;", [
        (
            "Why should I pay for Medicare Part B if VA gives me everything free?",
            "Because <b>without Part B, you lose TRICARE for Life</b>, which is worth thousands per year in "
            "secondary coverage. Part B premium ($202.90/month) is a fraction of what they'd pay for "
            "equivalent supplemental insurance &mdash; and TFL covers what Part B misses. Skipping Part B is "
            "leaving the most generous secondary insurance in the country on the table.",
        ),
        (
            "I missed my Initial Enrollment Period for Part B. What do I do?",
            "If they didn't have other &quot;creditable coverage&quot; (most won't, since the VA isn't "
            "creditable for Part B purposes), they can sign up during the <b>General Enrollment Period</b> "
            "(Jan 1&ndash;March 31). Coverage will start the month after they enroll. They'll pay a 10% "
            "late-enrollment penalty <i>for life</i>. <b>Get them enrolled this week if they're past their "
            "IEP.</b>",
        ),
        (
            "Does TFL cover my dental?",
            "<b>No</b> &mdash; TFL doesn't cover routine dental, hearing aids, or vision (eyeglasses). VA "
            "covers some of this depending on priority group. Dental is a separate purchase: <b>FEDVIP "
            "Dental for retirees</b> is the standard option, available at benefeds.com.",
        ),
        (
            "Can my spouse get TFL?",
            "Yes &mdash; spouses of military retirees become TFL-eligible when they reach 65 and enroll in "
            "Medicare A &amp; B. Same Part B requirement. Surviving spouses also keep TFL eligibility. "
            "Verify in <font name='Courier' size='9'>milconnect.dmdc.osd.mil</font>.",
        ),
    ]))

    story.append(PageBreak())
    return story


def build_part4_aid_attendance(styles: dict) -> list:
    story: list = []
    story.extend(part_header(styles, "Part 4 &mdash; VA Aid &amp; Attendance"))

    story.append(Paragraph("What Aid &amp; Attendance Is &mdash; In One Sentence", styles["h2"]))
    story.append(Paragraph(
        "<b>Aid &amp; Attendance (A&amp;A)</b> is a <b>tax-free monthly enhancement to VA Pension</b> for "
        "wartime veterans (or surviving spouses) who need help with daily activities or are housebound due "
        "to a medical condition. It can pay for in-home help, assisted-living facility costs, or family "
        "caregiver expenses &mdash; and it's one of the most underused benefits in the entire VA system.",
        styles["body"]
    ))
    story.append(Paragraph(
        "Critical distinction: <b>A&amp;A is NOT separate from Pension.</b> The veteran (or spouse) must "
        "first qualify for VA Pension &mdash; meaning wartime service, age/disability, and the income/asset "
        "limits from Module 2 &mdash; <i>and then</i> A&amp;A adds to that base Pension amount. If they "
        "don't qualify for Pension, they don't qualify for A&amp;A.",
        styles["body"]
    ))

    story.append(numbers_table(styles, [
        ("Two Veterans married (both qualify for A&amp;A)", "$3,845/month (2026)"),
        ("Married veteran with A&amp;A", "$2,874/month (2026)"),
        ("Single veteran with A&amp;A", "$2,424/month (2026)"),
        ("Surviving spouse with A&amp;A", "$1,558/month (2026)"),
        ("Tax treatment", "Tax-free at federal and state level"),
        ("Net worth limit", "$163,699 (2026, includes income + assets)"),
        ("Lookback period", "36 months (3 years)"),
        ("Application form", "VA Form 21-2680 (medical) + 21P-527EZ (pension)"),
    ]))

    story.append(Spacer(1, 6))
    story.append(Paragraph("The 5 Activities of Daily Living (ADLs)", styles["h2"]))
    story.append(Paragraph(
        "The VA evaluates A&amp;A eligibility based on the veteran's ability to perform <b>5 specific "
        "Activities of Daily Living</b>. Generally, needing assistance with <b>2 or more</b> ADLs &mdash; "
        "or having a cognitive impairment requiring 24/7 supervision &mdash; meets the threshold.",
        styles["body"]
    ))

    story.append(data_table(
        styles,
        ["ADL", "What it means in practice"],
        [
            ["1. Bathing", "Needs help getting in/out of tub, washing themselves"],
            ["2. Mobility / Transferring", "Needs help moving from bed to chair, walking, using mobility aids"],
            ["3. Dressing", "Needs help putting on clothes, buttoning, tying shoes"],
            ["4. Toileting", "Needs help with hygiene, getting on/off toilet, managing continence"],
            ["5. Eating", "Needs help cutting food, lifting utensils, preventing choking"],
        ],
        col_widths=[1.6, 5.2],
    ))

    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>Cognitive impairment</b> &mdash; dementia, Alzheimer's, or similar &mdash; can qualify "
        "independently of the ADL count when supervision is needed for safety. The veteran's primary care "
        "doctor or a specialist completes <b>VA Form 21-2680</b> (Examination for Housebound Status or "
        "Permanent Need for Aid &amp; Attendance), which the VA uses for the eligibility determination.",
        styles["body"]
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("How A&amp;A Pays for Long-Term Care", styles["h2"]))
    story.append(Paragraph(
        "A&amp;A is paid as a <b>cash benefit to the veteran or spouse</b>, not directly to a facility. "
        "The recipient can use it for:",
        styles["body"]
    ))
    story.append(Paragraph(
        "&bull; <b>Assisted-living facility</b> rent (private or commercial)<br/>"
        "&bull; <b>In-home caregivers</b> &mdash; including, in many cases, family members<br/>"
        "&bull; <b>Adult day care</b><br/>"
        "&bull; <b>Memory care</b> facilities<br/>"
        "&bull; <b>Skilled nursing</b> (though Medicaid often becomes primary in nursing homes)",
        styles["body"]
    ))

    story.append(callout(
        styles,
        "WATCH OUT &mdash; The Medicaid Interaction",
        "If a veteran enters a <b>Medicaid-funded nursing facility</b>, federal rules <b>cap their VA "
        "Pension (and A&amp;A enhancement) at approximately $90/month</b>. This is the &quot;Medicaid "
        "reduction.&quot; They keep VA disability compensation in full (it's separate from Pension), but "
        "the Pension/A&amp;A combo essentially disappears. <b>Plan ahead:</b> if Medicaid is on the horizon, "
        "an elder-law attorney can help structure the transition without triggering the 36-month lookback "
        "or losing Medicaid eligibility.",
        CALLOUT_WATCH_BG, CALLOUT_WATCH_BORDER,
    ))

    story.append(qa_callout(styles, "IF A STUDENT ASKS&hellip;", [
        (
            "My wife has dementia and I'm caring for her. Can I get paid?",
            "<b>Possibly yes</b> &mdash; if the veteran (the student) qualifies for Pension and meets the "
            "asset/income limits, A&amp;A would <i>add to his</i> Pension to pay for her care. "
            "Alternatively, a surviving spouse who later cares for a parent can sometimes structure a "
            "&quot;Personal Care Agreement.&quot; This is genuinely complex &mdash; refer them to a "
            "<b>VA-accredited elder-law attorney</b>, not a generic advisor.",
        ),
        (
            "I have $200,000 in savings. Can I move it to qualify for A&amp;A?",
            "<b>Be very careful here.</b> The 36-month lookback (Module 2 covered this) means transfers "
            "made within 3 years of applying can trigger a penalty period of up to 5 years. There ARE "
            "legal strategies (irrevocable trusts, certain annuity types, prepaid funeral expenses) but "
            "they require a VA-accredited attorney. <b>Anyone offering &quot;asset restructuring&quot; "
            "outside of an attorney's office is the pension-poaching scam from Module 2.</b>",
        ),
        (
            "How long does an A&amp;A application take?",
            "Currently <b>3&ndash;9 months</b>, though the VA prioritizes claims for veterans 85+ and those "
            "in hospice or facility care. Tell them to file early &mdash; benefits are paid retroactively "
            "to the application date, so even if approval takes 6 months, they get the back pay.",
        ),
        (
            "Can I get A&amp;A and Social Security and SBP at the same time?",
            "<b>Yes, all three.</b> A&amp;A is needs-based but those needs are calculated AFTER subtracting "
            "&quot;unreimbursed medical expenses&quot; from income. A surviving spouse paying $4,000/month "
            "for assisted living often qualifies even with substantial gross income. The math is "
            "non-obvious; refer them to a VSO or accredited attorney.",
        ),
    ]))

    story.append(callout(
        styles,
        "TALKING POINT &mdash; The Quietest Big Benefit",
        "A&amp;A is the most underused VA benefit by ratio of eligible-to-enrolled. A veteran in your room "
        "almost certainly knows someone who could qualify &mdash; an elderly parent, a widowed spouse, a "
        "sibling. Tell them: <b>&quot;Take this handout home and ask your family if anyone they know is "
        "paying for assisted living. They might be eligible for $1,500&ndash;$2,800 a month, tax-free, "
        "and not know it.&quot;</b> That sentence alone may move thousands of dollars to people who "
        "deserve it.",
        CALLOUT_NUMBERS_BG, CALLOUT_NUMBERS_BORDER,
    ))

    story.append(PageBreak())
    return story


def build_part5_prep(styles: dict) -> list:
    return prep_checklist_section(
        styles,
        part_label="Part 5 &mdash; The Day Before Class",
        checklist_rows=[
            ("1. Re-read Parts 1&ndash;4 of this guide", "Skim; focus on the Key Numbers boxes. ~8 min"),
            ("2. Open the presentation and click through all 13 slides", "Remind yourself of slide order. ~5 min"),
            ("3. Have medicare.gov, tricare.mil, and va.gov in browser tabs", "Students will ask for URLs. Be ready."),
            ("4. Print backup copies of handouts", "Healthcare Benefits Reference + State Benefits Reference"),
            ("5. Know your local SHIP counselor", "Free Medicare counseling &mdash; shiphelp.org"),
            ("6. Have an elder-law referral ready", "Local VA-accredited attorney for A&amp;A questions"),
            ("7. Bring 3 cards out as a prop", "VA, Medicare, DoD ID &mdash; show what students should always carry"),
        ],
        resource_rows=[
            ("VA Healthcare", "va.gov/health-care", "Enrollment, priority groups, copays, services."),
            ("CHAMPVA", "va.gov/health-care/family-caregiver-benefits/champva", "Eligibility and Form 10-10d."),
            ("Medicare", "medicare.gov", "Plan finder, coverage details, enrollment dates."),
            ("Medicare enrollment", "ssa.gov/medicare", "Sign up for Parts A and B."),
            ("TRICARE for Life", "tricare.mil/tfl", "TFL handbook, pharmacy, contractor contact."),
            ("Find a SHIP counselor", "shiphelp.org", "Free unbiased Medicare counseling in every state."),
            ("VA Pension &amp; A&amp;A", "va.gov/pension/aid-attendance-housebound", "Eligibility, rates, application forms."),
            ("Verify TFL eligibility", "milconnect.dmdc.osd.mil", "DoD self-service portal for retirees."),
            ("Find an accredited VSO", "va.gov/ogc/accreditation.asp", "For free A&amp;A application help."),
        ],
        final_reminder_html=(
            "<b>The most expensive sentence a veteran can hear is &quot;you don't need Part B because you "
            "have the VA.&quot;</b> If your students leave with one fact, make it that they need Medicare A "
            "AND B at 65, every time, no exceptions, even with VA care &mdash; because Part B is what "
            "keeps TRICARE for Life alive. That single sentence is worth tens of thousands of dollars to "
            "the right person."
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
    story.extend(build_part1_va_healthcare(styles))
    story.extend(build_part2_medicare(styles))
    story.extend(build_part3_tricare(styles))
    story.extend(build_part4_aid_attendance(styles))
    story.extend(build_part5_prep(styles))

    output_path = build_pdf(
        output_filename="module3-teachers-guide.pdf",
        title="Module 3 Teacher's Guide",
        story=story,
    )
    print(f"PDF generated: {os.path.basename(output_path)} (in Teacher Guides folder)")


if __name__ == "__main__":
    main()
