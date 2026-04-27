"""Shared helpers for VUB Teacher's Guide PDFs (Modules 2-5).

Style palette, callout boxes, key-numbers tables, and cover-page builder
extracted so each module generator can stay focused on subject matter.
"""

from __future__ import annotations

import os

from reportlab.lib.colors import HexColor, white
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    HRFlowable,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

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
CALLOUT_Q_BG = HexColor("#eef5fb")
CALLOUT_Q_BORDER = HexColor("#2d5aa0")
CALLOUT_WATCH_BG = HexColor("#fdf4e3")
CALLOUT_WATCH_BORDER = HexColor("#c8a84e")
CALLOUT_DO_NOT_BG = HexColor("#fbeeee")
CALLOUT_DO_NOT_BORDER = HexColor("#a13232")
CALLOUT_NUMBERS_BG = HexColor("#eef6ef")
CALLOUT_NUMBERS_BORDER = HexColor("#2f6a3a")

# Project root (parent of scripts/)
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEACHER_GUIDES_DIR = os.path.join(PROJECT_ROOT, "\U0001f4d8 Teacher Guides")


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
    rows: list[list] = [[Paragraph(title, styles["callout_title"])]]
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
    header = Paragraph("<b>KEY NUMBERS</b>", styles["callout_title"])
    data: list[list] = [[header, ""]]
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


def data_table(
    styles: dict,
    header: list[str],
    rows: list[list[str]],
    col_widths: list[float],
) -> Table:
    """A standard navy-headed data table with alternating rows."""
    data: list[list] = [[Paragraph(f"<b>{h}</b>", styles["body_bold"]) for h in header]]
    for row in rows:
        data.append([Paragraph(cell, styles["small"]) for cell in row])
    t = Table(data, colWidths=[w * inch for w in col_widths])
    style_cmds = [
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        ("GRID", (0, 0), (-1, -1), 0.5, BORDER),
        ("LINEBELOW", (0, 0), (-1, 0), 1, BRASS),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]
    # zebra-stripe even rows (skip header at index 0)
    for i in range(2, len(data), 2):
        style_cmds.append(("BACKGROUND", (0, i), (-1, i), ROW_ALT))
    t.setStyle(TableStyle(style_cmds))
    return t


def build_cover_page(
    styles: dict,
    module_label: str,
    title: str,
    subtitle: str,
    purpose_html: str,
    north_star_html: str,
    toc_rows: list[tuple[str, str, str]],
) -> list:
    """Cover page banner + purpose block + TOC. Returns story flowables."""
    story: list = []
    banner = [
        [Paragraph(module_label, styles["cover_module"])],
        [Paragraph("Teacher's Guide", styles["cover_title"])],
        [Paragraph(subtitle, styles["cover_subtitle"])],
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

    story.append(Paragraph("Who this guide is for", styles["h2"]))
    story.append(Paragraph(purpose_html, styles["body"]))

    story.append(Spacer(1, 10))
    story.append(callout(
        styles,
        "YOUR NORTH STAR &mdash; The One Rule",
        north_star_html,
        CALLOUT_DO_NOT_BG, CALLOUT_DO_NOT_BORDER,
    ))

    story.append(Spacer(1, 10))
    story.append(Paragraph("What's in this guide", styles["h2"]))

    toc_data: list[list] = [[
        Paragraph("<b>Part</b>", styles["body_bold"]),
        Paragraph("<b>Topic</b>", styles["body_bold"]),
        Paragraph("<b>Page</b>", styles["body_bold"]),
    ]]
    for part, topic, page in toc_rows:
        toc_data.append([
            Paragraph(part, styles["body"]),
            Paragraph(topic, styles["body"]),
            Paragraph(page, styles["body"]),
        ])
    toc_table = Table(toc_data, colWidths=[0.6 * inch, 5.4 * inch, 0.8 * inch])
    style_cmds = [
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        ("GRID", (0, 0), (-1, -1), 0.5, BORDER),
        ("LINEBELOW", (0, 0), (-1, 0), 1, BRASS),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]
    for i in range(2, len(toc_data), 2):
        style_cmds.append(("BACKGROUND", (0, i), (-1, i), ROW_ALT))
    toc_table.setStyle(TableStyle(style_cmds))
    story.append(toc_table)

    story.append(PageBreak())
    return story


def part_header(styles: dict, label: str) -> list:
    """Standard part-heading with brass underline."""
    return [
        Paragraph(label, styles["h1"]),
        HRFlowable(width="100%", thickness=1, color=BRASS),
        Spacer(1, 6),
    ]


def prep_checklist_section(
    styles: dict,
    part_label: str,
    checklist_rows: list[tuple[str, str]],
    resource_rows: list[tuple[str, str, str]],
    final_reminder_html: str,
    footer_text: str,
) -> list:
    """Standard 'Day Before Class' prep section. Returns story flowables."""
    story: list = []
    story.extend(part_header(styles, part_label))

    story.append(Paragraph("Your 20-Minute Prep Routine", styles["h2"]))
    story.append(Paragraph(
        "You will teach this class in two hours. Here's a pre-class routine that fits in 20 minutes and "
        "makes the difference between &quot;nervous&quot; and &quot;ready.&quot;",
        styles["body"]
    ))

    check_data: list[list] = [[
        Paragraph("<b>Step</b>", styles["body_bold"]),
        Paragraph("<b>Notes</b>", styles["body_bold"]),
    ]]
    for step, note in checklist_rows:
        check_data.append([
            Paragraph(step, styles["body"]),
            Paragraph(note, styles["small"]),
        ])
    check_table = Table(check_data, colWidths=[2.8 * inch, 4.0 * inch])
    style_cmds = [
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        ("GRID", (0, 0), (-1, -1), 0.5, BORDER),
        ("LINEBELOW", (0, 0), (-1, 0), 1, BRASS),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]
    for i in range(2, len(check_data), 2):
        style_cmds.append(("BACKGROUND", (0, i), (-1, i), ROW_ALT))
    check_table.setStyle(TableStyle(style_cmds))
    story.append(check_table)

    story.append(Spacer(1, 10))
    story.append(Paragraph("Authoritative Resources &mdash; Bookmark These", styles["h2"]))
    story.append(Paragraph(
        "When a student asks a question you can't answer, don't guess. Go here. Keep these bookmarked in "
        "the classroom browser.",
        styles["body"]
    ))

    resource_data: list[list] = [[
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
    style_cmds = [
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        ("GRID", (0, 0), (-1, -1), 0.5, BORDER),
        ("LINEBELOW", (0, 0), (-1, 0), 1, BRASS),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]
    for i in range(2, len(resource_data), 2):
        style_cmds.append(("BACKGROUND", (0, i), (-1, i), ROW_ALT))
    resource_table.setStyle(TableStyle(style_cmds))
    story.append(resource_table)

    story.append(Spacer(1, 10))
    story.append(callout(
        styles,
        "FINAL REMINDER &mdash; If You Only Remember One Thing",
        final_reminder_html,
        CALLOUT_NUMBERS_BG, CALLOUT_NUMBERS_BORDER,
    ))

    story.append(Spacer(1, 16))
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER))
    story.append(Spacer(1, 4))
    story.append(Paragraph(footer_text, styles["footer"]))
    return story


def build_pdf(output_filename: str, title: str, story: list) -> str:
    """Assemble the document and write it to the Teacher Guides folder."""
    os.makedirs(TEACHER_GUIDES_DIR, exist_ok=True)
    output_path = os.path.join(TEACHER_GUIDES_DIR, output_filename)
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        topMargin=0.55 * inch,
        bottomMargin=0.55 * inch,
        leftMargin=0.7 * inch,
        rightMargin=0.7 * inch,
        title=title,
        author="VUB Financial Readiness Course",
    )
    doc.build(story)
    return output_path
