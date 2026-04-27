import json
import re
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
ASSESSMENTS = ROOT / "📘 Assessments"


def decode_js_string(value):
    return json.loads(f'"{value}"')


def clean_text(value):
    replacements = {
        "\u2018": "'",
        "\u2019": "'",
        "\u201c": '"',
        "\u201d": '"',
        "\u2014": "--",
        "\u2013": "-",
        "\u00a0": " ",
    }
    for old, new in replacements.items():
        value = value.replace(old, new)
    return value


def extract_questions(html_path):
    html = html_path.read_text(encoding="utf-8")
    question_pattern = re.compile(
        r"\{\s*id:\s*(\d+),\s*category:\s*\"((?:\\.|[^\"])*)\","
        r"\s*question:\s*\"((?:\\.|[^\"])*)\",\s*options:\s*\[(.*?)\],\s*correct:\s*\"([A-D])\"\s*\}",
        re.DOTALL,
    )
    option_pattern = re.compile(
        r"\{\s*letter:\s*\"([A-D])\",\s*text:\s*\"((?:\\.|[^\"])*)\"\s*\}",
        re.DOTALL,
    )

    questions = []
    for match in question_pattern.finditer(html):
        options = []
        for option_match in option_pattern.finditer(match.group(4)):
            options.append(
                {
                    "letter": option_match.group(1),
                    "text": clean_text(decode_js_string(option_match.group(2))),
                }
            )

        questions.append(
            {
                "id": int(match.group(1)),
                "category": clean_text(decode_js_string(match.group(2))),
                "question": clean_text(decode_js_string(match.group(3))),
                "options": options,
                "correct": match.group(5),
            }
        )

    if not questions:
        raise ValueError(f"No questions found in {html_path}")

    return questions


def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#64748b"))
    canvas.drawString(0.55 * inch, 0.35 * inch, "VUB Financial Readiness Course")
    canvas.drawRightString(7.95 * inch, 0.35 * inch, f"Page {doc.page}")
    canvas.restoreState()


def build_student_pdf(output_path, title, subtitle, questions):
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "AssessmentTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=18,
        textColor=colors.HexColor("#1e3a8a"),
        spaceAfter=8,
    )
    subtitle_style = ParagraphStyle(
        "AssessmentSubtitle",
        parent=styles["Normal"],
        fontSize=10,
        textColor=colors.HexColor("#475569"),
        spaceAfter=12,
    )
    question_style = ParagraphStyle(
        "Question",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=13,
        spaceAfter=6,
    )
    option_style = ParagraphStyle(
        "Option",
        parent=styles["Normal"],
        fontSize=9,
        leading=12,
        leftIndent=10,
    )
    small_style = ParagraphStyle(
        "Small",
        parent=styles["Normal"],
        fontSize=9,
        leading=12,
    )

    doc = SimpleDocTemplate(
        str(output_path),
        pagesize=letter,
        rightMargin=0.55 * inch,
        leftMargin=0.55 * inch,
        topMargin=0.55 * inch,
        bottomMargin=0.55 * inch,
    )
    story = [
        Paragraph(title, title_style),
        Paragraph(subtitle, subtitle_style),
        Paragraph("Name: ________________________________  Date: ________________", small_style),
        Spacer(1, 10),
        Paragraph(
            "Circle the best answer for each question. This paper version is for backup or print-based administration.",
            small_style,
        ),
        Spacer(1, 14),
    ]

    for question in questions:
        story.append(
            Paragraph(
                f"{question['id']}. [{question['category']}] {question['question']}",
                question_style,
            )
        )
        for option in question["options"]:
            story.append(Paragraph(f"{option['letter']}.  {option['text']}", option_style))
        story.append(Spacer(1, 8))

    doc.build(story, onFirstPage=footer, onLaterPages=footer)


def build_answer_key(output_path, title, questions):
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "KeyTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=18,
        textColor=colors.HexColor("#1e3a8a"),
        spaceAfter=12,
    )
    body_style = ParagraphStyle("Body", parent=styles["Normal"], fontSize=10, leading=13)

    doc = SimpleDocTemplate(
        str(output_path),
        pagesize=letter,
        rightMargin=0.55 * inch,
        leftMargin=0.55 * inch,
        topMargin=0.55 * inch,
        bottomMargin=0.55 * inch,
    )

    data = [["#", "Category", "Answer"]]
    data.extend([[q["id"], q["category"], q["correct"]] for q in questions])
    table = Table(data, colWidths=[0.45 * inch, 4.8 * inch, 1.0 * inch])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1e3a8a")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#cbd5e1")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
                ("ALIGN", (0, 0), (0, -1), "CENTER"),
                ("ALIGN", (2, 0), (2, -1), "CENTER"),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )

    story = [
        Paragraph(title, title_style),
        Paragraph("Instructor answer key. Do not distribute with student copies.", body_style),
        Spacer(1, 12),
        table,
    ]
    doc.build(story, onFirstPage=footer, onLaterPages=footer)


def main():
    jobs = [
        (
            ASSESSMENTS / "pre-test.html",
            ASSESSMENTS / "pre-test-printable.pdf",
            ASSESSMENTS / "pre-test-answer-key.pdf",
            "Pre-Test Assessment",
            "VUB Financial Readiness Course - Baseline Knowledge Check",
        ),
        (
            ASSESSMENTS / "post-test.html",
            ASSESSMENTS / "post-test-printable.pdf",
            ASSESSMENTS / "post-test-answer-key.pdf",
            "Post-Test Assessment",
            "VUB Financial Readiness Course - Final Knowledge Check",
        ),
    ]

    for html_path, student_pdf, answer_key, title, subtitle in jobs:
        questions = extract_questions(html_path)
        build_student_pdf(student_pdf, title, subtitle, questions)
        build_answer_key(answer_key, f"{title} Answer Key", questions)
        print(f"Wrote {student_pdf.name}")
        print(f"Wrote {answer_key.name}")


if __name__ == "__main__":
    main()
