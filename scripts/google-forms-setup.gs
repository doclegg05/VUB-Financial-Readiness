/**
 * VUB Financial Readiness Course — Google Forms Setup Script
 *
 * Run this ONCE in Google Apps Script (script.google.com) to create:
 *   1. A Drive folder: "VUB Financial Readiness — Tests"
 *   2. A Pre-Test Google Form with all 20 questions
 *   3. A Post-Test Google Form with all 20 questions
 *   4. A linked Google Sheet capturing every submission
 *
 * After running, the script logs four URLs:
 *   - Pre-Test URL          (give to students; paste into submit-tests.html)
 *   - Post-Test URL         (give to students; paste into submit-tests.html)
 *   - Responses Sheet URL   (you check this for grading)
 *   - Drive folder URL      (everything is stored here)
 *
 * HOW TO RUN:
 *   1. Go to script.google.com (signed in as your Google account)
 *   2. New project → paste this entire file in
 *   3. Save (Ctrl-S), name it "VUB Forms Setup"
 *   4. Click Run → "setupVubTests"
 *   5. Approve permissions (one-time, Google asks)
 *   6. View → Logs (or View → Execution log) to see the URLs
 */

var QUESTIONS = [
  {
    id: 1,
    category: "Retirement Income",
    question: "How is military retirement pay calculated under the High-3 system?",
    options: [
      "Average of last 3 years of service × 2%",
      "Average of highest 36 months of basic pay × 2.5% × years of service",
      "Final basic pay × years of service",
      "Total career earnings ÷ years of service"
    ],
    correctIndex: 1
  },
  {
    id: 2,
    category: "Retirement Income",
    question: "At what age must you begin taking Required Minimum Distributions (RMDs) from a traditional TSP or IRA if you were born after 1959?",
    options: ["65", "70½", "73", "75"],
    correctIndex: 3
  },
  {
    id: 3,
    category: "Retirement Income",
    question: "What is the maximum Social Security benefit increase for delaying claiming from Full Retirement Age (67) to age 70?",
    options: ["8% total", "16% total", "24% total", "32% total"],
    correctIndex: 2
  },
  {
    id: 4,
    category: "Retirement Income",
    question: "How does VA disability compensation interact with Social Security benefits?",
    options: [
      "VA disability reduces your Social Security dollar-for-dollar",
      "VA disability is counted as earned income for Social Security",
      "VA disability has no effect on your Social Security benefit",
      "You cannot receive both VA disability and Social Security"
    ],
    correctIndex: 2
  },
  {
    id: 5,
    category: "Disability & Benefits",
    question: "What is a secondary service-connected condition?",
    options: [
      "A condition that developed after you left the military",
      "A new health problem caused or worsened by a condition you’re already service-connected for",
      "A condition that affects your spouse",
      "A condition with a rating below 30%"
    ],
    correctIndex: 1
  },
  {
    id: 6,
    category: "Disability & Benefits",
    question: "What is the key difference between CRDP and CRSC?",
    options: [
      "CRDP is for officers only; CRSC is for enlisted",
      "CRDP is taxable and automatic; CRSC is tax-free and requires a combat-related application",
      "CRDP pays more than CRSC in all cases",
      "There is no difference — they are the same program"
    ],
    correctIndex: 1
  },
  {
    id: 7,
    category: "Disability & Benefits",
    question: "What is a “claim shark”?",
    options: [
      "A VA-accredited attorney who helps with claims",
      "An unaccredited person or company that illegally charges veterans for claims assistance",
      "A type of VA benefits appeal",
      "A nickname for VSO representatives"
    ],
    correctIndex: 1
  },
  {
    id: 8,
    category: "Disability & Benefits",
    question: "What does the VA’s 36-month lookback rule apply to?",
    options: [
      "Military service records",
      "Asset transfers before applying for VA pension",
      "Medical treatment history",
      "Employment records after separation"
    ],
    correctIndex: 1
  },
  {
    id: 9,
    category: "Healthcare",
    question: "What happens if you don’t enroll in Medicare Part B at age 65?",
    options: [
      "Nothing — you can enroll anytime without penalty",
      "You pay a 10% premium surcharge for each year you delayed, permanently",
      "You lose all VA healthcare benefits",
      "Your TRICARE coverage automatically replaces Medicare"
    ],
    correctIndex: 1
  },
  {
    id: 10,
    category: "Healthcare",
    question: "How does TRICARE for Life work with Medicare?",
    options: [
      "TRICARE replaces Medicare entirely",
      "Medicare pays first, TRICARE covers remaining costs as secondary",
      "You must choose one or the other",
      "TRICARE pays first, Medicare covers the rest"
    ],
    correctIndex: 1
  },
  {
    id: 11,
    category: "Healthcare",
    question: "What is Aid & Attendance?",
    options: [
      "A VA program that provides free home modifications",
      "A tax-free VA pension enhancement for veterans who need help with daily living activities",
      "A Medicare supplement for hospital stays",
      "A TRICARE benefit for prescription drugs"
    ],
    correctIndex: 1
  },
  {
    id: 12,
    category: "Healthcare",
    question: "What is the 2026 net worth limit for VA pension eligibility?",
    options: ["$50,000", "$100,000", "$163,699", "$250,000"],
    correctIndex: 2
  },
  {
    id: 13,
    category: "Income & Taxes",
    question: "Which of these retirement income sources is completely tax-free?",
    options: [
      "Military retired pay",
      "Social Security benefits",
      "VA disability compensation",
      "TSP withdrawals"
    ],
    correctIndex: 2
  },
  {
    id: 14,
    category: "Income & Taxes",
    question: "What is the penalty for missing a Required Minimum Distribution?",
    options: [
      "10% of the missed amount",
      "25% of the missed amount",
      "50% of the missed amount",
      "No penalty — it’s just a guideline"
    ],
    correctIndex: 1
  },
  {
    id: 15,
    category: "Income & Taxes",
    question: "Which states have NO state income tax?",
    options: [
      "California, New York, Illinois",
      "Texas, Florida, Nevada",
      "Virginia, Maryland, Ohio",
      "All states tax retirement income equally"
    ],
    correctIndex: 1
  },
  {
    id: 16,
    category: "Income & Taxes",
    question: "What percentage of retirement-age Americans carry non-mortgage debt?",
    options: ["About 25%", "About 50%", "About 75%", "About 97%"],
    correctIndex: 3
  },
  {
    id: 17,
    category: "Legacy & Protection",
    question: "What does the Survivor Benefit Plan (SBP) provide?",
    options: [
      "A one-time lump sum payment to your spouse",
      "Up to 55% of your selected base amount as a guaranteed monthly payment for your spouse’s lifetime",
      "Free healthcare for your surviving spouse",
      "A government life insurance policy"
    ],
    correctIndex: 1
  },
  {
    id: 18,
    category: "Legacy & Protection",
    question: "What happened to the SBP-DIC offset in January 2023?",
    options: [
      "It was increased to a larger offset",
      "It was fully eliminated — surviving spouses now receive both SBP and DIC in full",
      "It was renamed but stayed the same",
      "Nothing changed — the offset is still in effect"
    ],
    correctIndex: 1
  },
  {
    id: 19,
    category: "Legacy & Protection",
    question: "Which document ensures someone can manage your finances if you become incapacitated?",
    options: [
      "Last Will & Testament",
      "Advance Directive",
      "Durable Power of Attorney",
      "Beneficiary Designation Form"
    ],
    correctIndex: 2
  },
  {
    id: 20,
    category: "Legacy & Protection",
    question: "What is a “trusted contact person” at a financial institution?",
    options: [
      "Your bank account co-signer",
      "Someone the institution can contact if they suspect financial exploitation",
      "The person who inherits your accounts",
      "Your financial advisor"
    ],
    correctIndex: 1
  }
];

/**
 * Main entry point. Creates the Drive folder, Pre-Test, and Post-Test.
 * Run this once. Logs URLs to the Apps Script execution log.
 */
function setupVubTests() {
  var folder = withRetry_("getOrCreateFolder", function () {
    return getOrCreateFolder_("VUB Financial Readiness - Tests");
  });

  var preForm = createTestForm_({
    title: "VUB Financial Readiness — Pre-Test",
    description:
      "Welcome to the VUB Financial Readiness course. " +
      "This 20-question pre-test helps us see what you already know — your answers are not graded against you, " +
      "and your honest baseline helps us measure how much you learn over the five weeks. Take your time.",
    folder: folder,
    isQuiz: true
  });

  var postForm = createTestForm_({
    title: "VUB Financial Readiness — Post-Test",
    description:
      "You’ve completed the five modules of the VUB Financial Readiness course. " +
      "This 20-question post-test mirrors the pre-test so we can measure your progress. Take your time and " +
      "answer with what you know now.",
    folder: folder,
    isQuiz: true
  });

  Logger.log("\n=== VUB Forms Setup Complete ===");
  Logger.log("Drive folder:       %s", folder.getUrl());
  Logger.log("Pre-Test (student): %s", preForm.getPublishedUrl());
  Logger.log("Pre-Test (edit):    %s", preForm.getEditUrl());
  Logger.log("Post-Test (student): %s", postForm.getPublishedUrl());
  Logger.log("Post-Test (edit):    %s", postForm.getEditUrl());
  Logger.log("");
  Logger.log("Next steps:");
  Logger.log("  1. Open both 'student' URLs to verify they look right.");
  Logger.log("  2. In each Form, click 'Responses' → the green Sheets icon to create a linked Sheet.");
  Logger.log("  3. Paste the two student URLs into submit-tests.html (replace PRE_TEST_URL_HERE / POST_TEST_URL_HERE).");
}

/**
 * Find or create the folder by name. Returns a Folder.
 */
function getOrCreateFolder_(name) {
  var existing = DriveApp.getFoldersByName(name);
  if (existing.hasNext()) {
    return existing.next();
  }
  return DriveApp.createFolder(name);
}

/**
 * Retry helper for transient Google service errors ("Service error: Drive",
 * etc.). Retries up to 3 times with exponential backoff.
 */
function withRetry_(label, fn) {
  var attempt = 0;
  var maxAttempts = 3;
  var lastErr = null;
  while (attempt < maxAttempts) {
    try {
      return fn();
    } catch (err) {
      lastErr = err;
      attempt++;
      Logger.log("[%s] attempt %s failed: %s", label, attempt, err && err.message ? err.message : err);
      if (attempt < maxAttempts) {
        Utilities.sleep(1500 * attempt); // 1.5s, then 3s
      }
    }
  }
  throw lastErr;
}

/**
 * Create one test Form with all 20 questions, then move it into the folder.
 * Returns the Form object.
 */
function createTestForm_(opts) {
  var form = FormApp.create(opts.title);
  form.setDescription(opts.description);
  form.setCollectEmail(false);
  form.setIsQuiz(opts.isQuiz);
  form.setShowLinkToRespondAgain(false);
  form.setProgressBar(true);
  form.setConfirmationMessage(
    "Thank you. Your answers have been recorded. Hand the keyboard back to your instructor when ready."
  );

  // Name field (so the instructor can identify each submission)
  form.addTextItem()
    .setTitle("Your full name")
    .setHelpText("First and last name. This is how your instructor identifies your submission.")
    .setRequired(true);

  // Add all 20 questions
  for (var i = 0; i < QUESTIONS.length; i++) {
    var q = QUESTIONS[i];
    var item = form.addMultipleChoiceItem();
    item.setTitle("Q" + q.id + ". [" + q.category + "] " + q.question);
    item.setRequired(true);

    var choices = [];
    for (var j = 0; j < q.options.length; j++) {
      var letter = String.fromCharCode(65 + j); // A, B, C, D
      var label = letter + ". " + q.options[j];
      var isCorrect = (j === q.correctIndex);
      choices.push(item.createChoice(label, isCorrect));
    }
    item.setChoices(choices);
    item.setPoints(1);
  }

  // Move into the target folder (wrapped in retry — first Drive op of a
  // fresh project occasionally throws "Service error: Drive")
  withRetry_("moveFormToFolder", function () {
    var file = DriveApp.getFileById(form.getId());
    var rootFolders = file.getParents();
    while (rootFolders.hasNext()) {
      rootFolders.next().removeFile(file);
    }
    opts.folder.addFile(file);
  });

  return form;
}
