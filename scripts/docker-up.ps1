$ErrorActionPreference = "Stop"

Write-Host "Starting docker compose in background..." -ForegroundColor Cyan
docker compose up -d --build

Write-Host ""
Write-Host "Services:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost" -ForegroundColor Green
Write-Host "  Backend:  http://localhost:5000" -ForegroundColor Green
Write-Host ""
Write-Host "Tailing backend logs to capture admin credentials and URLs..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop following logs (containers keep running)." -ForegroundColor Yellow
docker compose logs -f --tail=200 backend

