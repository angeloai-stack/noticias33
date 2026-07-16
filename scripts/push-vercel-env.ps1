# Sube variables de .env a Vercel (ejecutar en la misma terminal donde hiciste vercel login)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

$keys = @(
  "WP_URL", "WP_USER", "WP_APP_PASSWORD",
  "SUPABASE_URL", "SUPABASE_SERVICE_KEY",
  "ACCESS_CODE", "ADMIN_CODE"
)

if (-not (Test-Path ".env")) { throw "No existe .env" }

$envVars = @{}
Get-Content ".env" | ForEach-Object {
  $line = $_.Trim()
  if (-not $line -or $line.StartsWith("#")) { return }
  $i = $line.IndexOf("=")
  if ($i -lt 1) { return }
  $envVars[$line.Substring(0, $i).Trim()] = $line.Substring($i + 1).Trim()
}

vercel whoami | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Ejecuta primero: vercel login"
  exit 1
}

vercel link --yes
if ($LASTEXITCODE -ne 0) { exit 1 }

foreach ($key in $keys) {
  if (-not $envVars[$key]) {
    Write-Host "Omitido $key"
    continue
  }
  Write-Host "Subiendo $key..."
  foreach ($target in @("production", "preview", "development")) {
    vercel env add $key $target --value $envVars[$key] --yes --force
  }
}

Write-Host "`nListo. Despliega con: vercel --prod"
