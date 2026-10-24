[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [string]$Command = 'h',
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Rest
)

$projectRoot = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$script:uqExit = 0

function Invoke-Uq {
    param([string]$Exe, [string[]]$Arguments, [string]$Label)
    Write-Host "> $Label" -ForegroundColor DarkGray
    Push-Location $projectRoot
    try {
        & $Exe @Arguments
        $code = $LASTEXITCODE
    }
    finally {
        Pop-Location
    }
    if ($code -ne 0) { $script:uqExit = $code }
}

function Write-UqHelp {
    Write-Host 'uq: lint, format, comments, dedup, check' -ForegroundColor Cyan
    Write-Host ''
    Write-Host '  uq lint [paths...]   ESLint' -ForegroundColor Gray
    Write-Host '  uq fix  [paths...]   ESLint --fix + prettier' -ForegroundColor Gray
    Write-Host '  uq cm [args]         Comment audit' -ForegroundColor Gray
    Write-Host '  uq cf                Rewrite comments' -ForegroundColor Gray
    Write-Host '  uq dedup             Dedup check' -ForegroundColor Gray
    Write-Host '  uq check             Everything' -ForegroundColor Gray
}

switch ($Command) {
    'h' { Write-UqHelp; exit 0 }
    'help' { Write-UqHelp; exit 0 }
    'lint' {
        if ($Rest -and $Rest.Count -gt 0) {
            Invoke-Uq 'npx' (@('eslint') + $Rest) "eslint $($Rest -join ' ')"
        } else {
            Invoke-Uq 'npx' @('eslint', '.') 'eslint .'
        }
    }
    'fix' {
        if ($Rest -and $Rest.Count -gt 0) {
            Invoke-Uq 'npx' (@('eslint', '--fix') + $Rest) "eslint --fix $($Rest -join ' ')"
        } else {
            Invoke-Uq 'npx' @('eslint', '--fix', '.') 'eslint --fix .'
            Invoke-Uq 'npm' @('run', 'format:css') 'prettier css'
        }
    }
    'cm' {
        Invoke-Uq 'npm' @('run', 'comments') 'comments'
    }
    'cf' { Invoke-Uq 'npm' @('run', 'comments:format') 'comments:format' }
    'dedup' { Invoke-Uq 'npm' @('run', 'dedup') 'dedup' }
    'check' { Invoke-Uq 'npm' @('run', 'check') 'npm run check' }
    default {
        Write-Host "Unknown command: $Command" -ForegroundColor Red
        Write-UqHelp
        exit 1
    }
}

exit $script:uqExit
