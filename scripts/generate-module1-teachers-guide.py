"""Generate the Module 1 Teacher's Guide PDF.

A subject-matter reference for an instructor who is not a subject-matter expert.
Organized by topic (not slide) so the instructor can get confident on a concept
before stepping into class. Each topic has: plain-English explanation, key numbers,
student FAQs, and pitfalls to avoid.
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, KeepTogether,
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
import os

# ── Officer's Briefing Room palette (matches project) ──
NAVY = HexColor("#1b2e4a")
NAVY_LIGHT = HexColor("#2d5aa0")
BRASS = HexColor("#c8a84e")
BRASS_LIGHT = HexColor("#d4b86a")
WARM_BG = HexColor("#f4f1eb")
TEXT_DARK = HexColor("#1a1510")
TEXT_BODY = HexColor("#3d3529")
BORDER = HexColor("#d4cfc5")
ROW_ALT = HexColor("#f9f7f3")

# Callout accent colors
CALLOUT_Q_BG = HexColor("#eef5fb")   # Student question — cool blue
CALLOUT_Q_BORDER = HexColor("#2d5aa0")
CALLOUT_WATCH_BG = HexColor("#fdf4e3")  # Watch out — warm amber
CALLOUT_WATCH_BORDER = HexColor("#c8a84e")
CALLOUT_DO_NOT_BG = HexColor("#fbeeee")  # Do NOT say — red
CALLOUT_DO_NOT_BORDER = HexColor("#a13232")
CALLOUT_NUMBERS_BG = HexColor("#eef6ef")  # Key numbers — green
CALLOUT_NUMBERS_BORDER = HexColor("#2f6a3a")

OUTPUT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_PATH = os.path.join(OUTPUT_DIR, "teacher-guides", "module1-teachers-guide.pdf")


def make_styles() -> dict:
    return {
        "cover_title": ParagraphStyle(
            "cover_title", fontName="Times-Bold", fontSize=28, leading=34,
            textColor=white, alignment=TA_CENTER,
        ),
        "cover_subtitle": ParagraphStyle(
            "cover_subtitle", fontName="Times-Italic", fontSize=14, leading=20,
            textColor=BRASS_LIGHT, alignment=TA_CENTER,
        ),
        "cover_module": ParagraphStyle(
            "cover_module", fontName="Helvetica-Bold", fontSize=11, leading=14,
            textColor=BRASS, alignment=TA_CENTER, spaceAfter=6,
        ),
        "h1": ParagraphStyle(
            "h1", fontName="Times-Bold", fontSize=20, leading=24,
            textColor=NAVY, spaceBefore=0, spaceAfter=10,
        ),
        "h2": ParagraphStyle(
            "h2", fontName="Times-Bold", fontSize=15, leading=19,
            textColor=NAVY, spaceBefore=14, spaceAfter=6,
        ),
        "h3": ParagraphStyle(
            "h3", fontName="Helvetica-Bold", fontSize=11, leading=14,
            textColor=NAVY_LIGHT, spaceBefore=8, spaceAfter=4,
        ),
        "body": ParagraphStyle(
            "body", fontName="Helvetica", fontSize=10, leading=14,
            textColor=TEXT_BODY, alignment=TA_LEFT, spaceAfter=6,
        ),
        "body_bold": ParagraphStyle(
            "body_bold", fontName="Helvetica-Bold", fontSize=10, leading=14,
            textColor=TEXT_DARK,
        ),
        "small": ParagraphStyle(
            "small", fontName="Helvetica", fontSize=9, leading=12,
            textColor=TEXT_BODY,
        ),
        "callout_title": ParagraphStyle(
            "callout_title", fontName="Helvetica-Bold", fontSize=10, leading=13,
            textColor=TEXT_DARK, spaceAfter=4,
        ),
        "callout_body": ParagraphStyle(
            "callout_body", fontName="Helvetica", fontSize=9.5, leading=13,
            textColor=TEXT_BODY,
        ),
        "callout_q": ParagraphStyle(
            "callout_q", fontName="Helvetica-BoldOblique", fontSize=9.5, leading=13,
            textColor=NAVY, spaceAfter=3,
        ),
        "callout_a": ParagraphStyle(
            "callout_a", fontName="Helvetica", fontSize=9.5, leading=13,
            textColor=TEXT_BODY, spaceAfter=6,
        ),
        "footer": ParagraphStyle(
            "footer", fontName="Helvetica", fontSize=8, leading=10,
            textColor=TEXT_BODY, alignment=TA_CENTER,
        ),
    }


def callout(styles: dict, title: str, body_html: str, bg: HexColor, border: HexColor) -> Table:
    """Single-cell colored callout box with a title and body."""
    content = [
        [Paragraph(title, styles["callout_title"])],
        [Paragraph(body_html, styles["callout_body"])],
    ]
    t = Table(content, colWidths=[6.8 * inch])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), bg),
        ("LINEBEFORE", (0, 0), (0, -1), 3, border),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    return t


def qa_callout(styles: dict, title: str, qa_pairs: list[tuple[str, str]]) -> Table:
    """'If a student asks...' callout with Q/A pairs."""
    rows = [[Paragraph(title, styles["callout_title"])]]
    for q, a in qa_pairs:
        rows.append([Paragraph(f"<b>Q:</b> <i>{q}</i>", styles["callout_q"])])
        rows.append([Paragraph(f"<b>A:</b> {a}", styles["callout_a"])])
    t = Table(rows, colWidths=[6.8 * inch])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), CALLOUT_Q_BG),
        ("LINEBEFORE", (0, 0), (0, -1), 3, CALLOUT_Q_BORDER),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    return t


def numbers_table(styles: dict, rows: list[tuple[str, str]]) -> Table:
    """Key numbers reference table."""
    header = [Paragraph("<b>KEY NUMBERS</b>", styles["callout_title"])]
    data = [[header[0], ""]]
    for label, value in rows:
        data.append([
            Paragraph(label, styles["small"]),
            Paragraph(f"<b>{value}</b>", styles["small"]),
        ])
    t = Table(data, colWidths=[4.6 * inch, 2.2 * inch])
    t.setStyle(TableStyle([
        ("SPAN", (0, 0), (1, 0)),
        ("BACKGROUND", (0, 0), (-1, 0), CALLOUT_NUMBERS_BORDER),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        ("BACKGROUND", (0, 1), (-1, -1), CALLOUT_NUMBERS_BG),
        ("LINEBEFORE", (0, 1), (0, -1), 3, CALLOUT_NUMBERS_BORDER),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ALIGN", (1, 1), (1, -1), "RIGHT"),
    ]))
    return t


def build_cover_page(styles: dict) -> list:
    """Cover page banner spanning most of the first page."""
    story = []
    banner = [
        [Paragraph("MODULE 1", styles["cover_module"])],
        [Paragraph("Teacher's Guide", styles["cover_title"])],
        [Paragraph("Know What You Have &mdash; Retirement Pay, TSP &amp; Social Security", styles["cover_subtitle"])],
    ]
    banner_table = Table(banner, colWidths=[7.0 * inch])
    banner_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), NAVY),
        ("TOPPADDING", (0, 0), (0, 0), 50),
        ("TOPPADDING", (0, 1), (0, 1), 4),
        ("TOPPADDING", (0, 2), (0, 2), 4),
        ("BOTTOMPADDING", (0, -1), (0, -1), 50),
        ("LEFTPADDING", (0, 0), (-1, -1), 20),
        ("RIGHTPADDING", (0, 0), (-1, -1), 20),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("ROUNDEDCORNERS", [8, 8, 8, 8]),
        ("LINEBELOW", (0, 0), (-1, 0), 1, BRASS),
    ]))
    story.append(banner_table)
    story.append(Spacer(1, 16))

    # Purpose block
    story.append(Paragraph("Who this guide is for", styles["h2"]))
    story.append(Paragraph(
        "This guide exists so you can step into class feeling <i>confident</i>, not just prepared. "
        "You are not expected to be a financial planner &mdash; you are an educator. Your job is "
        "to help veterans understand benefits they've earned, point them to the right resources, "
        "and encourage them to seek personalized advice from qualified professionals.",
        styles["body"]
    ))
    story.append(Paragraph(
        "Each topic below gives you a plain-English explanation, the numbers worth memorizing, "
        "questions students are most likely to ask (with answers you can give), and pitfalls to avoid. "
        "Read the topic for a given week <i>before</i> class. You do not need to read the whole guide at once.",
        styles["body"]
    ))

    story.append(Spacer(1, 10))
    story.append(callout(
        styles,
        "YOUR NORTH STAR &mdash; The One Rule",
        "You are an <b>educator</b>, not an <b>advisor</b>. When a student asks \"what should I do?\" your "
        "answer is always: \"Here's how it works &mdash; here's what to consider &mdash; then talk to a "
        "fee-only financial planner, your VA benefits counselor, or a tax professional.\" Never tell a "
        "veteran when to claim Social Security, when to withdraw TSP, or what investments to choose. "
        "Not because you don't want to help &mdash; but because their situation has details you don't know.",
        CALLOUT_DO_NOT_BG, CALLOUT_DO_NOT_BORDER,
    ))

    story.append(Spacer(1, 10))

    # Table of contents
    story.append(Paragraph("What's in this guide", styles["h2"]))
    toc_data = [
        [Paragraph("<b>Part</b>", styles["body_bold"]),
         Paragraph("<b>Topic</b>", styles["body_bold"]),
         Paragraph("<b>Page</b>", styles["body_bold"])],
        [Paragraph("1", styles["body"]),
         Paragraph("Military Retired Pay (High-3, COLA, the RAS)", styles["body"]),
         Paragraph("2", styles["body"])],
        [Paragraph("2", styles["body"]),
         Paragraph("VA Disability Compensation &amp; the VA Waiver", styles["body"]),
         Paragraph("4", styles["body"])],
        [Paragraph("3", styles["body"]),
         Paragraph("Thrift Savings Plan (TSP) &mdash; What, Funds, Withdrawals", styles["body"]),
         Paragraph("5", styles["body"])],
        [Paragraph("4", styles["body"]),
         Paragraph("Social Security &mdash; Basics, Spousal/Survivor, Claiming Math", styles["body"]),
         Paragraph("8", styles["body"])],
        [Paragraph("5", styles["body"]),
         Paragraph("The Day Before Class &mdash; Your Prep Checklist", styles["body"]),
         Paragraph("11", styles["body"])],
    ]
    toc_table = Table(toc_data, colWidths=[0.6 * inch, 5.4 * inch, 0.8 * inch])
    toc_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        ("BACKGROUND", (0, 2), (-1, 2), ROW_ALT),
        ("BACKGROUND", (0, 4), (-1, 4), ROW_ALT),
        ("GRID", (0, 0), (-1, -1), 0.5, BORDER),
        ("LINEBELOW", (0, 0), (-1, 0), 1, BRASS),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    story.append(toc_table)

    story.append(PageBreak())
    return story


def build_part1_retirement_pay(styles: dict) -> list:
    story = []
    story.append(Paragraph("Part 1 &mdash; Military Retired Pay", styles["h1"]))
    story.append(HRFlowable(width="100%", thickness=1, color=BRASS))
    story.append(Spacer(1, 6))

    # ── High-3 ──
    story.append(Paragraph("High-3 &mdash; How the Formula Works", styles["h2"]))
    story.append(Paragraph(
        "Most retired veterans in your class are paid under the <b>High-3 system</b>. The formula is "
        "simple arithmetic. You multiply three things together:",
        styles["body"]
    ))
    story.append(Paragraph(
        "&nbsp;&nbsp;<b>(Average of the highest 36 months of basic pay) &times; (Years of service) &times; 2.5%</b>",
        styles["body"]
    ))
    story.append(Paragraph(
        "<b>Worked example:</b> A retiree whose highest 36 months averaged $7,000/month and who served "
        "20 years gets: $7,000 &times; 20 &times; 0.025 = <b>$3,500 per month</b>. Thirty years would be "
        "$5,250/month. Each extra year adds 2.5 percentage points to the multiplier.",
        styles["body"]
    ))
    story.append(Paragraph(
        "The pay is adjusted every January for inflation through a <b>Cost-of-Living Adjustment (COLA)</b>. "
        "COLA tracks the Consumer Price Index, so purchasing power is roughly preserved over decades. "
        "This is a huge deal. A civilian pension that doesn't adjust for inflation loses about half its "
        "value over 25 years. Military retired pay doesn't.",
        styles["body"]
    ))

    story.append(numbers_table(styles, [
        ("Multiplier per year of service", "2.5%"),
        ("Years needed for standard retirement", "20"),
        ("20-year multiplier", "50% of High-3"),
        ("30-year multiplier", "75% of High-3"),
        ("40-year multiplier (maximum)", "100% of High-3"),
        ("COLA frequency", "Annual (January)"),
        ("Taxed at the federal level?", "Yes"),
    ]))

    story.append(qa_callout(styles, "IF A STUDENT ASKS&hellip;", [
        (
            "Is my retired pay under High-3, Final Pay, or BRS?",
            "Depends on when they entered service. <b>Final Pay</b>: entered before Sept 8, 1980. "
            "<b>High-3</b>: entered Sept 8, 1980 &ndash; Dec 31, 2017 (nearly everyone you'll teach). "
            "<b>BRS (Blended Retirement System)</b>: entered on/after Jan 1, 2018, OR opted in during "
            "the 2018 window. BRS has a smaller pension multiplier (2.0% instead of 2.5%) plus a TSP match.",
        ),
        (
            "Why is my gross retired pay lower than my formula says it should be?",
            "Almost always the <b>VA Waiver</b>. If they receive VA disability compensation, retired pay is "
            "reduced dollar-for-dollar by that amount (we'll cover this in Part 2). CRDP or CRSC may restore "
            "some or all of it &mdash; that's Module 2.",
        ),
        (
            "Where do I see my pay details?",
            "<b>myPay</b> at mypay.dfas.mil. It shows gross pay, deductions, net, and their 1099-R tax "
            "statement. Anyone without an account can set one up with their Social Security Number and a "
            "mailing address on file with DFAS.",
        ),
    ]))

    story.append(callout(
        styles,
        "WATCH OUT &mdash; Common Confusion",
        "Students sometimes confuse <b>retired pay</b> (from DoD/DFAS, taxable) with <b>VA disability</b> "
        "(from the VA, tax-free). These are two separate checks from two separate agencies. Pension and "
        "compensation are <i>different words</i> in the benefits world &mdash; don't use them interchangeably.",
        CALLOUT_WATCH_BG, CALLOUT_WATCH_BORDER,
    ))

    story.append(Spacer(1, 8))

    # ── Reading the RAS ──
    story.append(Paragraph("Reading the Retiree Account Statement (RAS)", styles["h2"]))
    story.append(Paragraph(
        "DFAS mails a <b>Retiree Account Statement (RAS)</b> whenever pay changes. Most veterans glance at "
        "the bottom line and file it. You want to teach them to actually read it, because that's where "
        "discrepancies show up.",
        styles["body"]
    ))
    story.append(Paragraph(
        "The RAS shows line items that build up to the net deposit. Memorize this vocabulary:",
        styles["body"]
    ))
    story.append(Paragraph(
        "&bull; <b>Gross Pay</b> &mdash; the base retired pay (formula output)<br/>"
        "&bull; <b>VA Waiver</b> &mdash; reduction from receiving VA disability (dollar-for-dollar)<br/>"
        "&bull; <b>SBP Premium</b> &mdash; Survivor Benefit Plan deduction (if enrolled; covered in Module 5)<br/>"
        "&bull; <b>Federal Tax Withholding</b> &mdash; based on the retiree's W-4P election<br/>"
        "&bull; <b>State Tax Withholding</b> &mdash; only if the state taxes military retirement<br/>"
        "&bull; <b>CRDP / CRSC</b> &mdash; restored pay (if they qualify; Module 2)<br/>"
        "&bull; <b>Net Pay</b> &mdash; what actually hits their bank account",
        styles["body"]
    ))

    story.append(qa_callout(styles, "IF A STUDENT ASKS&hellip;", [
        (
            "My RAS says my VA Waiver is wrong &mdash; what do I do?",
            "This happens when the VA changes a disability rating and DFAS hasn't caught up. The systems "
            "don't talk to each other in real time. Tell them to contact DFAS (1-800-321-1080) and keep a "
            "copy of their most recent VA award letter.",
        ),
        (
            "Can I change my federal tax withholding?",
            "Yes &mdash; submit a new <b>W-4P</b> through myPay. This is a common adjustment veterans make "
            "after they start Social Security, because total taxable income jumps and their old withholding "
            "is no longer enough.",
        ),
    ]))

    story.append(PageBreak())
    return story


def build_part2_va_disability(styles: dict) -> list:
    story = []
    story.append(Paragraph("Part 2 &mdash; VA Disability &amp; the VA Waiver", styles["h1"]))
    story.append(HRFlowable(width="100%", thickness=1, color=BRASS))
    story.append(Spacer(1, 6))

    story.append(Paragraph("What VA Disability Compensation Is", styles["h2"]))
    story.append(Paragraph(
        "<b>VA disability compensation</b> is a monthly tax-free payment from the Department of Veterans "
        "Affairs for service-connected medical conditions. It is paid based on a <b>rating</b> from 0% to "
        "100%, in 10-point increments. Ratings are not about \"how disabled you are\" in an everyday sense "
        "&mdash; they're a specific scoring system the VA uses to translate conditions into a dollar amount.",
        styles["body"]
    ))
    story.append(Paragraph(
        "The key differences from retired pay:",
        styles["body"]
    ))
    story.append(Paragraph(
        "&bull; <b>Tax-free</b> at the federal and state level (retired pay is taxable)<br/>"
        "&bull; <b>Not reduced</b> by other income, Social Security, or working<br/>"
        "&bull; <b>Continues for life</b> unless the rating is changed (rare unless condition improves)<br/>"
        "&bull; <b>Can be increased</b> if conditions worsen or new conditions develop",
        styles["body"]
    ))

    story.append(numbers_table(styles, [
        ("Rating range", "0% to 100% (10% increments)"),
        ("Federal tax on VA disability", "None"),
        ("State tax on VA disability", "None (all 50 states)"),
        ("Counts toward Social Security earnings?", "No"),
        ("Approximate monthly at 100% single (2026)", "~$3,831"),
        ("COLA adjustment", "Annual (matches SS COLA)"),
    ]))

    story.append(Spacer(1, 4))
    story.append(Paragraph("The VA Waiver &mdash; Why This Matters", styles["h2"]))
    story.append(Paragraph(
        "Here is the concept students struggle with most. If a veteran receives <b>both</b> military retired "
        "pay AND VA disability compensation, federal law requires their retired pay to be reduced "
        "dollar-for-dollar by their VA compensation amount. This is called the <b>VA Waiver</b> or <b>offset</b>.",
        styles["body"]
    ))
    story.append(Paragraph(
        "<b>Example:</b> A veteran is entitled to $3,500/month retired pay and $1,200/month VA disability. "
        "Their gross retired pay gets reduced by $1,200 (the waiver). They still receive the full $1,200 "
        "from the VA &mdash; it just moves from DoD's check to the VA's check. Total? $3,500/month. But "
        "now $1,200 of it is <b>tax-free</b>, which is the real benefit.",
        styles["body"]
    ))
    story.append(Paragraph(
        "This is why the VA Waiver looks scary on the RAS but is usually a good thing: the veteran's "
        "<i>net</i> income goes up because a chunk of pay becomes tax-free. Programs called <b>CRDP</b> and "
        "<b>CRSC</b> (Module 2) can restore some or all of the waiver for qualifying veterans &mdash; "
        "essentially letting them receive both checks without the offset.",
        styles["body"]
    ))

    story.append(qa_callout(styles, "IF A STUDENT ASKS&hellip;", [
        (
            "I never filed a VA claim. Is it too late?",
            "<b>Never too late.</b> There is no deadline for a service-connection claim. Many veterans "
            "develop conditions years after service &mdash; hearing loss, tinnitus, sleep apnea, back "
            "issues, mental-health conditions tied to service. Module 2 covers filing a claim. Point them "
            "to a <b>VSO (Veterans Service Officer)</b> &mdash; the DAV, VFW, and American Legion all "
            "provide free filing help.",
        ),
        (
            "If my rating goes up, will I lose retired pay?",
            "Their retired pay <i>reduction</i> (waiver) may increase, but they'll gain more in tax-free "
            "VA pay than they lose in taxable retired pay. <b>Higher rating is almost always better</b> "
            "unless they're chasing specific taxable-income thresholds for other programs.",
        ),
        (
            "Does VA disability affect my Social Security?",
            "No. VA disability compensation is not \"earned income,\" so it doesn't affect Social Security "
            "retirement benefits at any age and doesn't trigger earnings-test reductions. Social Security "
            "<i>Disability Insurance</i> (SSDI) is a separate federal program with its own rules.",
        ),
    ]))

    story.append(callout(
        styles,
        "DO NOT SAY &mdash; Liability Trap",
        "Do not tell a student \"you probably qualify for a higher rating.\" Rating decisions are highly "
        "specific to medical evidence. Instead, say: \"A VSO can review your medical records and tell you "
        "what claims might be worth pursuing &mdash; for free.\"",
        CALLOUT_DO_NOT_BG, CALLOUT_DO_NOT_BORDER,
    ))

    story.append(PageBreak())
    return story


def build_part3_tsp(styles: dict) -> list:
    story = []
    story.append(Paragraph("Part 3 &mdash; Thrift Savings Plan (TSP)", styles["h1"]))
    story.append(HRFlowable(width="100%", thickness=1, color=BRASS))
    story.append(Spacer(1, 6))

    story.append(Paragraph("What the TSP Is, In One Sentence", styles["h2"]))
    story.append(Paragraph(
        "The <b>Thrift Savings Plan (TSP)</b> is the federal government's version of a 401(k). If your "
        "student contributed during service, they have a TSP account. If they were paid during the BRS era "
        "(2018+) or opted in, they also got a match from the government. After retirement, they can no "
        "longer contribute, but their balance stays invested and grows (or shrinks) based on fund choices.",
        styles["body"]
    ))

    story.append(Paragraph("Traditional vs. Roth TSP", styles["h3"]))
    story.append(Paragraph(
        "This is the single most important tax concept in the whole course. Say it slowly.",
        styles["body"]
    ))
    story.append(Paragraph(
        "&bull; <b>Traditional TSP</b>: Contributions went in <b>pre-tax</b> (reduced their paycheck's "
        "taxable income during service). Every dollar they withdraw in retirement is taxed as "
        "<i>ordinary income</i>. The IRS has been waiting 30 years to tax this money.<br/>"
        "&bull; <b>Roth TSP</b>: Contributions went in <b>after-tax</b> (no paycheck break during service). "
        "Every dollar they withdraw in retirement &mdash; including <i>all the growth</i> &mdash; comes out "
        "<b>tax-free</b> as long as the account is 5+ years old and they're age 59&frac12;+.",
        styles["body"]
    ))
    story.append(Paragraph(
        "A veteran can have <b>both</b> kinds of money in the same TSP account &mdash; the TSP tracks "
        "the Traditional and Roth \"balances\" separately. When they take a withdrawal, it comes out "
        "proportionally from each.",
        styles["body"]
    ))

    story.append(Spacer(1, 4))
    story.append(Paragraph("The Five Core Funds (G, F, C, S, I)", styles["h2"]))
    story.append(Paragraph(
        "These are the individual TSP funds. Your students need to know <b>what they own</b>, even if you "
        "never tell them what to own:",
        styles["body"]
    ))

    fund_data = [
        [Paragraph("<b>Fund</b>", styles["body_bold"]),
         Paragraph("<b>What it invests in</b>", styles["body_bold"]),
         Paragraph("<b>Risk</b>", styles["body_bold"])],
        [Paragraph("<b>G</b> Fund", styles["body_bold"]),
         Paragraph("Short-term U.S. Treasury securities &mdash; cannot lose principal. Earns a specific rate "
                   "set by Treasury law. Think: \"guaranteed slow growth.\"", styles["small"]),
         Paragraph("Lowest", styles["small"])],
        [Paragraph("<b>F</b> Fund", styles["body_bold"]),
         Paragraph("U.S. bond market (Bloomberg Aggregate index). More yield than G, but principal can "
                   "fluctuate with interest rates.", styles["small"]),
         Paragraph("Low-Moderate", styles["small"])],
        [Paragraph("<b>C</b> Fund", styles["body_bold"]),
         Paragraph("S&amp;P 500 index &mdash; the 500 largest U.S. companies. Apple, Microsoft, ExxonMobil, "
                   "etc. Long-term growth, short-term ups and downs.", styles["small"]),
         Paragraph("Moderate", styles["small"])],
        [Paragraph("<b>S</b> Fund", styles["body_bold"]),
         Paragraph("U.S. small- and mid-cap stocks <i>outside</i> the S&amp;P 500. Higher long-term return "
                   "potential, higher volatility.", styles["small"]),
         Paragraph("Higher", styles["small"])],
        [Paragraph("<b>I</b> Fund", styles["body_bold"]),
         Paragraph("International developed-market stocks (Europe, Japan, Australia, emerging markets). "
                   "Adds currency risk on top of stock risk.", styles["small"]),
         Paragraph("Higher", styles["small"])],
    ]
    fund_table = Table(fund_data, colWidths=[0.8 * inch, 5.1 * inch, 0.9 * inch])
    fund_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        ("BACKGROUND", (0, 2), (-1, 2), ROW_ALT),
        ("BACKGROUND", (0, 4), (-1, 4), ROW_ALT),
        ("GRID", (0, 0), (-1, -1), 0.5, BORDER),
        ("LINEBELOW", (0, 0), (-1, 0), 1, BRASS),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(fund_table)
    story.append(Spacer(1, 6))

    story.append(Paragraph(
        "<b>L Funds (Lifecycle Funds)</b> are \"target-date\" mixes of the five core funds, automatically "
        "rebalanced to get more conservative as the target year approaches. Someone retiring in 2030 would "
        "use <b>L 2030</b>. Your older retired students might be in <b>L Income</b> (the most conservative), "
        "which assumes they're already drawing.",
        styles["body"]
    ))

    story.append(numbers_table(styles, [
        ("TSP average expense ratio", "~0.048% (about $5 per $10,000)"),
        ("Industry-average 401(k) expense ratio", "~0.37% (roughly 8x higher)"),
        ("Number of individual funds", "5 (G, F, C, S, I)"),
        ("Number of Lifecycle funds", "11 (L Income + 10 target dates)"),
        ("TSP website", "tsp.gov"),
        ("ThriftLine", "1-877-968-3778"),
    ]))

    story.append(Spacer(1, 4))
    story.append(Paragraph("Withdrawals in Retirement", styles["h2"]))
    story.append(Paragraph(
        "Retired veterans have four options. Say them in this order &mdash; \"most flexible\" to "
        "\"most permanent\":",
        styles["body"]
    ))
    story.append(Paragraph(
        "&bull; <b>Leave it.</b> Money keeps growing tax-deferred in whatever funds it's in. No action "
        "required until RMD age (see next page). This is usually the default.<br/>"
        "&bull; <b>TSP Installments.</b> Set a monthly dollar amount, or have TSP calculate payments "
        "based on life expectancy. Can be changed later.<br/>"
        "&bull; <b>Single (partial) withdrawal.</b> One-time lump sum of any amount &ge; $1,000. Can take "
        "as many as they want.<br/>"
        "&bull; <b>Full withdrawal / rollover.</b> Move the entire balance out &mdash; either as cash (taxable "
        "event for Traditional portion) or as a direct rollover into an IRA (not a taxable event).",
        styles["body"]
    ))

    story.append(Paragraph("Required Minimum Distributions (RMDs)", styles["h3"]))
    story.append(Paragraph(
        "Once a veteran reaches <b>RMD age</b>, the IRS requires them to start withdrawing a minimum "
        "amount each year from tax-deferred accounts (Traditional TSP, Traditional IRA, old 401(k)s). The "
        "government wants its tax revenue on money it's been waiting to tax. <b>Roth TSP and Roth IRAs "
        "have no RMDs during the owner's lifetime.</b>",
        styles["body"]
    ))

    story.append(numbers_table(styles, [
        ("RMD age (born before 1960)", "73"),
        ("RMD age (born 1960 or later)", "75"),
        ("First RMD deadline", "April 1 the year after RMD age"),
        ("Subsequent RMD deadline", "December 31 each year"),
        ("Penalty for missing an RMD", "25% of the missed amount"),
        ("Penalty if corrected within 2 years", "10% (reduced)"),
        ("Law that made these changes", "SECURE 2.0 Act (2022)"),
    ]))

    story.append(qa_callout(styles, "IF A STUDENT ASKS&hellip;", [
        (
            "Should I roll my TSP into an IRA?",
            "<b>You cannot answer this.</b> Trade-offs exist. TSP has very low fees and simple fund choices. "
            "IRAs offer more investment options, more flexible partial withdrawals, and Roth conversion "
            "flexibility. It's a real decision with real trade-offs. Tell them: <i>\"This is exactly the "
            "kind of question a fee-only financial planner can analyze for your specific situation. "
            "The military.mmoa.org or napfa.org directories list fee-only advisors who specialize in "
            "military families.\"</i>",
        ),
        (
            "Which fund should I be in?",
            "<b>You cannot answer this.</b> Risk tolerance and time horizon are personal. You <i>can</i> "
            "point out: \"If you haven't looked at your allocation in 10 years, that's worth a conversation "
            "with an advisor. The L Funds are a reasonable default if you want a hands-off mix.\"",
        ),
        (
            "Can I still contribute to my TSP now that I'm retired?",
            "No. Only active federal employees and service members can contribute. Their balance still "
            "grows (or shrinks) based on investments, and they can change allocations, but no new money "
            "goes in. They could contribute to an <b>IRA</b> outside of TSP if they have earned income "
            "(a job, self-employment), but retired pay and Social Security don't count as earned income.",
        ),
        (
            "What happens to my TSP when I die?",
            "It passes to whoever is named on <b>Form TSP-3</b> (the beneficiary form). This beats a will "
            "&mdash; whoever is on TSP-3 gets the money, period. Beneficiary designations are covered in "
            "Module 5. Remind everyone to check these regularly, especially after divorce or remarriage.",
        ),
    ]))

    story.append(callout(
        styles,
        "WATCH OUT &mdash; The #1 TSP Scam",
        "After a veteran retires, they start getting phone calls and slick mailers from firms offering to "
        "\"help them manage their TSP\" &mdash; usually by rolling it into a high-fee annuity or a "
        "commissioned broker account. These often charge 1&ndash;2% annually, 20&ndash;40x what the TSP "
        "charges. Warn students: <b>if someone is pitching them an IRA rollover over the phone, they are "
        "being sold to, not advised.</b> Always verify advisors at sec.gov/investor or brokercheck.finra.org.",
        CALLOUT_WATCH_BG, CALLOUT_WATCH_BORDER,
    ))

    story.append(PageBreak())
    return story


def build_part4_social_security(styles: dict) -> list:
    story = []
    story.append(Paragraph("Part 4 &mdash; Social Security", styles["h1"]))
    story.append(HRFlowable(width="100%", thickness=1, color=BRASS))
    story.append(Spacer(1, 6))

    story.append(Paragraph("The Vocabulary First", styles["h2"]))
    story.append(Paragraph(
        "Social Security has a small set of terms that do a lot of work. If students understand these five, "
        "most of their confusion goes away:",
        styles["body"]
    ))
    story.append(Paragraph(
        "&bull; <b>PIA (Primary Insurance Amount)</b> &mdash; the monthly benefit a worker receives if they "
        "claim at their Full Retirement Age. Everything else is a percentage of this number.<br/>"
        "&bull; <b>FRA (Full Retirement Age)</b> &mdash; the age at which they get 100% of their PIA. For "
        "anyone born 1960 or later, FRA is <b>67</b>. For earlier birth years, it's a sliding scale from "
        "66 to 66&frac34;.<br/>"
        "&bull; <b>Early claiming</b> &mdash; any month before FRA, down to age 62. Reduces the benefit "
        "<i>permanently</i>.<br/>"
        "&bull; <b>Delayed Retirement Credits (DRCs)</b> &mdash; 8% per year added to the benefit for each "
        "year claiming is delayed past FRA, up to age 70. This also is permanent (in a good way).<br/>"
        "&bull; <b>COLA</b> &mdash; annual cost-of-living adjustment, typically announced in October, "
        "effective January.",
        styles["body"]
    ))

    story.append(numbers_table(styles, [
        ("FRA, born 1960 or later", "67"),
        ("FRA, born 1955&ndash;1959", "66 + 2&ndash;10 months (sliding)"),
        ("Earliest claiming age (retirement benefit)", "62"),
        ("Latest age with any delay credit", "70 (no benefit in waiting past 70)"),
        ("Benefit if claimed at 62 (FRA 67)", "~70% of PIA"),
        ("Benefit if claimed at FRA", "100% of PIA"),
        ("Benefit if claimed at 70 (FRA 67)", "124% of PIA"),
        ("Delayed credit per year past FRA", "+8% (up to age 70)"),
    ]))

    story.append(Spacer(1, 4))
    story.append(Paragraph("Spousal &amp; Survivor Benefits", styles["h2"]))
    story.append(Paragraph(
        "Social Security is designed around the assumption that spouses depend on each other. Two separate "
        "benefits come from that:",
        styles["body"]
    ))
    story.append(Paragraph(
        "<b>Spousal benefit:</b> While both spouses are alive, the lower-earning (or non-earning) spouse "
        "can claim up to <b>50% of the higher earner's PIA</b>, if that's more than their own benefit. "
        "They must be at least 62 and the higher-earning spouse must have already filed. Claimed before the "
        "lower-earning spouse's FRA, the 50% is reduced.",
        styles["body"]
    ))
    story.append(Paragraph(
        "<b>Survivor benefit:</b> When the higher earner dies, the surviving spouse can step up to "
        "<b>100% of what the deceased was receiving</b> (or would have received), <i>replacing</i> their "
        "own smaller benefit. They do not get both &mdash; they switch to the larger. This is why the "
        "higher earner's claiming age matters for both spouses: if the husband delays to 70 for a bigger "
        "check, his widow (if she's younger) also inherits that bigger check.",
        styles["body"]
    ))

    story.append(qa_callout(styles, "IF A STUDENT ASKS&hellip;", [
        (
            "My wife never worked &mdash; can she get Social Security?",
            "Yes, based on <b>his</b> record. She can claim a spousal benefit starting at 62 (reduced) or "
            "up to 50% of his PIA at her FRA. When he dies, she switches to 100% of his benefit as a "
            "survivor. She does not need any earnings history of her own.",
        ),
        (
            "We're divorced &mdash; can I still get a spousal benefit on my ex?",
            "Yes, <b>if</b>: (1) they were married 10+ years, (2) the student is currently unmarried, and "
            "(3) the ex is at least 62. Same 50% rule applies. <i>The ex-spouse does not need to have "
            "filed yet</i>, and critically, <b>claiming does not reduce the ex's benefit</b>, so there's no "
            "need to coordinate. Many veterans don't know this.",
        ),
        (
            "Will working part-time after I start Social Security reduce my check?",
            "Before FRA: yes, there's an earnings test &mdash; $1 is withheld for every $2 earned above the "
            "annual limit (~$22,000 in 2026). After FRA: no test. Work all they want. Note: withheld money "
            "isn't lost &mdash; it's recalculated into a higher benefit later.",
        ),
        (
            "Does my military retired pay count against Social Security?",
            "No. Retired pay isn't \"earned income\" for the earnings test. They can receive full retired "
            "pay plus full Social Security with no offset. VA disability also doesn't count. The earnings "
            "test only applies to <i>wages from a current job</i>.",
        ),
    ]))

    story.append(Spacer(1, 6))
    story.append(Paragraph("The Dollar Math &mdash; 62 vs. 67 vs. 70", styles["h2"]))
    story.append(Paragraph(
        "This is the single most-asked question in the entire course. The honest answer is: <i>\"It "
        "depends, and nobody knows for sure, because it depends on how long you live.\"</i> But you can "
        "arm students with the math.",
        styles["body"]
    ))
    story.append(Paragraph(
        "<b>Worked example</b> (someone with an FRA of 67 and a PIA of $2,000/month):",
        styles["body"]
    ))

    math_data = [
        [Paragraph("<b>Claim at&hellip;</b>", styles["body_bold"]),
         Paragraph("<b>Monthly benefit</b>", styles["body_bold"]),
         Paragraph("<b>Annual benefit</b>", styles["body_bold"]),
         Paragraph("<b>vs. claiming at 67</b>", styles["body_bold"])],
        [Paragraph("62 (earliest)", styles["body"]),
         Paragraph("$1,400", styles["body"]),
         Paragraph("$16,800", styles["body"]),
         Paragraph("&minus;30% for life", styles["body"])],
        [Paragraph("67 (FRA)", styles["body"]),
         Paragraph("$2,000", styles["body"]),
         Paragraph("$24,000", styles["body"]),
         Paragraph("baseline", styles["body"])],
        [Paragraph("70 (max)", styles["body"]),
         Paragraph("$2,480", styles["body"]),
         Paragraph("$29,760", styles["body"]),
         Paragraph("+24% for life", styles["body"])],
    ]
    math_table = Table(math_data, colWidths=[1.4 * inch, 1.6 * inch, 1.6 * inch, 2.2 * inch])
    math_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        ("BACKGROUND", (0, 2), (-1, 2), ROW_ALT),
        ("GRID", (0, 0), (-1, -1), 0.5, BORDER),
        ("LINEBELOW", (0, 0), (-1, 0), 1, BRASS),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
    ]))
    story.append(math_table)
    story.append(Spacer(1, 6))

    story.append(Paragraph(
        "The <b>break-even point</b> between claiming at 62 and at 67 is roughly age <b>78</b>. Between "
        "67 and 70, it's roughly <b>82-83</b>. If a veteran lives past those ages, delaying wins. If they "
        "don't, claiming early wins. Average U.S. male life expectancy at 62 is about 81. For a healthy "
        "non-smoker with good genes and access to VA/TRICARE healthcare: meaningfully longer.",
        styles["body"]
    ))

    story.append(callout(
        styles,
        "TALKING POINT &mdash; What to Actually Say in Class",
        "Frame claiming age around <b>life situation</b>, not a \"right answer\":<br/>"
        "&bull; <i>\"If you have a shorter life expectancy or need the money now, claiming at 62 makes sense.\"</i><br/>"
        "&bull; <i>\"If you're married and your spouse will outlive you, delaying to 70 gives her a "
        "bigger survivor benefit for life.\"</i><br/>"
        "&bull; <i>\"If you're still working, delaying avoids the earnings test and builds credits.\"</i><br/>"
        "&bull; <i>\"There is no one right answer &mdash; but the Social Security Claiming Worksheet "
        "(handout) walks through the considerations for your situation.\"</i>",
        CALLOUT_NUMBERS_BG, CALLOUT_NUMBERS_BORDER,
    ))

    story.append(qa_callout(styles, "THE TRICKIEST QUESTIONS YOU'LL GET", [
        (
            "Social Security is going broke &mdash; should I claim early before it's gone?",
            "<b>No &mdash; and this is the most damaging myth in the course.</b> The Trust Fund runs a "
            "projected shortfall around 2033-2035, but that does NOT mean benefits stop. If nothing changes, "
            "payroll taxes would still cover roughly 75-80% of scheduled benefits. Claiming early to \"beat "
            "the cut\" just locks in a 30% reduction <i>for life</i> &mdash; which is much worse than any "
            "plausible legislative change.",
        ),
        (
            "My friend said I should claim at 62 and invest the difference &mdash; good plan?",
            "For that to beat delaying, investments would need to earn well above 8%/year <i>after taxes "
            "and after sequence-of-returns risk</i>. Delayed retirement credits are a guaranteed 8% per "
            "year. Very few investment strategies reliably beat that. And the credit is also a form of "
            "longevity insurance &mdash; it pays more if you live longer, which is when you'd need it most.",
        ),
        (
            "Can I un-do my Social Security claim if I change my mind?",
            "Yes, but only once and only within <b>12 months</b> of starting. They have to repay every "
            "dollar received. After 12 months, it's permanent. Separately, at FRA they can <b>voluntarily "
            "suspend</b> benefits to earn delayed credits &mdash; but payments to spouses on their record "
            "also stop during suspension.",
        ),
    ]))

    story.append(PageBreak())
    return story


def build_part5_prep_checklist(styles: dict) -> list:
    story = []
    story.append(Paragraph("Part 5 &mdash; The Day Before Class", styles["h1"]))
    story.append(HRFlowable(width="100%", thickness=1, color=BRASS))
    story.append(Spacer(1, 6))

    story.append(Paragraph("Your 20-Minute Prep Routine", styles["h2"]))
    story.append(Paragraph(
        "You will teach this class in two hours. Here's a pre-class routine that fits in 20 minutes and "
        "makes the difference between \"nervous\" and \"ready.\"",
        styles["body"]
    ))

    checklist_rows = [
        ("1. Re-read Parts 1-4 of this guide", "Skim; focus on the Key Numbers boxes. ~8 min"),
        ("2. Open the presentation and click through all 14 slides", "Remind yourself of slide order. ~5 min"),
        ("3. Have tsp.gov and ssa.gov open in browser tabs", "Students will ask for URLs. Be ready."),
        ("4. Print backup copies of handouts", "Retirement Transition Checklist + SS Claiming Worksheet"),
        ("5. Put the big disclaimer on your tongue", "\"I'm an educator, not an advisor. For decisions, here are resources.\""),
        ("6. Have a VSO referral ready", "VFW, DAV, or American Legion nearest to your lab"),
        ("7. Know the time of sunset", "Don't let Q&amp;A run past 6:30; respect their evening"),
    ]
    check_data = [[
        Paragraph("<b>Step</b>", styles["body_bold"]),
        Paragraph("<b>Notes</b>", styles["body_bold"]),
    ]]
    for step, note in checklist_rows:
        check_data.append([
            Paragraph(step, styles["body"]),
            Paragraph(note, styles["small"]),
        ])
    check_table = Table(check_data, colWidths=[2.8 * inch, 4.0 * inch])
    check_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        ("BACKGROUND", (0, 2), (-1, 2), ROW_ALT),
        ("BACKGROUND", (0, 4), (-1, 4), ROW_ALT),
        ("BACKGROUND", (0, 6), (-1, 6), ROW_ALT),
        ("GRID", (0, 0), (-1, -1), 0.5, BORDER),
        ("LINEBELOW", (0, 0), (-1, 0), 1, BRASS),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(check_table)

    story.append(Spacer(1, 10))
    story.append(Paragraph("Authoritative Resources &mdash; Bookmark These", styles["h2"]))
    story.append(Paragraph(
        "When a student asks a question you can't answer, don't guess. Go here. Keep these bookmarked in "
        "the classroom browser.",
        styles["body"]
    ))

    resource_rows = [
        ("TSP", "tsp.gov", "Official Thrift Savings Plan site &mdash; fund details, withdrawal rules, forms."),
        ("Social Security", "ssa.gov / ssa.gov/myaccount", "Create a 'my Social Security' account to see PIA estimates, earnings record, claiming projections."),
        ("DFAS (Retired Pay)", "dfas.mil / mypay.dfas.mil", "RAS, W-4P updates, 1099-R, beneficiary forms."),
        ("VA Benefits", "va.gov / va.gov/disability", "Disability ratings, claim filing, award letters, healthcare enrollment."),
        ("Find a VSO", "va.gov/ogc/accreditation.asp", "Accredited Veterans Service Officers for free claim help."),
        ("Fee-only advisors", "napfa.org", "National Association of Personal Financial Advisors &mdash; fee-only fiduciaries only."),
        ("Verify an advisor", "brokercheck.finra.org", "Look up any broker/advisor's history, complaints, licenses."),
        ("RMD calculator", "irs.gov (search \"RMD worksheet\")", "Official IRS tables for calculating Required Minimum Distributions."),
    ]
    resource_data = [[
        Paragraph("<b>Topic</b>", styles["body_bold"]),
        Paragraph("<b>URL</b>", styles["body_bold"]),
        Paragraph("<b>What you'll find</b>", styles["body_bold"]),
    ]]
    for topic, url, desc in resource_rows:
        resource_data.append([
            Paragraph(topic, styles["body"]),
            Paragraph(f"<font name='Courier' size='9'>{url}</font>", styles["small"]),
            Paragraph(desc, styles["small"]),
        ])
    resource_table = Table(resource_data, colWidths=[1.4 * inch, 2.1 * inch, 3.3 * inch])
    resource_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        ("BACKGROUND", (0, 2), (-1, 2), ROW_ALT),
        ("BACKGROUND", (0, 4), (-1, 4), ROW_ALT),
        ("BACKGROUND", (0, 6), (-1, 6), ROW_ALT),
        ("BACKGROUND", (0, 8), (-1, 8), ROW_ALT),
        ("GRID", (0, 0), (-1, -1), 0.5, BORDER),
        ("LINEBELOW", (0, 0), (-1, 0), 1, BRASS),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(resource_table)

    story.append(Spacer(1, 10))
    story.append(callout(
        styles,
        "FINAL REMINDER &mdash; If You Only Remember One Thing",
        "<b>Your value to these veterans is not that you know every answer.</b> It's that you care enough "
        "to meet with them for two hours a week, you've pointed them at reliable resources, and you've "
        "given them the vocabulary to ask better questions of their VSO, their tax preparer, and their "
        "financial advisor. That is plenty. That is a lot.",
        CALLOUT_NUMBERS_BG, CALLOUT_NUMBERS_BORDER,
    ))

    # Footer
    story.append(Spacer(1, 16))
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "Teacher's Guide prepared for Britt Legg &mdash; VUB Financial Readiness Course, Spring 2026. "
        "Information reflects 2026 rules; verify before citing specific dollar amounts.",
        styles["footer"]
    ))
    return story


def build_pdf() -> None:
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=letter,
        topMargin=0.55 * inch,
        bottomMargin=0.55 * inch,
        leftMargin=0.7 * inch,
        rightMargin=0.7 * inch,
        title="Module 1 Teacher's Guide",
        author="VUB Financial Readiness Course",
    )

    styles = make_styles()
    story: list = []
    story.extend(build_cover_page(styles))
    story.extend(build_part1_retirement_pay(styles))
    story.extend(build_part2_va_disability(styles))
    story.extend(build_part3_tsp(styles))
    story.extend(build_part4_social_security(styles))
    story.extend(build_part5_prep_checklist(styles))

    doc.build(story)
    print(f"PDF generated: {OUTPUT_PATH}")


if __name__ == "__main__":
    build_pdf()
