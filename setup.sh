#!/usr/bin/env bash

# Remove now-deprecated 'karma-cli' to avoid conflicts and confusion
npm uninstall -g karma-cli >/dev/null 2>&1

npx playwright install --with-deps chromium msedge
npm install -g jasmine

#
# karma start --browsers WebkitHeadless
#
