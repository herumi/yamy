@echo off
setlocal

rem VERSION は proj\yamy.props の <VERSION> から取得する (引数で上書き可)
set "VERSION=%~1"
if "%VERSION%"=="" (
	for /f tokens^=2^ delims^=^" %%v in ('findstr /c:"<VERSION>" proj\yamy.props') do set "VERSION=%%v"
)
if "%VERSION%"=="" (
	echo failed to get VERSION from proj\yamy.props
	exit /b 1
)

set "ZIP=yamy-%VERSION%.zip"

call mk.bat

if exist "%ZIP%" del "%ZIP%"

powershell -NoProfile -Command "Compress-Archive -DestinationPath '%ZIP%' -Path .\yamy.ini, .\104.mayu, .\109.mayu, .\default.mayu, .\emacsedit.mayu, .\104on109.mayu, .\109on104.mayu, .\dot.mayu, .\workaround.mayu, .\workaround.reg, .\readme.txt, Release\yamy.exe, Release\yamy32, Release\yamy64, Release\yamy32.dll, Release\yamy64.dll, Release\yamyd32"

if errorlevel 1 (
	echo failed to create %ZIP%
	exit /b 1
)
echo created %ZIP%
