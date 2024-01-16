#!/usr/bin/env bash

# Remove now-deprecated 'karma-cli' to avoid conflicts and confusion
npm uninstall -f -g karma-cli karma-jasmine jasmine jasmine-core
npm cache clean -f

npx playwright install --with-deps chromium msedge
