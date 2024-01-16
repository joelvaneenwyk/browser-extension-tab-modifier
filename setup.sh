#!/usr/bin/env bash

# Remove now-deprecated 'karma-cli' to avoid conflicts and confusion
npm uninstall -f -g karma-cli karma-jasmine jasmine jasmine-core
npm cache clean -f
npm install -g jasmine-core

npx playwright install --with-deps chromium msedge

# $ rm -rf node_modules
# $ npm cache clean
# $ npm i
#
# $ sudo npm uninstall -g jasmine-core
# $ sudo npm cache clean -f
# $ sudo npm i -g jasmine-core
