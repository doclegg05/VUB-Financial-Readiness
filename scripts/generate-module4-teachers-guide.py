"""Generate the Module 4 Teacher's Guide PDF.

Module 4 covers Managing Retirement Income: how to stack the income streams
veterans actually receive, federal and state tax treatment of each, RMDs and
how to manage them, debt in retirement, and the inflation/COLA picture.
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
        module_label="MODULE 4",
        title="Teacher's Guide",
        subtitle="Managing Retirement Income &mdash; Stacking, Taxes, RMDs, Debt &amp; Inflation",
        purpose_html=(
            "Module 4 is the &quot;put it all together&quot; class. By now your students know what they "
            "have (Module 1), what they could be getting more of (Module 2), and how their healthcare "
            "works (Module 3). This module is about the dollars actually flowing into the bank account: "
            "how the streams stack, what the IRS takes, what the state takes, and what they have to "
            "withdraw whether they want to or not."
            "<br/><br/>This is the densest module for numbers, the easiest to over-promise on, and the "
            "module where students will be most tempted to ask &quot;what should I do?&quot; You'll keep "
            "saying: &quot;Here's how the rule works &mdash; the right answer for you is a tax pro's job, "
            "not mine.&quot; That's not a cop-out. That's the truth."
        ),
        north_star_html=(
            "You are an <b>educator</b>, not a <b>CPA</b> or <b>financial planner</b>. When a student asks "
            "&quot;should I do a Roth conversion?&quot; or &quot;which state should I retire to?&quot; the "
            "answer is always: &quot;Here's how the rule works &mdash; here's what to consider &mdash; "
            "then talk to a fee-only financial planner or a CPA who specializes in military retirement.&quot; "
            "Tax math is personal: bracket, state, spouse income, Social Security timing, RMD age. You "
            "cannot run those numbers in class. You can teach the vocabulary."
        ),
        toc_rows=[
            ("1", "Income Stacking &mdash; The 5 Streams &amp; the Order to Withdraw", "2"),
            ("2", "Federal &amp; State Taxes on Retirement Income", "5"),
            ("3", "RMDs &mdash; Required Minimum Distributions in Detail", "8"),
            ("4", "Debt &amp; Inflation in Retirement", "10"),
            ("5", "The Day Before Class &mdash; Your Prep Checklist", "12"),
        ],
    )


def build_part1_income_stacking(styles: dict) -> list:
    story: list = []
    story.extend(part_header(styles, "Part 1 &mdash; Income Stacking"))

    story.append(Paragraph("The Five Streams &mdash; Most Veterans Have Three or Four", styles["h2"]))
    story.append(Paragraph(
        "A retired military veteran typically pulls from up to five distinct income streams. Each has a "
        "different tax treatment, a different inflation behavior, and a different role in the monthly "
        "picture. Your students don't usually think of them as a system &mdash; just as a confusing pile of "
        "deposits. The single most useful exercise in this class is making them lay them out on paper.",
        styles["body"]
    ))

    story.append(data_table(
        styles,
        ["Stream", "Tax treatment", "COLA?", "Reduces with work?"],
        [
            ["Military retired pay (DFAS)", "Federally taxable; state varies", "Yes (annual)", "No"],
            ["VA disability compensation", "Tax-free, federal &amp; state", "Yes (matches SSA)", "No"],
            ["Social Security retirement", "0&ndash;85% federally taxable", "Yes (annual)", "If under FRA + earning"],
            ["TSP / IRA &mdash; Traditional", "Fully taxable as ordinary income", "Indirect (markets)", "No"],
            ["TSP / IRA &mdash; Roth", "Tax-free if 5-yr rule + 59&frac12;", "Indirect (markets)", "No"],
            ["Employment income", "W-2 / 1099 ordinary income", "Depends on employer", "May reduce SS if under FRA"],
            ["SBP annuity (survivor only)", "Federally taxable", "Yes (annual)", "No"],
        ],
        col_widths=[2.0, 2.4, 1.0, 1.4],
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("The Tax-Efficient Withdrawal Order", styles["h2"]))
    story.append(Paragraph(
        "When a retiree needs to draw money beyond their guaranteed streams (pension + VA + SS), the order "
        "they pull from <b>Traditional</b> vs <b>Roth</b> vs <b>taxable savings</b> can change their "
        "lifetime tax bill by tens of thousands. The general principle, taught everywhere but rarely "
        "explained well:",
        styles["body"]
    ))
    story.append(Paragraph(
        "&bull; <b>Spend taxable accounts first</b> when possible. They've already paid tax on the principal; "
        "only the gain is taxed (often at favorable capital gains rates).<br/>"
        "&bull; <b>Then Traditional (TSP/IRA)</b>. Every dollar is ordinary income, but you can manage the "
        "rate by spreading withdrawals across years.<br/>"
        "&bull; <b>Save Roth for last.</b> Tax-free growth means it should compound the longest, and "
        "tax-free withdrawals are the most flexible &quot;emergency fuel&quot; in late retirement.",
        styles["body"]
    ))
    story.append(Paragraph(
        "<b>The catch:</b> RMDs (Part 3) force Traditional withdrawals at age 73 or 75 whether you want them "
        "or not. So the &quot;Traditional second&quot; rule is more of a guideline &mdash; sometimes pulling "
        "Traditional <i>earlier</i> (to fill a low tax bracket before SS or before RMDs kick in) saves more "
        "tax than waiting. This is exactly the planning a tax pro does.",
        styles["body"]
    ))

    story.append(numbers_table(styles, [
        ("Standard deduction, married filing jointly (2026)", "$31,500 (est., 2025 was $30,000)"),
        ("Standard deduction, single (2026)", "$15,750 (est.)"),
        ("Additional std. ded. for age 65+ (single)", "$2,000 (est.)"),
        ("Additional std. ded. for age 65+ (married, each)", "$1,600 (est.)"),
        ("Capital gains 0% bracket, MFJ (taxable income)", "Up to about $96,700"),
        ("Tax-free portion of VA disability", "100%"),
    ]))

    story.append(callout(
        styles,
        "WATCH OUT &mdash; Tax Bracket Numbers Drift Annually",
        "All federal tax thresholds (brackets, standard deductions, IRMAA, capital gains) are "
        "<b>inflation-adjusted</b> each year. The numbers in this guide are 2026 estimates &mdash; verify "
        "current figures at <font name='Courier' size='9'>irs.gov</font> before citing exact dollars in "
        "class. If a number is going to be quoted as gospel, look it up that morning.",
        CALLOUT_WATCH_BG, CALLOUT_WATCH_BORDER,
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("The 4% Rule &mdash; What It Actually Means", styles["h2"]))
    story.append(Paragraph(
        "Your students will hear &quot;the 4% rule&quot; from someone, somewhere &mdash; usually as a magic "
        "number for &quot;safe&quot; portfolio withdrawals. The accurate version: based on historical U.S. "
        "stock/bond returns, withdrawing 4% of a portfolio in year one and adjusting that dollar amount for "
        "inflation each year afterward has historically produced a portfolio that lasted 30 years. That's "
        "all it is. It's a starting point, not a prescription.",
        styles["body"]
    ))
    story.append(Paragraph(
        "<b>Most retired veterans in your room don't need it.</b> Military pension + VA disability + Social "
        "Security typically replaces 80&ndash;120% of pre-retirement income, with COLA. The TSP becomes a "
        "<i>supplement</i>, not the foundation. That changes the math considerably &mdash; they can take "
        "more risk, withdraw irregularly, or leave it alone for heirs.",
        styles["body"]
    ))

    story.append(qa_callout(styles, "IF A STUDENT ASKS&hellip;", [
        (
            "How much can I safely withdraw from my TSP each year?",
            "<b>You cannot answer this.</b> It depends on their other income, life expectancy, market "
            "returns, and risk tolerance. Tell them: &quot;A 4% starting withdrawal is a common reference "
            "point. But your military pension and VA pay already create a strong floor &mdash; you may be "
            "able to withdraw more or less depending on goals. A fee-only planner can model this for your "
            "specific situation.&quot;",
        ),
        (
            "I have $300K in Traditional TSP and $50K in Roth. Which should I draw first?",
            "<b>You cannot answer this directly.</b> The general principle: spend taxable savings first, "
            "Traditional second, Roth last &mdash; but RMDs at 73/75 force Traditional withdrawals. For most "
            "retirees, drawing some Traditional in low-bracket early years (before SS, before RMDs) is "
            "actually optimal. <b>This is exactly what tax projection software is for &mdash; refer them.</b>",
        ),
        (
            "Should I do a Roth conversion?",
            "<b>You cannot answer this.</b> Roth conversions move Traditional money to Roth, paying tax now "
            "to avoid bigger tax later. Best when (a) the retiree is in a low bracket today, (b) they expect "
            "RMDs to push them into a higher bracket, and (c) they have cash outside the IRA to pay the "
            "conversion tax. <b>Always coordinate with a CPA</b> &mdash; mistakes are nearly impossible to "
            "unwind because Congress eliminated re-characterizations in 2018.",
        ),
    ]))

    story.append(PageBreak())
    return story


def build_part2_taxes(styles: dict) -> list:
    story: list = []
    story.extend(part_header(styles, "Part 2 &mdash; Federal &amp; State Taxes"))

    story.append(Paragraph("Federal Taxation, Stream by Stream", styles["h2"]))
    story.append(Paragraph(
        "Each retirement income stream is taxed differently at the federal level. The chart below is the "
        "single most-photocopied page from the entire course &mdash; print it on a handout and your "
        "students will keep it in their files for years.",
        styles["body"]
    ))

    story.append(data_table(
        styles,
        ["Income source", "Federal tax", "Notes"],
        [
            ["Military retired pay (DFAS)", "Ordinary income", "1099-R issued by DFAS each January"],
            ["VA disability compensation", "<b>0%</b> &mdash; tax-free", "Not reported on 1040 at all"],
            ["VA pension (incl. A&amp;A)", "<b>0%</b> &mdash; tax-free", "Means-tested benefit"],
            ["Social Security retirement", "0&ndash;85% taxable", "Based on &quot;provisional income&quot; calc"],
            ["Traditional TSP / IRA withdrawals", "Ordinary income", "Required minimum distributions at 73/75"],
            ["Roth TSP / Roth IRA withdrawals", "<b>0%</b> if 5-year rule + 59&frac12;", "Both conditions must be met"],
            ["CRDP", "Ordinary income", "Treated like retired pay"],
            ["CRSC", "<b>0%</b> &mdash; tax-free", "Excluded from gross income"],
            ["SBP annuity (paid to survivor)", "Ordinary income", "1099-R from DFAS to survivor"],
            ["DIC (paid to survivor)", "<b>0%</b> &mdash; tax-free", "Tax-free survivor benefit"],
        ],
        col_widths=[2.4, 1.8, 2.6],
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("The Social Security Tax Trap", styles["h2"]))
    story.append(Paragraph(
        "Social Security benefits are partially taxable based on a calculation called <b>provisional "
        "income</b> &mdash; AGI + tax-exempt interest + 50% of SS benefits. Once a retiree's provisional "
        "income crosses certain thresholds, more of their SS becomes taxable.",
        styles["body"]
    ))

    story.append(data_table(
        styles,
        ["Filing status", "Provisional income", "% of SS taxable"],
        [
            ["Single", "Up to $25,000", "0%"],
            ["Single", "$25,001&ndash;$34,000", "Up to 50%"],
            ["Single", "Above $34,000", "Up to 85%"],
            ["MFJ", "Up to $32,000", "0%"],
            ["MFJ", "$32,001&ndash;$44,000", "Up to 50%"],
            ["MFJ", "Above $44,000", "Up to 85%"],
        ],
        col_widths=[1.8, 2.4, 2.6],
    ))

    story.append(Spacer(1, 4))
    story.append(callout(
        styles,
        "WATCH OUT &mdash; The Provisional Income Cliff",
        "These thresholds are <b>NOT inflation-adjusted</b>. They were set in 1983 (50% trigger) and 1993 "
        "(85% trigger) and have never moved. As a result, almost every military retiree with Social "
        "Security ends up with 85% of SS taxable. <b>Plan accordingly</b>: this is real money for couples "
        "with $40K+ in pension plus SS plus any TSP withdrawal.",
        CALLOUT_WATCH_BG, CALLOUT_WATCH_BORDER,
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("State Tax Treatment of Military Retirement", styles["h2"]))
    story.append(Paragraph(
        "State taxation varies more than federal, and it has shifted dramatically. As of 2026, the count of "
        "states fully exempting military retirement pay has expanded substantially &mdash; this is one of "
        "the few benefits trends moving in veterans' favor.",
        styles["body"]
    ))

    story.append(data_table(
        styles,
        ["Category", "States", "Notes"],
        [
            [
                "No state income tax",
                "AK, FL, NV, NH, SD, TN, TX, WA, WY",
                "9 states; income from any source is untaxed at the state level",
            ],
            [
                "Full exemption for military retirement",
                "AL, AZ, AR, IA, IL, IN, KS, LA, MI, MS, MO, NE, NJ, NY, NC, ND, OH, OK, PA, SC, UT, WV, WI",
                "23+ states (verify before citing); typically excludes 100% of pension",
            ],
            [
                "Partial exemption / age threshold",
                "CO, CT, DE, GA, ID, KY, MD, ME, MN, MT, NM, OR, RI",
                "Often a fixed dollar exemption or age 55+/65+ rule",
            ],
            [
                "Fully taxes military retirement",
                "CA, DC, VT (small group)",
                "Worth verifying current status &mdash; this list shrinks regularly",
            ],
        ],
        col_widths=[2.0, 3.0, 1.8],
    ))

    story.append(Spacer(1, 4))
    story.append(callout(
        styles,
        "DO NOT SAY &mdash; Don't Tell People Where to Move",
        "Do not say: &quot;You should move to Florida.&quot; State tax savings can be entirely consumed by "
        "<b>property taxes (TX, NJ), insurance premiums (FL, LA), or cost-of-living differences (NY, CA)</b>. "
        "Plus &mdash; family, climate, healthcare access, VA facility proximity, and friends matter more than "
        "tax savings to most retirees. Say: &quot;State tax is one factor; here's the chart so you can run "
        "your own numbers.&quot;",
        CALLOUT_DO_NOT_BG, CALLOUT_DO_NOT_BORDER,
    ))

    story.append(qa_callout(styles, "IF A STUDENT ASKS&hellip;", [
        (
            "Is my VA disability really tax-free, or is that a myth?",
            "<b>100% tax-free, federal and state, every state, no exceptions.</b> It's not even reported on "
            "the 1040. The reason: VA compensation isn't &quot;income&quot; in the legal sense &mdash; it's "
            "compensation for an injury (38 U.S.C. &sect; 5301). Same applies to CRSC. Same applies to DIC.",
        ),
        (
            "If I moved from California to Texas, how much would I save?",
            "<b>You cannot calculate this for them, but you can frame it.</b> CA top bracket on military "
            "pension is roughly 9.3%; TX is 0%. So a $50K military pension would save about $4,650/year in "
            "state tax. <i>However:</i> TX property tax averages 1.6% (vs CA 0.7%), home insurance is "
            "much higher, and groceries/services aren't dramatically cheaper. <b>The break-even depends on "
            "their full picture.</b>",
        ),
        (
            "Should I move to a no-income-tax state to save money?",
            "<b>You cannot answer this.</b> It's a major life decision with financial, family, and lifestyle "
            "components. Tell them: &quot;Map your full income, factor in property tax, insurance, and "
            "cost of living, and compare to the city you'd actually live in. Then a fee-only planner can "
            "model the breakeven for your specific situation.&quot;",
        ),
        (
            "Do I need to file a state return for the state I lived in last year if I moved?",
            "<b>Likely yes.</b> Most states require partial-year returns. Tell them to keep records of move "
            "dates and use a CPA the first year of the move to set the documentation correctly. After year 1, "
            "filing becomes straightforward.",
        ),
    ]))

    story.append(PageBreak())
    return story


def build_part3_rmds(styles: dict) -> list:
    story: list = []
    story.extend(part_header(styles, "Part 3 &mdash; Required Minimum Distributions"))

    story.append(Paragraph("What an RMD Is, In One Sentence", styles["h2"]))
    story.append(Paragraph(
        "A <b>Required Minimum Distribution (RMD)</b> is the amount the IRS forces you to withdraw from "
        "tax-deferred accounts each year starting at <b>age 73 or 75</b> (depending on birth year). The "
        "government has been waiting decades to tax that money &mdash; RMDs make sure it eventually does.",
        styles["body"]
    ))

    story.append(numbers_table(styles, [
        ("RMD age, born 1951&ndash;1959", "73"),
        ("RMD age, born 1960 or later", "75"),
        ("First RMD deadline", "April 1 of the year AFTER turning RMD age"),
        ("Subsequent RMD deadlines", "December 31 each year"),
        ("Penalty for missing an RMD (default)", "25% of missed amount"),
        ("Penalty if corrected within 2 years", "10% of missed amount (reduced)"),
        ("Roth IRA RMDs during owner's lifetime", "None"),
        ("Roth 401(k)/TSP RMDs (since 2024)", "None &mdash; SECURE 2.0 eliminated"),
    ]))

    story.append(Spacer(1, 6))
    story.append(Paragraph("How an RMD Is Calculated", styles["h2"]))
    story.append(Paragraph(
        "The math is simple: <b>account balance on December 31 of the previous year</b>, divided by an "
        "<b>IRS life-expectancy factor</b> from the Uniform Lifetime Table. The factor decreases each year, "
        "so the percentage withdrawn slowly increases.",
        styles["body"]
    ))

    story.append(data_table(
        styles,
        ["Age", "IRS divisor (Uniform Lifetime Table)", "Approx. % of balance"],
        [
            ["73", "26.5", "~3.77%"],
            ["75", "24.6", "~4.07%"],
            ["80", "20.2", "~4.95%"],
            ["85", "16.0", "~6.25%"],
            ["90", "12.2", "~8.20%"],
            ["95", "8.9", "~11.24%"],
        ],
        col_widths=[0.8, 3.5, 2.5],
    ))

    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>Worked example:</b> A veteran turning 75 with $400,000 in Traditional TSP plus $200,000 in a "
        "Traditional IRA: $600,000 / 24.6 = <b>$24,390 RMD for that year</b>. Taxed as ordinary income. "
        "The IRA RMD can be taken from any IRA, but the <b>TSP RMD must come from the TSP</b> &mdash; the "
        "rules don't aggregate across plan types.",
        styles["body"]
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("Strategies to Manage RMDs", styles["h2"]))
    story.append(Paragraph(
        "&bull; <b>Take the RMD early in the year</b> &mdash; people who wait until December die in November "
        "and create a tax mess for the estate.<br/>"
        "&bull; <b>Consolidate IRAs</b> if possible &mdash; one custodian, one calculation, one withdrawal.<br/>"
        "&bull; <b>Roth conversions before RMD age</b> can reduce future RMDs dramatically by shrinking "
        "the Traditional balance.<br/>"
        "&bull; <b>Qualified Charitable Distributions (QCDs)</b> can satisfy RMDs and zero out taxable "
        "income on those dollars (Part 4 below).<br/>"
        "&bull; <b>Set up automatic distributions</b> through the TSP/IRA custodian &mdash; the deadline "
        "is unforgiving and the penalty is steep.",
        styles["body"]
    ))

    story.append(Spacer(1, 4))
    story.append(Paragraph("QCDs &mdash; The Charity Trick That Actually Works", styles["h3"]))
    story.append(Paragraph(
        "A <b>Qualified Charitable Distribution (QCD)</b> lets veterans 70&frac12;+ direct up to "
        "<b>$108,000/year</b> (2026 limit, indexed) from a Traditional IRA <i>directly</i> to a qualified "
        "charity. The amount counts toward the RMD <b>and is excluded from taxable income</b>. For "
        "charitably inclined retirees, this is dramatically better than taking the RMD, paying tax on it, "
        "then donating &mdash; especially since fewer people itemize anymore.",
        styles["body"]
    ))

    story.append(callout(
        styles,
        "WATCH OUT &mdash; QCDs Don't Work from TSP",
        "QCDs can be made from <b>IRAs only</b> &mdash; not from a TSP, 401(k), or 403(b). A retiree who "
        "wants to use QCDs will need to <b>roll TSP into an IRA</b> first. That rollover is itself a "
        "decision (with trade-offs covered in Module 1) &mdash; don't recommend it casually.",
        CALLOUT_WATCH_BG, CALLOUT_WATCH_BORDER,
    ))

    story.append(qa_callout(styles, "IF A STUDENT ASKS&hellip;", [
        (
            "I'm 73 this year. When do I have to take my first RMD?",
            "By <b>April 1 of next year</b> for the first one. After that, by December 31 each year. "
            "<b>Caution:</b> if they wait until April 1 of next year, they'll have to take TWO RMDs in that "
            "year (the delayed first one and the current year's), which can push them into a higher bracket. "
            "Many people take the first RMD by Dec 31 of the year they turn 73 to avoid that double hit.",
        ),
        (
            "I have a TSP, an IRA, and an old 401(k). Do I have to take an RMD from each?",
            "<b>Each plan type computes separately, but IRAs aggregate.</b> So: one RMD calculation for the "
            "TSP (taken from the TSP), one RMD calculation for the old 401(k) (taken from there), and IRAs "
            "calculated together but the total can come from any one IRA. Consolidating reduces this hassle. "
            "Refer to a CPA for the year-of-RMD planning.",
        ),
        (
            "What happens if I miss an RMD?",
            "Default penalty is <b>25% of the missed amount</b>. If they catch it within 2 years and file "
            "Form 5329 with a reasonable-cause explanation, the IRS often reduces it to <b>10%</b> or even "
            "waives it. <b>Don't ignore it</b> &mdash; the IRS finds these in audit and the penalty stacks "
            "with interest.",
        ),
        (
            "Can I skip the RMD if I don't need the money?",
            "<b>No.</b> The IRS requires the withdrawal whether they need it or not. They can take it and "
            "immediately invest it in a regular brokerage account, gift it to family (within annual gift "
            "limits), or use a QCD if the goal is charity. The withdrawal can't be skipped.",
        ),
    ]))

    story.append(PageBreak())
    return story


def build_part4_debt_inflation(styles: dict) -> list:
    story: list = []
    story.extend(part_header(styles, "Part 4 &mdash; Debt &amp; Inflation in Retirement"))

    story.append(Paragraph("Debt in Retirement &mdash; The Reality Check", styles["h2"]))
    story.append(Paragraph(
        "A generation ago, retirees were largely debt-free. That world is gone. Most retirement-age "
        "Americans carry consumer debt; the average over-65 household has a non-trivial credit card balance. "
        "On a fixed income, debt service eats COLA-protected dollars and creates real risk &mdash; especially "
        "when interest rates are 18%+ on credit cards.",
        styles["body"]
    ))

    story.append(numbers_table(styles, [
        ("Retirement-age Americans with non-mortgage debt", "~97%"),
        ("Retirees carrying credit card balances", "~68%"),
        ("Average credit card balance, adults 65+", "$7,484"),
        ("Average credit card APR", "~22% (2026 estimate)"),
        ("Mortgage payoff math break-point", "Mortgage rate vs. expected investment return"),
        ("Recommended &quot;cash reserve&quot; in retirement", "6-24 months of expenses (varies)"),
    ]))

    story.append(Spacer(1, 6))
    story.append(Paragraph("The Debt Priorities &mdash; A Decision Tree", styles["h2"]))
    story.append(Paragraph(
        "Not all debt is the same. The framework most planners use:",
        styles["body"]
    ))
    story.append(Paragraph(
        "&bull; <b>High-interest consumer debt (credit cards, payday loans, store cards):</b> Always "
        "prioritize. The interest rate beats almost any investment return.<br/>"
        "&bull; <b>Auto loans:</b> Usually 4&ndash;8%; pay off if cash is available, refinance if rate is "
        "high.<br/>"
        "&bull; <b>Mortgage:</b> Math depends on rate. Below 4% is hard to beat as an investment. Above 6% "
        "becomes a candidate for early payoff.<br/>"
        "&bull; <b>Student loans:</b> Some retirees still carry these from late degrees or co-signed loans "
        "for kids. Often 5&ndash;7%; pay down or refinance.<br/>"
        "&bull; <b>Medical debt:</b> Negotiate first. Hospitals settle for 30&ndash;50%; collection agencies "
        "for less. Never put medical debt on a credit card.",
        styles["body"]
    ))

    story.append(callout(
        styles,
        "WATCH OUT &mdash; Don't Tap TSP to Pay Credit Cards",
        "A common temptation: take a $20K TSP withdrawal to wipe out high-interest debt. The math seems "
        "obvious. <b>It's almost always wrong.</b> A traditional withdrawal triggers ordinary income tax "
        "(potentially pushing into a higher bracket), can trigger IRMAA two years later, and may produce a "
        "10% early-withdrawal penalty if the retiree is under 59&frac12; (rare for VUB students, but "
        "possible). Plus the dollars stop compounding. <b>Better path:</b> 0% balance transfer cards, "
        "personal loans at 8&ndash;10%, or aggressive payoff using guaranteed monthly streams.",
        CALLOUT_WATCH_BG, CALLOUT_WATCH_BORDER,
    ))

    story.append(Spacer(1, 6))
    story.append(Paragraph("Inflation &amp; Buying Power Over a 30-Year Retirement", styles["h2"]))
    story.append(Paragraph(
        "A 65-year-old retiring today has a reasonable chance of living to 85, 90, even 95. Across that "
        "span, inflation does meaningful damage. A military retiree's COLA-protected streams (retired pay, "
        "VA, Social Security) hold up well. Private fixed-dollar income does not.",
        styles["body"]
    ))

    story.append(data_table(
        styles,
        ["Income source", "Inflation behavior", "What it means"],
        [
            ["Military retired pay", "Annual COLA matching CPI", "Holds purchasing power"],
            ["VA disability compensation", "Annual COLA (matches SSA)", "Holds purchasing power"],
            ["Social Security retirement", "Annual COLA matching CPI-W", "Holds purchasing power"],
            ["SBP annuity", "Annual COLA matching CPI", "Holds purchasing power"],
            ["Private pension", "Usually NO COLA", "Loses ~50% of value over 25 years at 3% inflation"],
            ["Fixed annuity", "Usually NO COLA", "Same problem &mdash; declining real value"],
            ["Bank savings", "Interest rarely beats inflation", "Slowly erodes"],
            ["Stocks (equities)", "Long-term beat inflation", "Volatile short-term, rewarded long-term"],
            ["TIPS / I-Bonds", "Indexed to inflation", "Designed specifically for this purpose"],
        ],
        col_widths=[1.8, 2.4, 2.6],
    ))

    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>The 3% rule of thumb:</b> at 3% average inflation, $1,000 today is worth $744 in 10 years and "
        "$554 in 20 years. A military retiree's COLA-protected income roughly tracks; a frozen private "
        "pension does not. This is one of the biggest hidden advantages of military retirement &mdash; and "
        "your students should know to value it.",
        styles["body"]
    ))

    story.append(qa_callout(styles, "IF A STUDENT ASKS&hellip;", [
        (
            "Should I pay off my mortgage with my TSP?",
            "<b>You cannot answer this.</b> Depends on the rate, the cash flow, the alternative use, and "
            "the tax cost of the withdrawal. Generally: under 4% rate, leave it; above 6%, consider it. "
            "<b>But</b> withdrawing from Traditional TSP to do this means paying ordinary income tax on the "
            "lump sum, which can push them into a higher bracket and trigger IRMAA. Have them <b>run "
            "numbers with a planner before pulling the trigger.</b>",
        ),
        (
            "I have a fixed annuity I bought years ago. Did I make a mistake?",
            "Maybe; maybe not. <b>Don't tell them they made a mistake.</b> Fixed annuities have downsides "
            "(no inflation protection, surrender charges) but they did provide guaranteed income. The "
            "decision now is: leave it, surrender it (often costly), or 1035-exchange to a different "
            "product (rarely a good idea unless a new one is provably better). Refer to a fee-only planner "
            "and tell them to <b>never trust the salesperson who sold the annuity</b> to advise on it.",
        ),
        (
            "I'm 70 and still have $80K in credit card debt. What do I do?",
            "First, frame: this is fixable, just slow. The path: (1) <b>stop adding to it</b>, (2) call the "
            "card companies and ask about hardship programs &mdash; many will lower the rate to 5-9% if "
            "the borrower is on fixed income, (3) make a debt-snowball or avalanche plan using their "
            "guaranteed COLA-protected monthly streams. Refer to a <b>nonprofit credit counselor</b> "
            "(NFCC.org) &mdash; never a for-profit &quot;debt-relief&quot; company.",
        ),
    ]))

    story.append(callout(
        styles,
        "FINAL TALKING POINT &mdash; The COLA Advantage",
        "Drive home this message: <b>military pay + VA pay + Social Security all carry annual COLA. Most "
        "private pensions do not.</b> Your students sit on one of the few inflation-protected income "
        "stacks in America. Tell them: &quot;You earned an income floor that adjusts with inflation for "
        "life. That's worth more than most civilian retirees ever get to claim.&quot; Once they grasp "
        "that, conversations about &quot;am I going to be okay?&quot; get a lot calmer.",
        CALLOUT_NUMBERS_BG, CALLOUT_NUMBERS_BORDER,
    ))

    story.append(PageBreak())
    return story


def build_part5_prep(styles: dict) -> list:
    return prep_checklist_section(
        styles,
        part_label="Part 5 &mdash; The Day Before Class",
        checklist_rows=[
            ("1. Re-read Parts 1&ndash;4 of this guide", "Skim; focus on the Key Numbers boxes. ~10 min"),
            ("2. Open the presentation and click through all 11 slides", "Remind yourself of slide order. ~5 min"),
            ("3. Verify 2026 numbers if citing exact figures", "Standard deduction, IRMAA, RMD divisors &mdash; check irs.gov"),
            ("4. Print backup copies of handouts", "TSP Retirement Income Guide + State Benefits Reference"),
            ("5. Prepare the state-tax map", "Have your state's specific rule ready &mdash; students always ask"),
            ("6. Have NFCC.org ready", "For students with credit-card-debt questions"),
            ("7. Practice the &quot;you cannot answer this&quot; phrasing", "Roth conversions, withdrawal rates, where to retire &mdash; refer out"),
        ],
        resource_rows=[
            ("IRS RMD info", "irs.gov (search &quot;RMD&quot;)", "Tables, deadlines, and forms for required distributions."),
            ("TSP info", "tsp.gov", "TSP withdrawal rules, RMD coordination, fund details."),
            ("Social Security taxation", "ssa.gov/benefits/retirement/planner/taxes.html", "Provisional income and SS taxability calculation."),
            ("State tax research", "militarywallet.com or state tax dept", "State-by-state military pension treatment."),
            ("Find a fee-only advisor", "napfa.org", "Fee-only fiduciaries; no commissions."),
            ("Verify any advisor", "brokercheck.finra.org", "Look up history, complaints, licensing."),
            ("Free credit counseling", "nfcc.org", "Nonprofit credit counseling for debt help."),
            ("VA Pension info (recap)", "va.gov/pension", "Eligibility and 36-month lookback rules."),
            ("IRMAA brackets", "ssa.gov/medicare/lower-irmaa", "Current Income-Related Monthly Adjustment thresholds."),
        ],
        final_reminder_html=(
            "<b>You are not their tax pro. You are their translator.</b> The most useful gift you can give "
            "this room isn't the right answer for their tax situation &mdash; it's the vocabulary to ask "
            "better questions of the people who can give the right answer. RMD. IRMAA. QCD. Provisional "
            "income. Roth conversion. State military exemption. They walk in not knowing those words. "
            "They walk out asking their CPA about them. That's the win."
        ),
        footer_text=(
            "Teacher's Guide prepared for Britt Legg &mdash; VUB Financial Readiness Course, Spring 2026. "
            "Information reflects 2026 rules and estimates; verify before citing specific dollar amounts."
        ),
    )


def main() -> None:
    styles = make_styles()
    story: list = []
    story.extend(build_cover(styles))
    story.extend(build_part1_income_stacking(styles))
    story.extend(build_part2_taxes(styles))
    story.extend(build_part3_rmds(styles))
    story.extend(build_part4_debt_inflation(styles))
    story.extend(build_part5_prep(styles))

    output_path = build_pdf(
        output_filename="module4-teachers-guide.pdf",
        title="Module 4 Teacher's Guide",
        story=story,
    )
    print(f"PDF generated: {os.path.basename(output_path)} (in Teacher Guides folder)")


if __name__ == "__main__":
    main()
