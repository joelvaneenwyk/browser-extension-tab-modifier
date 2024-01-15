@echo off
setlocal
    echo Removing intermediate files...
    call rmdir /s /q "%~dp0.yarn" >nul 2>&1

    echo Installing dependencies...
    call npm install

    echo Installing 'gulp' globally...
    call npm install -g gulp

    echo Running 'gulp' build...
    call gulp build

    echo Running 'gulp' tests...
    call gulp test
endlocal & goto:EOF
