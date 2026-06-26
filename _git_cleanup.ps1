$ErrorActionPreference = "Continue"
$root = "C:\Users\Instructor\Dev\curriculum\VUB Lessons"
Set-Location $root
$log = @()

# Step 1: Delete lock file
Remove-Item "$root\.git\index.lock" -Force -ErrorAction SilentlyContinue
$log += "=== STEP 1: Lock file ==="
if (Test-Path "$root\.git\index.lock") { $log += "FAILED: index.lock still exists" } else { $log += "OK: index.lock removed" }

# Step 2: Push existing commits
$log += "`n=== STEP 2: Push 5 unpushed commits ==="
$out = git push origin main 2>&1
$log += $out

# Step 3: Financial Readiness commit
$log += "`n=== STEP 3: Financial Readiness commit ==="
git add "courses/financial-readiness/" 2>&1
$out = git commit -m "feat(financial-readiness): comprehensive course content updates - handouts, study resources, weekly curriculum, styles, and assessment tooling" 2>&1
$log += $out

# Step 4: Computer Skills commit
$log += "`n=== STEP 4: Computer Skills commit ==="
git add "courses/computer-skills/" 2>&1
$out = git commit -m "feat(computer-skills): full 8-week curriculum refresh - presentations, handouts, syllabi, pre/post tests, and slide styles" 2>&1
$log += $out

# Step 5: Digital Literacy commit
$log += "`n=== STEP 5: Digital Literacy commit ==="
git add "courses/digital-literacy-1/" 2>&1
$out = git commit -m "feat(digital-literacy-1): 5-week curriculum updates - assessments, handouts, presentations, study resources, and intro video transcript" 2>&1
$log += $out

# Step 6: Platform/shared + instructors commit
$log += "`n=== STEP 6: Platform/Shared commit ==="
git add "shared/" "assets/" "instructors/" 2>&1
$out = git commit -m "feat(platform): shared shell/brand CSS+JS updates, flag SVG, instructor guides and admin paperwork" 2>&1
$log += $out

# Step 7: Docs/config commit
$log += "`n=== STEP 7: Docs/Config commit ==="
git add ".gitignore" "courses.json" "docs/" "package.json" "package-lock.json" "playwright.config.js" "scripts/" "tests/" 2>&1
$out = git commit -m "chore: update gitignore, package deps, build scripts, playwright config, and test specs" 2>&1
$log += $out

# Step 8: Delete stale artifacts
$log += "`n=== STEP 8: Delete stale artifacts ==="
$artifacts = @(
    "$root\.serve-4173.err",
    "$root\.serve-4173.err.log",
    "$root\.serve-4173.log",
    "$root\.serve-4173.out.log"
)
foreach ($f in $artifacts) {
    if (Test-Path $f) {
        Remove-Item $f -Force
        $log += "Deleted: $f"
    } else { $log += "Not found: $f" }
}
# Delete browser save folder
$saveFolder = Get-ChildItem $root -Directory | Where-Object { $_.Name -like "VUB-Financial-Readiness_*_files" }
if ($saveFolder) {
    Remove-Item $saveFolder.FullName -Recurse -Force
    $log += "Deleted folder: $($saveFolder.Name)"
} else { $log += "Browser save folder not found" }

# Commit deletions
git add -A 2>&1
$out = git commit -m "chore: purge stale .serve-4173 server logs and browser save artifacts" 2>&1
$log += $out

# Step 9: Push everything
$log += "`n=== STEP 9: Final push ==="
$out = git push origin main 2>&1
$log += $out

# Step 10: Final status
$log += "`n=== FINAL STATUS ==="
$out = git log --oneline -15 2>&1
$log += $out
$out = git status --short 2>&1
$log += $out

$log | Out-File "$root\_git_results.txt" -Encoding utf8
Write-Host "Done! See _git_results.txt"
