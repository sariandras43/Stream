@echo off
echo --- Docker inditasa ---
docker compose up -d

echo.
echo --- IP cim keresese (Szigoru szuressel) ---

:: JAVITOTT LOGIKA:
:: 1. Get-NetIPConfiguration: Csak az aktiv, gateway-jel rendelkezo adaptereket nezi.
:: 2. (.IPv4Address.IPAddress): Kozvetlenul az adatot olvassuk ki, nem a tablazaot.
:: 3. Select-Object -First 1: Ha tobb kartya van (pl. kabel es wifi), csak az elsot vesszuk.

for /f "usebackq tokens=*" %%a in (`powershell -NoProfile -ExecutionPolicy Bypass -Command "(Get-NetIPConfiguration | Where-Object { $_.IPv4DefaultGateway -ne $null }).IPv4Address.IPAddress | Select-Object -First 1"`) do (
    set MY_IP=%%a
)

:: Hibaellenorzes: Ha meg mindig "PolicyStore" vagy ures lenne
echo Ellenorzes: %MY_IP% | findstr "PolicyStore" >nul
if %errorlevel%==0 (
    echo HIBA: A PowerShell megint rossz adatot adott vissza.
    pause
    exit /b
)

if "%MY_IP%"=="" (
    echo HIBA: Nem sikerult IP cimet talalni.
    pause
    exit /b
)

echo A tiszta IP cimed: %MY_IP%

echo.
echo --- Angular Config frissitese ---

:: 1. Itt add meg a ConfigService.ts PONTOS eleresi utjat!
set ANGULAR_CONFIG_PATH=./frontend/src/app/services/config.service.ts

:: 2. Ez a parancs megkeresi a "baseUrl = '...';" sort es kicsereli az uj IP-re
:: A 'baseUrl = ''.*''' resz a regex, ami megkeresi a regi cimet
powershell -Command "(Get-Content '%ANGULAR_CONFIG_PATH%') -replace 'baseUrl = ''.*''', 'baseUrl = ''http://%MY_IP%:3000''' | Set-Content '%ANGULAR_CONFIG_PATH%'"

echo A ConfigService.ts frissitve erre: http://%MY_IP%:3000

echo.
echo --- Backend es Frontend inditasa ---

:: Backend inditasa (kulon ablakban, hogy ne blokkoljon)
start "Backend Server" cmd /c "cd ./Backend && npm start"

:: Frontend (Angular) inditasa ebben az ablakban
cd ./Frontend
call ng serve --host %MY_IP%