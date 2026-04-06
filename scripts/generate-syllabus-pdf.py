"""Generate a one-page syllabus PDF for the VUB Financial Readiness Course."""

from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import os

# Colors (Officer's Briefing Room palette)
NAVY = HexColor("#1b2e4a")
NAVY_LIGHT = HexColor("#2d5aa0")
BRASS = HexColor("#c8a84e")
BRASS_LIGHT = HexColor("#d4b86a")
WARM_BG = HexColor("#f4f1eb")
TEXT_DARK = HexColor("#1a1510")
TEXT_BODY = HexColor("#3d3529")
BORDER = HexColor("#d4cfc5")
ROW_ALT = HexColor("#f9f7f3")

OUTPUT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_PATH = os.path.join(OUTPUT_DIR, "syllabus-one-page.pdf")


def build_pdf():
    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=letter,
        topMargin=0.4 * inch,
        bottomMargin=0.4 * inch,
        leftMargin=0.6 * inch,
        rightMargin=0.6 * inch,
    )

    styles = {
        "title": ParagraphStyle(
            "title", fontName="Times-Bold", fontSize=18, leading=22,
            textColor=white, alignment=TA_CENTER,
        ),
        "subtitle": ParagraphStyle(
            "subtitle", fontName="Times-Roman", fontSize=10, leading=13,
            textColor=BRASS_LIGHT, alignment=TA_CENTER,
        ),
        "section": ParagraphStyle(
            "section", fontName="Times-Bold", fontSize=11, leading=14,
            textColor=NAVY, spaceBefore=10, spaceAfter=4,
        ),
        "body": ParagraphStyle(
            "body", fontName="Helvetica", fontSize=9, leading=12,
            textColor=TEXT_BODY,
        ),
        "body_bold": ParagraphStyle(
            "body_bold", fontName="Helvetica-Bold", fontSize=9, leading=12,
            textColor=TEXT_DARK,
        ),
        "small": ParagraphStyle(
            "small", fontName="Helvetica", fontSize=8, leading=10,
            textColor=TEXT_BODY,
        ),
        "footer": ParagraphStyle(
            "footer", fontName="Helvetica", fontSize=7.5, leading=10,
            textColor=TEXT_BODY, alignment=TA_CENTER,
        ),
    }

    story = []

    # ── Header banner (table hack for background color) ──
    header_data = [[
        Paragraph("Financial Readiness Course", styles["title"]),
    ], [
        Paragraph("Veterans Upward Bound &mdash; West Virginia &nbsp;|&nbsp; Spring 2026", styles["subtitle"]),
    ]]
    header_table = Table(header_data, colWidths=[7.0 * inch])
    header_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), NAVY),
        ("TOPPADDING", (0, 0), (0, 0), 12),
        ("BOTTOMPADDING", (0, -1), (0, -1), 10),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("ROUNDEDCORNERS", [6, 6, 6, 6]),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 8))

    # ── Course info row ──
    info_data = [[
        Paragraph("<b>Instructor:</b> Britt Legg", styles["body"]),
        Paragraph("<b>Schedule:</b> Mondays, 4:30 &ndash; 6:30 PM", styles["body"]),
        Paragraph("<b>Dates:</b> April 27 &ndash; June 1, 2026", styles["body"]),
        Paragraph("<b>Location:</b> VUB Computer Lab", styles["body"]),
    ]]
    info_table = Table(info_data, colWidths=[1.75 * inch] * 4)
    info_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), WARM_BG),
        ("BOX", (0, 0), (-1, -1), 0.5, BORDER),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
    ]))
    story.append(info_table)
    story.append(Spacer(1, 8))

    # ── Course Description ──
    story.append(Paragraph("Course Description", styles["section"]))
    story.append(Paragraph(
        "This 6-week course equips military veterans with the financial knowledge needed to "
        "maximize retirement benefits, avoid costly mistakes, and protect what they've built. "
        "Topics include retirement pay, VA disability, healthcare coordination, tax-efficient "
        "withdrawals, and estate planning &mdash; all tailored to the unique financial landscape "
        "veterans face.",
        styles["body"]
    ))
    story.append(Spacer(1, 6))

    # ── Schedule Table ──
    story.append(Paragraph("Weekly Schedule", styles["section"]))

    schedule_header = [
        Paragraph("<b>Week</b>", styles["body_bold"]),
        Paragraph("<b>Date</b>", styles["body_bold"]),
        Paragraph("<b>Module</b>", styles["body_bold"]),
        Paragraph("<b>Topics</b>", styles["body_bold"]),
    ]

    schedule_rows = [
        schedule_header,
        [
            Paragraph("1", styles["body"]),
            Paragraph("Apr 27", styles["body"]),
            Paragraph("<b>Pre-Test + Module 1</b><br/>Know What You Have", styles["body"]),
            Paragraph("Military retirement pay (High-3), TSP funds &amp; withdrawals, "
                      "Social Security claiming strategy (62 vs 67 vs 70), spousal &amp; survivor benefits", styles["small"]),
        ],
        [
            Paragraph("2", styles["body"]),
            Paragraph("May 4", styles["body"]),
            Paragraph("<b>Module 2</b><br/>Disability Benefits", styles["body"]),
            Paragraph("Filing VA claims, secondary conditions, CRDP vs CRSC, VA Pension &amp; "
                      "36-month lookback rule, scam prevention ($584M veteran losses in 2024)", styles["small"]),
        ],
        [
            Paragraph("3", styles["body"]),
            Paragraph("May 11", styles["body"]),
            Paragraph("<b>Module 3</b><br/>Healthcare &amp; Long-Term Care", styles["body"]),
            Paragraph("Medicare at 65, TRICARE for Life coordination, Part B/D penalties, "
                      "CHAMPVA, Aid &amp; Attendance eligibility &amp; 2026 rates", styles["small"]),
        ],
        [
            Paragraph("4", styles["body"]),
            Paragraph("May 18", styles["body"]),
            Paragraph("<b>Module 4</b><br/>Managing Your Retirement Income", styles["body"]),
            Paragraph("Income stacking, federal &amp; state taxation, RMD strategies, "
                      "Roth conversions, debt in retirement, inflation protection", styles["small"]),
        ],
        [
            Paragraph("5", styles["body"]),
            Paragraph("May 25", styles["body"]),
            Paragraph("<b>Module 5</b><br/>Legacy &amp; Estate Planning", styles["body"]),
            Paragraph("Survivor Benefit Plan, DIC, SBP-DIC offset elimination (2023), "
                      "estate documents, beneficiary designations, cognitive decline planning", styles["small"]),
        ],
        [
            Paragraph("6", styles["body"]),
            Paragraph("Jun 1", styles["body"]),
            Paragraph("<b>Review + Post-Test</b>", styles["body"]),
            Paragraph("Course review, Q&amp;A, post-test assessment (20 questions), "
                      "score comparison with pre-test, certificates of completion", styles["small"]),
        ],
    ]

    col_widths = [0.5 * inch, 0.6 * inch, 1.9 * inch, 4.0 * inch]
    schedule_table = Table(schedule_rows, colWidths=col_widths)
    schedule_table.setStyle(TableStyle([
        # Header
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        # Alternating rows
        ("BACKGROUND", (0, 2), (-1, 2), ROW_ALT),
        ("BACKGROUND", (0, 4), (-1, 4), ROW_ALT),
        ("BACKGROUND", (0, 6), (-1, 6), ROW_ALT),
        # Grid
        ("GRID", (0, 0), (-1, 6), 0.5, BORDER),
        ("LINEBELOW", (0, 0), (-1, 0), 1, BRASS),
        # Padding
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(schedule_table)
    story.append(Spacer(1, 8))

    # ── Two-column: Materials + Assessment ──
    story.append(Paragraph("Course Materials &amp; Assessment", styles["section"]))

    left_content = Paragraph(
        "<b>Materials Provided (no cost):</b><br/>"
        "&bull; Printed handouts for each module<br/>"
        "&bull; Social Security Claiming Worksheet<br/>"
        "&bull; State Benefits Reference Card<br/>"
        "&bull; Scam Prevention Quick Reference<br/>"
        "&bull; Online study resources (quiz, flashcards, podcast)",
        styles["small"]
    )
    right_content = Paragraph(
        "<b>Assessment:</b><br/>"
        "&bull; Pre-Test (Week 1): 20-question baseline<br/>"
        "&bull; Post-Test (Week 5): Same 20 questions<br/>"
        "&bull; Purpose: Measure knowledge gained<br/>"
        "&bull; No grades &mdash; this is for your benefit<br/>"
        "<br/>"
        "<b>What to Bring:</b> Pen, notepad, any VA correspondence",
        styles["small"]
    )

    two_col = Table([[left_content, right_content]], colWidths=[3.5 * inch, 3.5 * inch])
    two_col.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), WARM_BG),
        ("BOX", (0, 0), (-1, -1), 0.5, BORDER),
        ("LINEBEFORE", (1, 0), (1, 0), 0.5, BORDER),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(two_col)
    story.append(Spacer(1, 8))

    # ── Disclaimer ──
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER))
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "This course is for educational purposes only and does not constitute financial, legal, or tax advice. "
        "Benefit rules change frequently &mdash; verify current eligibility with the VA, SSA, or a qualified advisor. "
        "All financial figures reflect 2026 estimates.",
        styles["footer"]
    ))
    story.append(Spacer(1, 2))
    story.append(Paragraph(
        "<b>Veterans Upward Bound &mdash; West Virginia</b> &nbsp;|&nbsp; "
        "Instructor: Britt Legg &nbsp;|&nbsp; "
        "Questions? Contact your VUB coordinator",
        styles["footer"]
    ))

    doc.build(story)
    print(f"PDF generated: {OUTPUT_PATH}")


if __name__ == "__main__":
    build_pdf()
