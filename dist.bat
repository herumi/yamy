@echo off
setlocal
call mk.bat

rem keep VERSION in sync with proj\yamy.props
set VERSION=0.04
set ZIP=yamy-%VERSION%.zip

if exist %ZIP% del %ZIP%

powershell -NoProfile -Command "Compress-Archive -DestinationPath '%ZIP%' -Path .\yamy.ini, .\104.mayu, .\109.mayu, .\default.mayu, .\emacsedit.mayu, .\104on109.mayu, .\109on104.mayu, .\dot.mayu, .\workaround.mayu, .\workaround.reg, .\readme.txt, Release\yamy.exe, Release\yamy32, Release\yamy64, Release\yamy32.dll, Release\yamy64.dll, Release\yamyd32"

if errorlevel 1 (
	echo failed to create %ZIP%
	exit /b 1
)
echo created %ZIP%
