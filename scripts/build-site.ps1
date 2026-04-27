param(
    [string]$OutputDirectory = "dist\site"
)

$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$siteRoot = Join-Path $root $OutputDirectory

if (Test-Path $siteRoot) {
    Remove-Item -LiteralPath $siteRoot -Recurse -Force
}

New-Item -ItemType Directory -Path $siteRoot -Force | Out-Null

$items = @(
    "index.html",
    "course-description.html",
    "course-description.pdf",
    "syllabus.html",
    "syllabus.pdf",
    "syllabus-one-page.pdf",
    "css",
    "js",
    "templates",
    "weekly-curriculum"
)

foreach ($item in $items) {
    $source = Join-Path $root $item
    if (Test-Path $source) {
        Copy-Item -LiteralPath $source -Destination $siteRoot -Recurse -Force
    }
}

$publicTeachingFolders = @(
    "Assessments",
    "Handouts",
    "Study Resources"
)

foreach ($folderSuffix in $publicTeachingFolders) {
    $source = Get-ChildItem -LiteralPath $root -Directory |
        Where-Object { $_.Name -like "*$folderSuffix" } |
        Select-Object -First 1

    if ($source) {
        Copy-Item -LiteralPath $source.FullName -Destination $siteRoot -Recurse -Force
    }
}

$adminFolder = Get-ChildItem -LiteralPath $root -Directory |
    Where-Object { $_.Name -like "*Admin Paperwork" } |
    Select-Object -First 1

if ($adminFolder) {
    $uploadInstructions = Join-Path $adminFolder.FullName "student-upload-instructions.html"
    if (Test-Path $uploadInstructions) {
        Copy-Item -LiteralPath $uploadInstructions -Destination $siteRoot -Force
    }
}

Get-ChildItem -LiteralPath $siteRoot -Recurse -File |
    Where-Object { $_.Extension -in @(".mp4", ".mp3") } |
    Remove-Item -Force

Write-Host "Built website: $siteRoot"
