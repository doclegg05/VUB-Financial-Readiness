# Assessment And Reporting Flowchart

## Purpose

This document explains the two assessment/reporting paths used in the VUB course work. The important decision is whether the report needs to serve an individual student immediately or support centralized program reporting across multiple areas.

## Model A: Custom HTML Assessment And Individual PDF Report

Best for: individual student feedback in a classroom.

```text
Student opens HTML assessment
        |
        v
Student answers 20 questions in browser
        |
        v
JavaScript scores answers immediately
        |
        v
Score is broken down by category
        |
        v
Pre-test score can be saved in browser localStorage
        |
        v
Post-test can compare against saved pre-test score
        |
        v
Student or instructor clicks Print Report
        |
        v
Browser creates printable / save-as-PDF report
```

### Strengths

- Works offline.
- Gives an immediate individual report.
- Does not require a Google login.
- Good for student-facing feedback and celebration.

### Limits

- Results stay on that computer unless printed or saved.
- Browser storage depends on the same machine and browser.
- Not ideal for statewide reporting by itself.
- Harder to aggregate across locations.

## Model B: Google Forms, Google Sheets, And Central Reporting

Best for: statewide, site-level, cohort-level, or program-level reporting.

```text
Student opens Google Form
        |
        v
Student submits pre-test or post-test
        |
        v
Google Form records submission
        |
        v
Google Sheet stores each response as a row
        |
        v
Sheet calculates score and category results
        |
        v
Summary tab groups by site, cohort, instructor, or date
        |
        v
Dashboard or PDF export shows program results
```

### Strengths

- Centralized data.
- Easier to compare sites or cohorts.
- Easier to export and share.
- Better for leadership reports and grant documentation.
- Easier to preserve historical data.

### Limits

- Requires internet access during assessment.
- Requires Google ownership and permissions management.
- Needs consistent student identifiers.
- Needs privacy decisions before collecting personal information.

## Recommended Choice For Alison

Use Google Forms and Sheets as the source of truth for any statewide reporting.

Keep custom PDF-style reports as an optional student-facing layer.

## Recommended Statewide Reporting Flow

```text
1. Build one pre-test Form and one post-test Form
2. Ask for student name, site, cohort, instructor, and date
3. Use the same categories on both tests
4. Link both Forms to Google Sheets
5. Create a summary tab that compares pre-test to post-test
6. Filter results by site, cohort, or instructor
7. Export summary charts as PDF when needed
```

## Data Fields To Include

| Field | Why It Matters |
|---|---|
| Student name or ID | Matches pre-test to post-test |
| Class location | Enables site-level reporting |
| Instructor | Enables instructor or cohort review |
| Cohort/date | Separates one class group from another |
| Question responses | Supports scoring and item analysis |
| Category | Shows where students improved |
| Pre-test score | Baseline |
| Post-test score | End result |
| Improvement | Main outcome measure |

## Meeting Talking Point

"If the goal is to hand a student a report at the end of class, the custom HTML report works well. If the goal is to compare results across the state, Google Forms and Sheets should be the source of truth."

