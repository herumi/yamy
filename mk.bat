if not exist functions.h cscript //nologo tools\makefunc.js engine.h functions.h
MSBuild proj\yamy.sln /t:Build /p:Configuration=Release /p:Platform=x64
MSBuild proj\yamy.sln /t:Build /p:Configuration=Release /p:Platform=Win32
