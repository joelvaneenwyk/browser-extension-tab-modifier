@echo off
rmdir /s /q "%~dp0.yarn/cache" >nul 2>&1
rmdir /s /q "%~dp0.yarn/unplugged" >nul 2>&1
rmdir /s /q "%~dp0node_modules" >nul 2>&1
rmdir /s /q "%~dp0dist" >nul 2>&1
yarn install
