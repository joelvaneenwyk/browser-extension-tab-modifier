@echo off
setlocal
    set "PATH=C:\Program Files\nodejs;%PATH%"
    echo Removing intermediate files...
    call rmdir /s /q "%~dp0.yarn" >nul 2>&1

    echo Installing dependencies...
    set "_npm=C:\Program Files\nodejs\npm.cmd"
    call "%_npm%" install

    echo Installing 'gulp' globally...
    call "%_npm%" install -g gulp

    echo Running 'gulp' build...
    set "_gulp=%APPDATA%\npm\gulp.cmd"
    call "%_gulp%" build

    echo Running 'gulp' tests...
    call "%_gulp%" tests
endlocal & goto:EOF
