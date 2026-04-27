param(
    [string]$OutputDirectory = "dist",
    [switch]$SkipVideos
)

$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$dist = Join-Path $root $OutputDirectory
$packageName = "VUB-Financial-Readiness-Course"
$packageRoot = Join-Path $dist $packageName
$zipPath = Join-Path $dist "$packageName.zip"

if (Test-Path $packageRoot) {
    Remove-Item -LiteralPath $packageRoot -Recurse -Force
}

New-Item -ItemType Directory -Path $packageRoot -Force | Out-Null

$items = @(
    "index.html",
    "START HERE.md",
    "SATELLITE CLASSROOM SETUP.md",
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
        Copy-Item -LiteralPath $source -Destination $packageRoot -Recurse -Force
    }
}

$teachingFolders = @(
    "Admin Paperwork",
    "Assessments",
    "Handouts",
    "Study Resources",
    "Teacher Guides"
)

foreach ($folderSuffix in $teachingFolders) {
    $source = Get-ChildItem -LiteralPath $root -Directory |
        Where-Object { $_.Name -like "*$folderSuffix" } |
        Select-Object -First 1

    if ($source) {
        Copy-Item -LiteralPath $source.FullName -Destination $packageRoot -Recurse -Force
    }
}

if (-not $SkipVideos) {
    $videoOutput = Join-Path $root "videos\output"
    if (Test-Path $videoOutput) {
        $videoDest = Join-Path $packageRoot "videos"
        New-Item -ItemType Directory -Path $videoDest -Force | Out-Null
        Copy-Item -LiteralPath $videoOutput -Destination $videoDest -Recurse -Force
    }
}

if (Test-Path $zipPath) {
    Remove-Item -LiteralPath $zipPath -Force
}

Compress-Archive -Path (Join-Path $packageRoot "*") -DestinationPath $zipPath -Force

Write-Host "Created travel folder: $packageRoot"
Write-Host "Created zip backup:     $zipPath"
