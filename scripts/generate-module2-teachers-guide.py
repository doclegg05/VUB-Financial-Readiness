"""Generate the Module 2 Teacher's Guide PDF.

Module 2 covers VA Disability Benefits: filing claims and increases, secondary
service-connected conditions, CRDP vs CRSC, VA Pension and the lookback rule,
and veteran-targeted scams. Organized by topic so the instructor can read the
relevant section before class.
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
        module_label="MODULE 2",
        title="Teacher's Guide",
        subtitle="Maximizing Your Disability Benefits &mdash; Claims, CRDP/CRSC &amp; Scam Awareness",
        purpose_html=(
            "Module 2 is the most emotionally charged class you will teach. Veterans in your room may be "
            "underrated, may have been talked out of filing years ago, or may have been targeted by a "
            "&quot;claim shark&quot; who took thousands of their dollars. Your job is to give them the vocabulary "
            "and the free, accredited resources they need to act &mdash; without you ever filing a claim or "
            "telling them what their rating &quot;should&quot; be."
            "<br/><br/>Each topic below is a plain-English explanation, the numbers worth memorizing, the "
            "questions students will ask, and the pitfalls to avoid. Read this guide once before class. You "
            "do not need to memorize it &mdash; you need to know <i>where</i> to look for each answer."
        ),
        north_star_html=(
            "You are an <b>educator</b>, not a <b>VSO</b>. When a student asks &quot;should I file?&quot; or &quot;will my "
            "rating go up?&quot; the answer is always: &quot;A free, accredited VSO can review your records and "
            "tell you. Here's how to find one.&quot; Never estimate someone's rating, never compare their "
            "condition to another veteran's, and <b>never recommend a paid claims consultant</b>. The fee-for-claims "
            "industry is the single biggest threat to your students' wallets in this entire course."
        ),
        toc_rows=[
            ("1", "Filing Claims, Increases &amp; Secondary Conditions", "2"),
            ("2", "The VA Waiver, CRDP &amp; CRSC", "5"),
            ("3", "VA Pension &amp; the 36-Month Lookback", "8"),
            ("4", "Veteran Benefit Scams &mdash; The $584M Crisis", "10"),
            ("5", "The Day Before Class &mdash; Your Prep Checklist", "12"),
        ],
    )


def build_part1_claims(styles: dict) -> list:
    story: list = []
    story.extend(part_header(styles, "Part 1 &mdash; Claims, Increases &amp; Secondary Conditions"))

    story.append(Paragraph("Filing a New Claim &mdash; The Plain-English Version", styles["h2"]))
    story.append(Paragraph(
        "A <b>VA disability claim</b> is a request to the Department of Veterans Affairs to recognize that "
        "a current medical condition is connected to military service and to compensate the veteran for it. "
        "Three things have to be true for a claim to succeed:",
        styles["body"]
    ))
    story.append(Paragraph(
        "&bull; <b>A current diagnosis.</b> The condition has to exist now, documented by a healthcare provider.<br/>"
        "&bull; <b>An in-service event, injury, or exposure.</b> Something in their service records ties the "
        "condition back to their time in uniform.<br/>"
        "&bull; <b>A nexus.</b> A medical opinion linking the current diagnosis to the in-service event. This "
        "is usually a doctor's letter that uses the magic phrase &quot;at least as likely as not.&quot;",
        styles["body"]
    ))
    story.append(Paragraph(
        "If your students take only one fact from this section, make it this one: <b>there is no deadline "
        "to file.</b> A veteran who separated in 1972 can still file a claim today. Many of the conditions in "
        "your room &mdash; hearing loss, tinnitus, sleep apnea, hypertension, joint problems, diabetes from "
        "Agent Orange &mdash; do not surface for decades.",
        styles["body"]
    ))

    story.append(numbers_table(styles, [
        ("Deadline to file an initial VA claim", "None"),
        ("Effective date of award", "Date the VA receives the claim"),
        ("Cost of filing through an accredited VSO", "$0"),
        ("Cost of filing through an attorney/agent (initial claim)", "$0 (cannot charge for initial filing)"),
        ("Maximum legal fee for an appeal (after denial)", "20% of past-due benefits"),
        ("Where to find an accredited rep", "va.gov/ogc/accreditation.asp"),
    ]))

    story.append(Spacer(1, 6))
    story.append(Paragraph("Filing a Rating Increase", styles["h3"]))
    story.append(Paragraph(
        "A veteran with an existing rating can file a <b>Claim for Increase</b> at any time if the condition "
        "has worsened. They use the same form as a new claim (VA Form 21-526EZ) and submit current medical "
        "evidence showing the condition is more severe than when last rated. Common increase candidates in "
        "an older population: hearing loss, tinnitus, joint conditions, PTSD, sleep apnea, hypertension, and "
        "any condition that has progressed with age.",
        styles["body"]
    ))
    story.append(Paragraph(
        "<b>Caution:</b> Filing for an increase opens the rating up for VA review. The VA can, in rare cases, "
        "<i>reduce</i> a rating if the new evaluation finds the condition has improved. This is uncommon for "
        "older veterans with chronic conditions, but it is why a VSO review of medical evidence beforehand "
        "is worth doing.",
        styles["body"]
    ))

    story.append(qa_callout(styles, "IF A STUDENT ASKS&hellip;", [
        (
            "I tried to file 20 years ago and got denied. Should I try again?",
            "<b>Yes.</b> The standard for granting claims has shifted significantly &mdash; especially since "
            "the <b>PACT Act</b> (2022) which expanded presumptive conditions for burn pit, Agent Orange, "
            "and radiation exposures. A condition that was denied in 2005 might be granted automatically "
            "today. Tell them: &quot;Take your old denial letter to a VSO and ask them to look at it under "
            "current rules.&quot;",
        ),
        (
            "What is the PACT Act and does it apply to me?",
            "The <b>Sergeant First Class Heath Robinson Honoring our PACT Act of 2022</b> expanded the list "
            "of conditions presumed to be service-connected for veterans exposed to burn pits, Agent Orange, "
            "radiation, and other toxins. Vietnam, Gulf War, post-9/11, and certain Cold War-era veterans "
            "are all covered for various conditions. They don't have to prove the link &mdash; the VA assumes "
            "it. <b>Refer to a VSO</b> for whether their specific era and conditions qualify.",
        ),
        (
            "Do I need a lawyer?",
            "<b>For an initial claim, no &mdash; and a lawyer cannot legally charge them.</b> VSOs (DAV, VFW, "
            "American Legion, AMVETS, state VSOs) handle initial claims for free. Lawyers and accredited "
            "agents can only charge for appeals after a denial, and that fee is capped at 20% of past-due "
            "benefits. If anyone asks for an upfront fee to file a claim, they're operating illegally.",
        ),
        (
            "How long does a claim take?",
            "Currently averaging <b>4&ndash;6 months</b> for initial decisions, but it varies. Backlog has "
            "fluctuated. Tell them: file now, then forget about it. The VA will request a C&amp;P (Compensation "
            "&amp; Pension) exam &mdash; <b>they must show up to that exam</b> or the claim is denied.",
        ),
    ]))

    story.append(callout(
        styles,
        "DO NOT SAY &mdash; Liability Trap",
        "Do not say: &quot;You'll definitely get rated for that&quot; or &quot;Your rating should be at least 70%.&quot; "
        "Both are advice that the veteran will quote back when reality disappoints. Say: &quot;A VSO can "
        "review your records and tell you what's worth filing &mdash; for free, in about an hour.&quot;",
        CALLOUT_DO_NOT_BG, CALLOUT_DO_NOT_BORDER,
    ))

    story.append(Spacer(1, 8))
    story.append(Paragraph("Secondary Service-Connected Conditions", styles["h2"]))
    story.append(Paragraph(
        "A <b>secondary condition</b> is a new health problem caused or aggravated by an existing "
        "service-connected condition. The connection is medical, not military &mdash; so the secondary "
        "doesn't have to come from service itself. It only has to come from a condition that <i>did</i>.",
        styles["body"]
    ))
    story.append(Paragraph(
        "These are the most commonly missed claims in your room. Veterans tend to focus on what hurt them "
        "in service and overlook what those original injuries are doing to the rest of their body now.",
        styles["body"]
    ))

    story.append(data_table(
        styles,
        ["Existing service-connected condition", "Common secondary"],
        [
            ["Back / spine injury", "Knee, hip, ankle problems from compensating gait"],
            ["Knee injury (one side)", "Opposite knee/hip from overuse"],
            ["PTSD", "Sleep apnea, hypertension, depression, GERD, erectile dysfunction"],
            ["Tinnitus", "Headaches/migraines, anxiety, insomnia"],
            ["Type 2 diabetes (Agent Orange presumptive)", "Peripheral neuropathy, kidney disease, retinopathy"],
            ["Hearing loss", "Tinnitus, balance issues"],
            ["Knee/back pain (long-term)", "Depression from chronic pain"],
        ],
        col_widths=[2.8, 4.0],
    ))

    story.append(Spacer(1, 4))
    story.append(callout(
        styles,
        "WATCH OUT &mdash; Independent vs. Secondary",
        "A condition can be a <b>direct</b> service-connected claim or a <b>secondary</b> claim &mdash; the "
        "evidence pathway is different. Direct: prove it started in service. Secondary: prove it's caused or "
        "aggravated by something already service-connected. A VSO can help pick the strongest pathway. "
        "Don't try to coach students on which to file.",
        CALLOUT_WATCH_BG, CALLOUT_WATCH_BORDER,
    ))

    story.append(qa_callout(styles, "IF A STUDENT ASKS&hellip;", [
        (
            "My doctor said my sleep apnea is from my PTSD. How do I file?",
            "They need a <b>nexus letter</b> from that doctor stating the medical opinion that the sleep "
            "apnea is &quot;at least as likely as not&quot; caused or aggravated by the service-connected PTSD. "
            "A VSO can guide them on what the letter needs to say. The VA may then schedule a C&amp;P exam "
            "to evaluate severity.",
        ),
        (
            "Will adding a secondary lower my existing rating?",
            "No &mdash; secondaries are <i>added</i> to existing ratings using VA math (which is not normal "
            "math; ratings combine, not add). It's possible the existing rating could be reviewed, but "
            "secondaries themselves do not reduce primaries.",
        ),
    ]))

    story.append(PageBreak())
    return story


def build_part2_crdp_crsc(styles: dict) -> list:
    story: list = []
    story.extend(part_header(styles, "Part 2 &mdash; The VA Waiver, CRDP &amp; CRSC"))

    story.append(Paragraph("First, Re-Anchor on the VA Waiver", styles["h2"]))
    story.append(Paragraph(
        "If a veteran receives <b>both</b> military retired pay and VA disability compensation, federal law "
        "requires their retired pay to be reduced dollar-for-dollar by the VA amount. This is the <b>VA Waiver</b> "
        "(also called &quot;the offset&quot;). The veteran still receives the same total &mdash; the VA "
        "portion just becomes tax-free. Module 1 covered this in detail; this section is what makes some of "
        "that waiver come <b>back</b>.",
        styles["body"]
    ))
    story.append(Paragraph(
        "Two federal programs were created to restore some or all of the waived retired pay: <b>CRDP</b> "
        "(Concurrent Retirement and Disability Pay) and <b>CRSC</b> (Combat-Related Special Compensation). "
        "Most students do not know they exist, do not know they qualify, or have them confused with each "
        "other. This part fixes that.",
        styles["body"]
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("CRDP &mdash; Concurrent Retirement and Disability Pay", styles["h2"]))
    story.append(Paragraph(
        "CRDP restores retired pay that was waived because of VA compensation, allowing the veteran to "
        "receive both checks in full. It's <b>automatic</b> &mdash; if the veteran qualifies, DFAS enrolls "
        "them. No application required.",
        styles["body"]
    ))
    story.append(Paragraph(
        "<b>To qualify for CRDP, all four must be true:</b><br/>"
        "&bull; Retired from the military (20+ years of service, or medical retirement under Chapter 61 with "
        "20+ years deemed)<br/>"
        "&bull; Receiving VA disability compensation<br/>"
        "&bull; <b>VA rating of 50% or higher</b><br/>"
        "&bull; Receiving retired pay (not just VA pay)",
        styles["body"]
    ))
    story.append(Paragraph(
        "CRDP money is treated like retired pay &mdash; <b>taxable</b>, COLA-adjusted, paid by DFAS.",
        styles["body"]
    ))

    story.append(Spacer(1, 4))
    story.append(Paragraph("CRSC &mdash; Combat-Related Special Compensation", styles["h2"]))
    story.append(Paragraph(
        "CRSC restores retired pay waived because of VA compensation, but only for the portion of disability "
        "that is <b>combat-related</b>. The veteran has to apply for it &mdash; and the application is "
        "specific.",
        styles["body"]
    ))
    story.append(Paragraph(
        "<b>To qualify for CRSC, all must be true:</b><br/>"
        "&bull; Retired from the military (20+ years OR medical retirement under Chapter 61)<br/>"
        "&bull; <b>VA rating of 10% or higher</b> for the combat-related conditions<br/>"
        "&bull; The disability is &quot;combat-related&quot; under specific definitions:<br/>"
        "&nbsp;&nbsp;&nbsp;&ndash; Armed conflict (combat with an enemy)<br/>"
        "&nbsp;&nbsp;&nbsp;&ndash; Hazardous service (parachute, demolition, flight, dive duty)<br/>"
        "&nbsp;&nbsp;&nbsp;&ndash; Instrumentality of war (vehicle, weapon, agent of war)<br/>"
        "&nbsp;&nbsp;&nbsp;&ndash; Simulating war (training that mirrors combat conditions)<br/>"
        "&bull; Application: <b>DD Form 2860</b>, submitted to their <i>branch of service</i> (not VA, not DFAS)",
        styles["body"]
    ))
    story.append(Paragraph(
        "CRSC money is <b>tax-free</b> &mdash; this is its big advantage. It comes from DFAS but is excluded "
        "from gross income.",
        styles["body"]
    ))

    story.append(numbers_table(styles, [
        ("CRDP minimum VA rating", "50%"),
        ("CRSC minimum VA rating", "10% (combat-related only)"),
        ("CRDP application form", "None &mdash; automatic"),
        ("CRSC application form", "DD Form 2860"),
        ("CRDP tax treatment", "Taxable"),
        ("CRSC tax treatment", "Tax-free"),
        ("Can a veteran receive both?", "No &mdash; one or the other"),
        ("Election window", "Annual (each January)"),
    ]))

    story.append(Spacer(1, 6))
    story.append(Paragraph("CRDP vs. CRSC &mdash; The Election", styles["h2"]))
    story.append(Paragraph(
        "If a veteran qualifies for both, DFAS sends a notice each January asking which one they want for "
        "the year. They <b>cannot have both</b>. The choice is reversible &mdash; but only once a year, "
        "during the open season.",
        styles["body"]
    ))
    story.append(Paragraph(
        "The math is not always intuitive. CRDP is taxable but typically pays a higher gross amount; CRSC is "
        "tax-free but only covers the combat-related portion. For a veteran with a 100% rating where most "
        "conditions are <i>not</i> combat-related, CRDP usually wins. For a veteran whose disability is "
        "predominantly from combat, CRSC's tax-free advantage often wins. <b>This is exactly the kind of "
        "math a tax professional should run.</b>",
        styles["body"]
    ))

    story.append(callout(
        styles,
        "WATCH OUT &mdash; The DFAS Lag",
        "When the VA changes a rating retroactively (a common outcome of an appeal), there is often a "
        "<b>multi-month lag</b> before DFAS adjusts retired pay and CRDP/CRSC. This can produce an "
        "unexpected back-payment from DFAS, OR an unexpected debt notice if the rating went down. Tell "
        "students: <b>watch myPay closely after any VA decision</b> and call DFAS (1-800-321-1080) the "
        "moment something looks wrong.",
        CALLOUT_WATCH_BG, CALLOUT_WATCH_BORDER,
    ))

    story.append(qa_callout(styles, "IF A STUDENT ASKS&hellip;", [
        (
            "I'm rated 70%, retired with 22 years. Am I getting CRDP?",
            "Almost certainly &mdash; CRDP is automatic for qualifying retirees. They should check their RAS "
            "(Retiree Account Statement) on myPay; CRDP appears as a line item that <i>adds back</i> some "
            "or all of the VA Waiver. If they're qualifying and not seeing it, call DFAS.",
        ),
        (
            "I was hurt in training in 1985, not in combat. Is that combat-related for CRSC?",
            "Possibly &mdash; &quot;simulating war&quot; covers training designed to mirror combat conditions. "
            "Live-fire exercises, parachute jumps, demolition training, and similar high-risk training all "
            "qualify. Their <b>branch of service</b> makes the determination on DD Form 2860, not the VA. "
            "Tell them to apply &mdash; the worst that happens is denial; nothing is lost by trying.",
        ),
        (
            "Should I switch from CRDP to CRSC this year?",
            "<b>You cannot answer this.</b> The right answer depends on their tax bracket, the proportion of "
            "combat-related disability vs. total, state taxation, and their full income picture. Tell them: "
            "&quot;A tax professional or fee-only financial planner can run the numbers both ways &mdash; "
            "this is exactly the kind of question they're trained to answer.&quot;",
        ),
        (
            "Does CRDP/CRSC affect my Social Security?",
            "No. Neither counts as &quot;earned income&quot; for the Social Security earnings test, and neither "
            "is treated differently by SSA. They show up on the federal return like other retirement income.",
        ),
    ]))

    story.append(callout(
        styles,
        "TALKING POINT &mdash; What to Actually Say in Class",
        "Frame CRDP/CRSC as <b>&quot;money you may already be entitled to that DFAS may not be paying you yet.&quot;</b> "
        "Use the handout in this module (CRDP vs. CRSC Comparison Sheet) as the takeaway. Tell students "
        "to bring their most recent RAS to a VSO appointment and ask: <i>&quot;Am I getting CRDP? Should I "
        "apply for CRSC?&quot;</i> Those two questions, asked once, can be worth thousands a year.",
        CALLOUT_NUMBERS_BG, CALLOUT_NUMBERS_BORDER,
    ))

    story.append(PageBreak())
    return story


def build_part3_va_pension(styles: dict) -> list:
    story: list = []
    story.extend(part_header(styles, "Part 3 &mdash; VA Pension &amp; the 36-Month Lookback"))

    story.append(Paragraph("What VA Pension Is &mdash; And Isn't", styles["h2"]))
    story.append(Paragraph(
        "VA <b>Pension</b> (the &quot;Improved Pension&quot; program) is a <b>needs-based</b> monthly benefit "
        "for wartime veterans with limited income and assets. It is <i>completely separate</i> from VA "
        "<b>disability compensation</b>. Compensation is for service-connected conditions and is not means-tested. "
        "Pension is for low-income wartime veterans, regardless of whether their conditions are service-connected.",
        styles["body"]
    ))
    story.append(Paragraph(
        "Most of your students will not qualify for Pension &mdash; military retired pay alone usually puts "
        "income above the limit. But three groups in the room might:",
        styles["body"]
    ))
    story.append(Paragraph(
        "&bull; <b>Reservists / Guard</b> who served wartime active-duty days but never qualified for retired pay<br/>"
        "&bull; <b>Veterans whose retired pay is small</b> (early retirement, low rank, short service)<br/>"
        "&bull; <b>Surviving spouses</b> of wartime veterans (Survivors Pension, also called Death Pension)",
        styles["body"]
    ))

    story.append(numbers_table(styles, [
        ("Service requirement", "90+ days active duty, 1+ day in a wartime period"),
        ("Wartime periods (most relevant)", "WWII, Korea, Vietnam, Gulf War (Aug 1990&ndash;present)"),
        ("Age requirement", "65+ or permanently disabled"),
        ("2026 net worth limit (income + assets)", "$163,699"),
        ("Lookback period for asset transfers", "36 months (3 years)"),
        ("Max penalty period", "5 years"),
        ("Net worth excludes", "Primary home, vehicle, personal effects"),
        ("Net worth includes", "Other real estate, savings, investments, IRAs"),
    ]))

    story.append(Spacer(1, 6))
    story.append(Paragraph("The 36-Month Lookback &mdash; Why It Exists", styles["h2"]))
    story.append(Paragraph(
        "Effective <b>October 18, 2018</b>, the VA implemented a 3-year lookback on asset transfers for "
        "Pension applicants. If a veteran (or their spouse) transferred assets for less than fair market "
        "value within 36 months of applying, those transfers can trigger a <b>penalty period</b> &mdash; "
        "months during which Pension is denied. The penalty is calculated by dividing the transferred "
        "amount by the maximum monthly Pension rate (with Aid &amp; Attendance, currently around $2,795 "
        "for a single veteran).",
        styles["body"]
    ))
    story.append(Paragraph(
        "<b>What counts as a transfer for less than fair market value:</b> giving money to children, "
        "putting money into an irrevocable trust, buying an annuity that locks up principal, paying off "
        "someone else's debt &mdash; anything that moves the asset out of the veteran's countable net "
        "worth without receiving equivalent value in return.",
        styles["body"]
    ))

    story.append(callout(
        styles,
        "DO NOT SAY &mdash; The Pension Restructuring Trap",
        "Do not say: &quot;You can give your money to your kids and qualify.&quot; This is exactly what "
        "<b>pension poaching</b> scams say. Since 2018, the VA can look back 36 months at any transfer "
        "and impose a penalty up to 5 years long. The veteran ends up with no Pension <i>and</i> no assets. "
        "Anyone who pitches an &quot;asset restructuring strategy&quot; for VA Pension &mdash; especially one "
        "involving annuities or trusts &mdash; should be reported.",
        CALLOUT_DO_NOT_BG, CALLOUT_DO_NOT_BORDER,
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("Aid &amp; Attendance &mdash; The Pension Add-On", styles["h2"]))
    story.append(Paragraph(
        "<b>Aid &amp; Attendance (A&amp;A)</b> is an enhanced amount added to Pension for veterans (or "
        "surviving spouses) who need help with daily activities or are housebound. A&amp;A is covered in "
        "depth in <b>Module 3</b>; mention it briefly here so students who don't qualify for base Pension "
        "but think they might qualify for A&amp;A understand the connection: <b>A&amp;A is an enhancement "
        "to Pension, not a separate benefit.</b> If they don't qualify for Pension, they don't get A&amp;A.",
        styles["body"]
    ))

    story.append(qa_callout(styles, "IF A STUDENT ASKS&hellip;", [
        (
            "I served in Vietnam &mdash; do I qualify for VA Pension?",
            "Maybe. They meet the wartime service requirement. They also need to be <b>65+ or permanently "
            "disabled</b>, AND have countable net worth (income + assets, excluding home and vehicle) below "
            "$163,699 in 2026. If they have a military pension already, that pension counts as income and "
            "usually puts them over the limit. Tell them: <b>a VSO can run the numbers in 15 minutes.</b>",
        ),
        (
            "My mother is a widow of a WWII veteran. Can she apply?",
            "Yes &mdash; this is the <b>Survivors Pension</b> (formerly Death Pension), with similar income "
            "and asset limits. Many surviving spouses of older veterans don't know it exists. The same "
            "lookback rule applies. Refer her to a VSO &mdash; the DAV, VFW, and American Legion all have "
            "experience filing Survivors Pension claims.",
        ),
        (
            "I gave my daughter $50,000 last year to help her buy a house. Is that a problem?",
            "If they apply for Pension within the next 36 months, yes &mdash; that gift counts as a "
            "transfer for less than fair market value and could trigger a penalty period. They should "
            "<b>not</b> try to fix this by &quot;getting it back&quot; without consulting a VA-accredited "
            "attorney. Refer them.",
        ),
    ]))

    story.append(PageBreak())
    return story


def build_part4_scams(styles: dict) -> list:
    story: list = []
    story.extend(part_header(styles, "Part 4 &mdash; Veteran Benefit Scams: The $584M Crisis"))

    story.append(Paragraph("Why Veterans Are Specifically Targeted", styles["h2"]))
    story.append(Paragraph(
        "In 2024, military-connected consumers reported losing <b>$584 million</b> to fraud, with veterans "
        "and military retirees accounting for $419 million of that total (FTC Consumer Sentinel Network). "
        "This is not accidental. Scammers target veterans for three specific reasons:",
        styles["body"]
    ))
    story.append(Paragraph(
        "&bull; <b>Guaranteed income.</b> Retired pay and VA compensation arrive every month, on schedule. "
        "Predators know exactly when checks hit and can size their pitches accordingly.<br/>"
        "&bull; <b>Cultural trust.</b> Older veterans grew up trusting institutions, and many still answer "
        "the phone with their full name. Scammers exploit this directly.<br/>"
        "&bull; <b>Information asymmetry.</b> Benefits are complicated; promises of &quot;help&quot; sound "
        "appealing. The complexity is the scam's cover.",
        styles["body"]
    ))

    story.append(numbers_table(styles, [
        ("2024 fraud losses, military-connected consumers", "$584 million"),
        ("Of that, losses by veterans and military retirees", "$419 million"),
        ("Veterans who report losing money to a scam (lifetime)", "27%"),
        ("Maximum legal fee to file an initial VA claim", "$0"),
        ("VA OIG fraud hotline", "1-800-488-8244"),
        ("FTC fraud reporting", "reportfraud.ftc.gov"),
        ("Find an accredited VSO", "va.gov/ogc/accreditation.asp"),
    ]))

    story.append(Spacer(1, 6))
    story.append(Paragraph("The Four Scams You Will Hear About in Class", styles["h2"]))

    story.append(Paragraph("1. Claim Sharks", styles["h3"]))
    story.append(Paragraph(
        "Companies and individuals charging veterans <b>$3,000&ndash;$10,000+</b> to file or assist with VA "
        "claims. <b>This is illegal under federal law (38 U.S.C. &sect; 5904).</b> Only VA-accredited "
        "attorneys, agents, and VSO representatives may charge for benefits assistance &mdash; and only on "
        "appeals after a denial, not initial claims. Free, accredited help is available from the DAV, VFW, "
        "American Legion, AMVETS, MOAA, and state VSOs. The script: <b>&quot;Free is free. If they're "
        "charging, walk away.&quot;</b>",
        styles["body"]
    ))

    story.append(Paragraph("2. Pension Poaching", styles["h3"]))
    story.append(Paragraph(
        "&quot;Advisors&quot; (often insurance agents posing as VA experts) restructure a veteran's assets &mdash; "
        "typically into a high-commission annuity or irrevocable trust &mdash; to qualify them for VA "
        "Pension. The advisor pockets a commission. The veteran ends up with assets they cannot access, "
        "may face the 36-month lookback penalty, and may not even be approved. Often combined with "
        "free-meal seminars at restaurants or churches.",
        styles["body"]
    ))

    story.append(Paragraph("3. VA Impersonation", styles["h3"]))
    story.append(Paragraph(
        "Phone calls or emails claiming to be from the VA, demanding the veteran &quot;verify&quot; their "
        "Social Security number, &quot;confirm&quot; their direct deposit, or pay an &quot;overpayment&quot; "
        "by gift card. <b>The VA never calls demanding immediate payment, never asks for SSN over the phone "
        "to confirm an account, and never accepts gift cards.</b> Real VA contact comes by mail with a "
        "letter the veteran can verify by calling 1-800-827-1000.",
        styles["body"]
    ))

    story.append(Paragraph("4. Predatory Financial Products", styles["h3"]))
    story.append(Paragraph(
        "After a veteran receives a large back-payment from a successful claim or appeal, they become a "
        "target for high-fee annuities, whole life insurance with low cash value, structured settlements, "
        "&quot;veteran-friendly&quot; investments, and crypto. The pitch is always the same: &quot;You "
        "deserve this. Let me help you protect it.&quot; The protection costs 20&times; what an index fund "
        "or savings account would.",
        styles["body"]
    ))

    story.append(callout(
        styles,
        "WATCH OUT &mdash; The IRA Rollover Pitch",
        "When a veteran retires and starts getting calls offering to &quot;help manage your TSP,&quot; the "
        "pitch is almost always a rollover into a high-fee broker IRA or annuity. TSP fees are about "
        "0.05%; commercial alternatives charge 1&ndash;2% &mdash; <b>20 to 40 times more</b>. Over a 20-year "
        "retirement, that's six figures in lost wealth. Tell students: <b>If someone is pitching them an "
        "IRA rollover over the phone, they are being sold to, not advised.</b>",
        CALLOUT_WATCH_BG, CALLOUT_WATCH_BORDER,
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("How Students Should Respond", styles["h2"]))
    story.append(Paragraph(
        "Give your room a simple, repeatable script. They do not need to be polite to scammers. They need "
        "to be quick.",
        styles["body"]
    ))
    story.append(Paragraph(
        "&bull; <b>Hang up.</b> No one offering benefits help legitimately needs to keep them on the phone.<br/>"
        "&bull; <b>Verify the contact.</b> Call the VA at 1-800-827-1000 directly to ask if anyone there "
        "actually called them.<br/>"
        "&bull; <b>Verify the advisor.</b> Look up any &quot;financial advisor&quot; at "
        "<font name='Courier' size='9'>brokercheck.finra.org</font> before signing anything.<br/>"
        "&bull; <b>Find an accredited VSO.</b> <font name='Courier' size='9'>va.gov/ogc/accreditation.asp</font> "
        "lists every legitimate rep.<br/>"
        "&bull; <b>Report it.</b> VA OIG (1-800-488-8244), FTC (reportfraud.ftc.gov), and state attorney "
        "general's office.",
        styles["body"]
    ))

    story.append(qa_callout(styles, "IF A STUDENT ASKS&hellip;", [
        (
            "I already paid a company to file my claim. Can I get my money back?",
            "Maybe. If the company isn't VA-accredited, the contract may be unenforceable, and the FTC and "
            "state AG can pursue refunds. Tell them to (1) <b>file a complaint with the FTC</b> at "
            "reportfraud.ftc.gov, (2) <b>file with the VA OIG</b> at 1-800-488-8244, and (3) <b>contact "
            "their state attorney general</b>. They should also see an accredited VSO to make sure their "
            "actual claim is on track.",
        ),
        (
            "My friend at the VFW post said his guy got him a 100% rating. Can I use that guy?",
            "Verify first. <b>Look up the rep at va.gov/ogc/accreditation.asp.</b> If they're an accredited "
            "VSO rep, they're legit and they're free. If they're a private &quot;consultant,&quot; charging "
            "fees, they're operating outside the law. The friend got lucky &mdash; the next veteran who "
            "uses that guy may not.",
        ),
        (
            "An insurance agent at my church is offering free benefits help. Should I go?",
            "<b>Be very cautious.</b> Free seminars at churches, community centers, and senior living facilities "
            "are a classic pension-poaching delivery mechanism. The seminar itself may be educational, but "
            "the follow-up appointment is where the annuity gets sold. Tell them: go for the information, "
            "but never sign anything in the first meeting, and run the proposal past an accredited VSO.",
        ),
    ]))

    story.append(callout(
        styles,
        "FINAL TALKING POINT &mdash; The Sentence That Saves Money",
        "Print this on the wall: <b>&quot;Free is free. If they're charging me to file a VA claim, they're "
        "breaking the law.&quot;</b> Have students say it out loud once. The class isn't a financial seminar &mdash; "
        "it's a vaccine. They're going to get pitched within a year of retiring. The single most "
        "valuable thing you do this week is teach them to recognize the pitch.",
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
            ("2. Open the presentation and click through all 12 slides", "Remind yourself of slide order. ~5 min"),
            ("3. Have va.gov, mypay.dfas.mil, and reportfraud.ftc.gov in browser tabs", "Students will ask for URLs. Be ready."),
            ("4. Print backup copies of handouts", "CRDP vs. CRSC Comparison + Scam Prevention Reference"),
            ("5. Identify two local VSOs by name and phone", "DAV, VFW, American Legion nearest to your lab"),
            ("6. Practice the &quot;free is free&quot; line out loud", "Students will repeat what you repeat"),
            ("7. Have a backup story ready", "Many will have personal scam experiences &mdash; let them speak"),
        ],
        resource_rows=[
            ("VA Disability", "va.gov/disability", "Filing claims, secondary conditions, current rating tables, presumptive lists."),
            ("VA Pension", "va.gov/pension", "Eligibility, current income/asset limits, lookback rules."),
            ("Find an accredited VSO", "va.gov/ogc/accreditation.asp", "The only definitive list of who can legally help with claims."),
            ("DFAS (CRDP/CRSC)", "dfas.mil/RetiredMilitary", "How CRDP and CRSC are paid, election procedures, contact info."),
            ("Apply for CRSC", "dfas.mil &rarr; CRSC", "DD Form 2860 and branch-specific submission instructions."),
            ("PACT Act info", "va.gov/pact", "Presumptive conditions list and how to file under PACT."),
            ("VA OIG fraud hotline", "1-800-488-8244", "Report VA-related fraud, claim sharks, pension poaching."),
            ("FTC fraud reports", "reportfraud.ftc.gov", "Report any consumer scam targeting veterans."),
            ("FINRA BrokerCheck", "brokercheck.finra.org", "Verify any financial advisor before signing anything."),
        ],
        final_reminder_html=(
            "<b>Your value to these veterans is not the rating decisions you can predict.</b> It's that you "
            "sent them home knowing where to find an <i>accredited</i> VSO, what CRDP and CRSC are, and "
            "how to recognize a claim shark. Most of them have spent years not knowing. You changed that "
            "in two hours."
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
    story.extend(build_part1_claims(styles))
    story.extend(build_part2_crdp_crsc(styles))
    story.extend(build_part3_va_pension(styles))
    story.extend(build_part4_scams(styles))
    story.extend(build_part5_prep(styles))

    output_path = build_pdf(
        output_filename="module2-teachers-guide.pdf",
        title="Module 2 Teacher's Guide",
        story=story,
    )
    print(f"PDF generated: {os.path.basename(output_path)} (in Teacher Guides folder)")


if __name__ == "__main__":
    main()
