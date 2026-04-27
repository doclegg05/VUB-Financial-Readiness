# Google Forms Submission Setup

A one-time setup that creates two Google Forms (Pre-Test and Post-Test), a Drive folder
to hold them, and a linked Sheet that captures every student submission.

After this setup, students click a button on `submit-tests.html`, fill out the Form,
and their answers land in your Google Sheet automatically — no email, no downloads,
no paper.

## What gets created

When you run the setup script in Google Apps Script, you get:

1. **Drive folder:** `VUB Financial Readiness — Tests`
2. **Pre-Test Form** — 20 questions, identical to the existing HTML pre-test
3. **Post-Test Form** — 20 questions, identical to the existing HTML post-test
4. **Per-Form linked Sheet** — automatically populated when students submit

The original `pre-test.html` and `post-test.html` files are untouched — they still
work as the in-class study version.

## Step 1 — Run the Apps Script

1. Open <https://script.google.com/> (signed in as the Google account that should
   own the Forms and the response Sheet).
2. Click **New project**.
3. Delete the placeholder code and paste the entire contents of
   `scripts/google-forms-setup.gs` from this repo.
4. Save the project (Ctrl-S). Name it something like **"VUB Forms Setup"**.
5. In the toolbar dropdown that says *Function*, choose **`setupVubTests`**.
6. Click **Run**. Google will ask you to authorize the script — review and approve.
   (You may see a "this app isn't verified" warning — click **Advanced** → **Go to
   VUB Forms Setup (unsafe)**. The script is yours; it's just not Google-reviewed.)
7. After it finishes (about 10–20 seconds), click **View → Logs** (or **Execution log**).

You'll see four URLs logged. Copy them somewhere safe.

```
Pre-Test (student): https://docs.google.com/forms/d/e/.../viewform
Post-Test (student): https://docs.google.com/forms/d/e/.../viewform
Pre-Test (edit):    https://docs.google.com/forms/d/.../edit
Post-Test (edit):   https://docs.google.com/forms/d/.../edit
Drive folder:       https://drive.google.com/drive/folders/...
```

## Step 2 — Link each Form to a response Sheet

Apps Script creates the Forms but leaves you to choose where responses are saved.
Do this once per Form:

1. Open the **edit URL** for the Pre-Test (logged in step 1).
2. Click the **Responses** tab at the top.
3. Click the green **Sheets icon** ("Link to Sheets").
4. Choose **Create a new spreadsheet** → name it `VUB Pre-Test Responses` → **Create**.
5. Repeat for the Post-Test (`VUB Post-Test Responses`).

Both Sheets land in your Drive folder. Every student submission becomes a new row.

## Step 3 — Paste the URLs into `submit-tests.html`

1. Open `📘 Assessments/submit-tests.html` in any text editor.
2. Find the placeholder **`PRE_TEST_URL_HERE`** and replace it with the Pre-Test
   *student* URL from step 1.
3. Find **`POST_TEST_URL_HERE`** and replace it with the Post-Test *student* URL.
4. Save the file.

The orange "Setup needed" banner at the top of `submit-tests.html` will disappear
once both URLs are in place.

## Step 4 — Test it

1. Open `📘 Assessments/submit-tests.html` in a browser.
2. Click **Open Pre-Test**, fill in a fake name and answers, submit.
3. Open the Pre-Test response Sheet — your test row should be there.
4. Repeat for the Post-Test.

If you see the response in the Sheet, you're done. Delete the test row when ready
to use it in class.

## Step 5 — (Optional) Wire it into the course site

Once tested, you can replace the existing **Take Pre-Test / Take Post-Test** buttons
on the main course page (`index.html`) so they point to `submit-tests.html` instead
of the original HTML quizzes.

The current links to update:

- `index.html` line 56 — `Take Pre-Test`
- `index.html` line 1372 — `Take Post-Test`

(I left those alone for now so we can test the Forms version first without changing
your live entry points.)

## Grading

In each response Sheet, every row contains:

- Submission timestamp
- Student's full name
- Each answer (A/B/C/D)

Apps Script also enables **Quiz mode** on the Forms, which means Google will tell
you the score automatically. Open the Pre-Test edit URL → **Responses** tab →
**Question** or **Individual** view, and you'll see scores per student plus a
per-question breakdown. The Sheet is the better view for export/grading; the Form
itself is the better view for "how did the class do on Q14?".

## If you need to change a question

1. Open the Form's **edit URL**.
2. Edit the question or options directly. Save.
3. The Apps Script is only for initial setup — don't re-run it after edits, or
   you'll create duplicate Forms.

## If something goes wrong

- **"App isn't verified" warning:** Normal. Click Advanced → Go to project. The
  script only touches your Drive and Forms.
- **No URLs in the log:** Make sure you ran `setupVubTests` (not a different
  function). Check **View → Execution log** if View → Logs is empty.
- **Setup needed banner won't go away:** You probably saved the wrong URL into
  `submit-tests.html`. Make sure both placeholders are replaced and the URLs
  are the **student** (`/viewform`) ones, not the **edit** (`/edit`) ones.
- **Need to start over:** Delete the `VUB Financial Readiness — Tests` folder
  in Drive, then re-run `setupVubTests`.
