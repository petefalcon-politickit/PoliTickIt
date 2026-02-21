@echo off
title Omni-OS Ignition
cls
echo [Omni-OS] Initializing Universal Orchestrator...
echo.
:: Run npm link to register the 'omni' command globally
call npm link --quiet > nul 2>&1

if %errorlevel% neq 0 (
    echo [ERROR] Failed to link 'omni' command globally. 
    echo Please ensure Node.js is installed.
    pause
    exit /b %errorlevel%
)

:: Run the hello sequence natively
node bin/omni.js hello
