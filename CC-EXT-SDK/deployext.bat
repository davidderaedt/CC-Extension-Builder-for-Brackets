@echo off
set dest=%APPDATA%\Adobe\CEPServiceManager4\extensions\%2
XCOPY "%1" %dest% /D /E /C /R /I /K /Y >nul
echo %dest%