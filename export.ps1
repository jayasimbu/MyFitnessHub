param(
    [string]$SourceFolder = ".",
    [string]$DestinationZip = "myfitness-hub-production.zip"
)

Write-Host "Starting export process..."
$TempFolder = Join-Path -Path $env:TEMP -ChildPath "myfitness-hub-export"

if (Test-Path $TempFolder) {
    Remove-Item -Path $TempFolder -Recurse -Force
}
New-Item -ItemType Directory -Force -Path $TempFolder | Out-Null

$ExcludeList = @(
    "node_modules",
    "dist",
    ".git",
    ".env",
    ".env.local",
    "test-results",
    "playwright-report",
    "*.zip"
)

Write-Host "Copying files to temporary staging area..."
Get-ChildItem -Path $SourceFolder -Exclude $ExcludeList | Copy-Item -Destination $TempFolder -Recurse -Force

Write-Host "Compressing files into $DestinationZip..."
if (Test-Path $DestinationZip) {
    Remove-Item -Path $DestinationZip -Force
}
Compress-Archive -Path "$TempFolder\*" -DestinationPath $DestinationZip -Force

Write-Host "Cleaning up temporary files..."
Remove-Item -Path $TempFolder -Recurse -Force

Write-Host "Export complete! File saved as $DestinationZip"
