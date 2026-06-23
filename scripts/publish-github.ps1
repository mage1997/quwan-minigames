$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

function Invoke-Gh {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Args)
    $prev = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    & gh @Args
    $code = $LASTEXITCODE
    $ErrorActionPreference = $prev
    return $code
}

function Get-GitHubToken {
    $env:GIT_TERMINAL_PROMPT = '0'
    $inputText = "protocol=https`nhost=github.com`n"
    $output = $inputText | & git -c credential.helper=manager credential fill 2>$null
    if (-not $output) { throw 'GitHub credentials not found.' }
    foreach ($line in ($output -split "`n")) {
        if ($line -like 'password=*') {
            return $line.Substring(9)
        }
    }
    throw 'GitHub token missing.'
}

$token = Get-GitHubToken
$env:GH_TOKEN = $token
gh auth setup-git 2>$null

$repo = 'mage1997/quwan-minigames'
$repoUrl = "https://github.com/$repo.git"

Write-Host '>> Creating GitHub repository if needed...'
$viewCode = Invoke-Gh repo view $repo
if ($viewCode -ne 0) {
    Invoke-Gh repo create $repo --public --description 'Quwan mini games hub' | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'Failed to create GitHub repository.' }
}

git remote remove origin 2>$null
git remote add origin $repoUrl

Write-Host '>> Pushing code...'
$env:GIT_TERMINAL_PROMPT = '0'
git -c credential.helper=manager push -u origin main --force
if ($LASTEXITCODE -ne 0) { throw 'Git push failed.' }

Write-Host '>> Waiting for GitHub Actions build (3-8 min)...'
Start-Sleep -Seconds 12

$runId = $null
for ($i = 0; $i -lt 40; $i++) {
    $runs = gh run list --repo $repo --workflow=build-android.yml --limit 1 --json databaseId,status,conclusion
    $run = ($runs | ConvertFrom-Json)[0]
    if ($run) {
        $runId = $run.databaseId
        if ($run.status -eq 'completed') { break }
        if ($run.status -eq 'in_progress' -or $run.status -eq 'queued') { break }
    }
    Start-Sleep -Seconds 5
}

if (-not $runId) {
    gh workflow run build-android.yml --repo $repo
    Start-Sleep -Seconds 15
    $runs = gh run list --repo $repo --workflow=build-android.yml --limit 1 --json databaseId
    $runId = (($runs | ConvertFrom-Json)[0]).databaseId
}

gh run watch $runId --repo $repo --exit-status
if ($LASTEXITCODE -ne 0) { throw 'GitHub Actions build failed.' }

$outDir = Join-Path $root 'release'
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
gh run download $runId --repo $repo --name quwan-debug-apk --dir $outDir
if ($LASTEXITCODE -ne 0) { throw 'APK artifact download failed.' }

Write-Host ''
Write-Host 'SUCCESS: APK downloaded to release/quwan-debug-apk/'
Write-Host 'Unzip and install app-debug.apk on your phone.'
