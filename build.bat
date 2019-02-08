@ECHO OFF
ECHO TabularRasa Build Tool

SET MODE=%1
SET TARGET=%2

2>NUL CALL :CASE_%1                 # jump to case
IF ERRORLEVEL 1 CALL :DEFAULT_CASE  # invalid mode
exit /B


:CASE_compile
  ECHO Compile: %TARGET% ...
  sass -s compressed main.scss style.css
  GOTO END_CASE
:CASE_devel
  ECHO Dev Loop: %TARGET% ...
  sass --watch main.scss style.css
  GOTO END_CASE
:CASE_help
  ECHO Help:
  ECHO compile  compiles and compresses scss to css
  ECHO devel    watches scss files and recompiles on demand
  ECHO help     show this help
  GOTO END_CASE
:DEFAULT_CASE
  ECHO ERROR: Unknown mode
  GOTO CASE_help
:END_CASE
  VER > NUL # reset ERRORLEVEL
  GOTO :EOF # return from CALL