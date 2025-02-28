const app = angular.module('TabModifier', [
    'ngRoute',
    'ngAnimate',
    'ngAria',
    'ngMaterial',
    'angular-google-analytics',
    'ui.tree',
]);

app.config([
    '$routeProvider',
    '$compileProvider',
    '$mdIconProvider',
    '$mdThemingProvider',
    'AnalyticsProvider',
    function (
        $routeProvider,
        $compileProvider,
        $mdIconProvider,
        $mdThemingProvider,
        AnalyticsProvider,
    ) {
        // Allow "chrome-extension" protocol
        $compileProvider.aHrefSanitizationWhitelist(
            /^\s*(https?|chrome-extension|file|blob):/,
        );
        $compileProvider.imgSrcSanitizationWhitelist(
            /^\s*(https?|chrome-extension|file|blob):|data:image\//,
        );

        // Load icons list by name
        $mdIconProvider
            .icon('menu', '/icons/menu.svg')
            .icon('backup-restore', '/icons/backup-restore.svg')
            .icon('information-outline', '/icons/information-outline.svg')
            .icon('alert', '/icons/alert.svg')
            .icon('file-add', '/icons/file-add.svg')
            .icon('file-import', '/icons/file-import.svg')
            .icon('file-export', '/icons/file-export.svg')
            .icon('file-outline', '/icons/file-outline.svg')
            .icon('options-vertical', '/icons/dots-vertical.svg')
            .icon('close', '/icons/close.svg')
            .icon('plus', '/icons/plus.svg')
            .icon('image', '/icons/image.svg')
            .icon('save', '/icons/content-save.svg')
            .icon('tab', '/icons/checkbox-multiple-marked-outline.svg')
            .icon('list', '/icons/format-list-bulleted.svg')
            .icon('tab', '/icons/tab.svg')
            .icon('list-plus', '/icons/playlist-plus.svg')
            .icon('clear', '/icons/eraser.svg')
            .icon('settings', '/icons/settings.svg')
            .icon('content-duplicate', '/icons/content-duplicate.svg')
            .icon('delete', '/icons/delete.svg')
            .icon('edit', '/icons/pencil.svg')
            .icon('google-chrome', '/icons/google-chrome.svg')
            .icon('github-circle', '/icons/github-circle.svg')
            .icon('help', '/icons/help-circle.svg')
            .icon('credit-card', '/icons/credit-card.svg')
            .icon('swap-vertical', '/icons/swap-vertical.svg')
            .icon('bell-ring-outline', '/icons/bell-ring-outline.svg');

        // Configure default theme
        $mdThemingProvider
            .theme('default')
            .primaryPalette('blue', {
                default: '600',
            })
            .accentPalette('yellow', {
                default: '700',
            })
            .warnPalette('red', {
                default: 'A700',
            });

        // Analytics config
        AnalyticsProvider.setAccount('UA-27524593-7');
        AnalyticsProvider.setHybridMobileSupport(true);
        AnalyticsProvider.setDomainName('none');

        const routes = {
            '/settings': {
                templateUrl: '/html/settings.html',
                controller: 'SettingsController',
            },
            '/help': {
                templateUrl: '/html/help.html',
                controller: 'HelpController',
            },
            '/:event?/:version?': {
                templateUrl: '/html/tab_rules.html',
                controller: 'TabRulesController',
            },
        };

        for (const path in routes) {
            if (Object.prototype.hasOwnProperty.call(routes, path)) {
                $routeProvider.when(path, routes[path]);
            }
        }
    },
]);

app.run([
    '$rootScope',
    '$location',
    'Analytics',
    function ($rootScope, $location, Analytics) {
        $rootScope.location = $location;
    },
]);

app.controller('HelpController', function () {});

app.controller('MainController', [
    '$scope',
    '$mdSidenav',
    '$q',
    'Analytics',
    function ($scope, $mdSidenav, $q, Analytics) {
        $scope.toggleSideNav = function () {
            $mdSidenav('aside-left').toggle();

            Analytics.trackEvent('sidenav', 'toggle');
        };

        $scope.closeSideNav = function () {
            if ($mdSidenav('aside-left').isOpen() === true) {
                $mdSidenav('aside-left').close();

                Analytics.trackEvent('sidenav', 'close');
            }
        };
    },
]);

app.controller('SettingsController', [
    '$scope',
    '$mdDialog',
    '$mdToast',
    '$location',
    'TabModifier',
    'Analytics',
    function ($scope, $mdDialog, $mdToast, $location, TabModifier, Analytics) {
        const tab_modifier = new TabModifier();

        chrome.storage.local.get('tab_modifier', function (items) {
            if (items.tab_modifier === undefined) {
                tab_modifier.build(new TabModifier());
            } else {
                tab_modifier.build(items.tab_modifier);
            }

            $scope.tab_modifier = tab_modifier;

            // Generate JSON url
            $scope.json_url = tab_modifier.export();

            $scope.$apply();
        });

        // Import tab rules action
        $scope.showImportDialog = function (evt) {
            $mdDialog.show({
                controller: 'SettingsController',
                templateUrl: '../html/import_dialog.html',
                parent: angular.element(document.body),
                targetEvent: evt,
                clickOutsideToClose: true,
            });
        };

        $scope.cancelDialog = function () {
            $mdDialog.cancel();
        };

        // Import tab rules action
        $scope.import = function (content, replace_existing_rules) {
            replace_existing_rules =
                typeof replace_existing_rules !== 'undefined'
                    ? replace_existing_rules
                    : true;
            const result = tab_modifier.checkFileBeforeImport(content);

            if (result === true) {
                const inputId = replace_existing_rules
                    ? 'importReplace'
                    : 'importAdd';
                document.getElementById(inputId).value = '';

                tab_modifier.import(content, replace_existing_rules).sync();

                $mdDialog.hide();

                $location.path('/');

                $mdToast.show(
                    $mdToast
                        .simple()
                        .textContent(
                            'Your tab rules have been successfully imported',
                        )
                        .position('top right'),
                );

                Analytics.trackEvent('tab-rules', 'import-success');
            } else {
                let message;

                switch (result) {
                    case 'INVALID_JSON_FORMAT':
                        message =
                            'Invalid JSON file. Please check it on jsonlint.com.';

                        Analytics.trackEvent('tab-rules', 'import-error-json');
                        break;
                    case 'INVALID_SETTINGS':
                        message =
                            'Invalid settings file. Is this file comes from Tab Modifier?';

                        Analytics.trackEvent(
                            'tab-rules',
                            'import-error-format',
                        );
                        break;
                }
                $mdDialog.hide();
                $mdDialog.show(
                    $mdDialog
                        .alert()
                        .clickOutsideToClose(true)
                        .title('Failed to import tab rules')
                        .textContent(message)
                        .ariaLabel('Failed to import tab rules')
                        .ok('OK, sorry'),
                );
            }
        };

        // Delete all tab rules action
        $scope.deleteRules = function (evt) {
            const confirm = $mdDialog
                .confirm()
                .clickOutsideToClose(false)
                .title('Delete all')
                .textContent(
                    'Do you really want to delete all of your tab rules?',
                )
                .ariaLabel('Delete all')
                .targetEvent(evt)
                .ok('Delete all')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                tab_modifier.deleteRules().sync();

                $mdToast.show(
                    $mdToast
                        .simple()
                        .textContent(
                            'Your tab rules have been successfully deleted',
                        )
                        .position('top right'),
                );

                Analytics.trackEvent('tab-rules', 'delete-all');
            });
        };
    },
]);

app.controller('TabRulesController', [
    '$scope',
    '$routeParams',
    '$http',
    '$mdDialog',
    '$mdMedia',
    '$mdToast',
    'Rule',
    'TabModifier',
    'Analytics',
    function (
        $scope,
        $routeParams,
        $http,
        $mdDialog,
        $mdMedia,
        $mdToast,
        Rule,
        TabModifier,
        Analytics,
    ) {
        const tab_modifier = new TabModifier();
        let icon_list = [];

        // Load icon list
        $http.get('/js/icons.min.json').then(function (request) {
            icon_list = request.data;
        });

        // Avoid BC break
        chrome.storage.sync.get('tab_modifier', function (items) {
            if (
                items.tab_modifier !== undefined &&
                items.tab_modifier !== null
            ) {
                tab_modifier.build(items.tab_modifier);
                tab_modifier.sync();
            }

            chrome.storage.sync.clear();
        });

        // Table options (events)
        $scope.tree_options = {
            dropped: function () {
                tab_modifier.sync();
            },
        };

        chrome.storage.local.get('tab_modifier', function (items) {
            if (items.tab_modifier !== undefined) {
                tab_modifier.build(items.tab_modifier);
            }

            $scope.tab_modifier = tab_modifier;

            $scope.$apply();
        });

        // Show modal form
        $scope.showForm = function (evt, rule) {
            const index =
                rule === undefined ? null : tab_modifier.rules.indexOf(rule);

            $mdDialog
                .show({
                    controller: 'FormModalController',
                    templateUrl: '../html/form.html',
                    targetEvent: evt,
                    clickOutsideToClose: true,
                    fullscreen: $mdMedia('xs'),
                    resolve: {
                        icon_list: function () {
                            return icon_list;
                        },
                        rule: function () {
                            return index === null ? new Rule() : rule;
                        },
                    },
                })
                .then(
                    function (rule) {
                        // Save a rule
                        tab_modifier.save(rule, index);

                        tab_modifier.sync();

                        $mdToast.show(
                            $mdToast
                                .simple()
                                .textContent(
                                    'Your rule has been successfully saved',
                                )
                                .position('top right'),
                        );
                    },
                    function () {
                        Analytics.trackEvent('tab-rules', 'close-form');
                    },
                );
        };

        // Duplicate a rule
        $scope.duplicate = function (rule) {
            tab_modifier.save(new Rule(angular.copy(rule)));

            tab_modifier.sync();

            $mdToast.show(
                $mdToast
                    .simple()
                    .textContent('Your rule has been successfully duplicated')
                    .position('top right'),
            );
        };

        // Delete a rule
        $scope.delete = function (evt, rule) {
            const confirm = $mdDialog
                .confirm()
                .clickOutsideToClose(false)
                .title('Delete rule')
                .textContent('Do you really want to delete this rule?')
                .ariaLabel('Delete rule')
                .targetEvent(evt)
                .ok('Delete')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function () {
                tab_modifier.removeRule(rule);

                tab_modifier.sync();

                $mdToast.show(
                    $mdToast
                        .simple()
                        .textContent('Your rule has been successfully deleted')
                        .position('top right'),
                );
            });
        };

        // Get icon URL for the table
        $scope.getIconUrl = function (icon) {
            if (icon === null) {
                return null;
            }

            return /^(https?|data):/.test(icon) === true
                ? icon
                : chrome.extension.getURL('/img/' + icon);
        };

        // --------------------------------------------------------------------------------------------------------
        // Events

        // New install
        if ($routeParams.event === 'install') {
            const confirm = $mdDialog
                .confirm()
                .clickOutsideToClose(true)
                .title('Greetings')
                .textContent(
                    'Hello, thank you for installing Tab Modifier, start by creating your first rule!',
                )
                .ariaLabel('Greetings')
                .targetEvent()
                .ok('Create my first rule')
                .cancel('Close');

            $mdDialog.show(confirm).then(
                function () {
                    Analytics.trackEvent('greetings-dialog', 'close');

                    $scope.showForm();
                },
                function () {
                    Analytics.trackEvent('greetings-dialog', 'show-form');
                },
            );
        }

        // New version
        if (
            $routeParams.event === 'update' &&
            $routeParams.version !== undefined
        ) {
            $mdToast.show({
                hideDelay: 0,
                position: 'top right',
                controller: 'ToastNewVersionController',
                templateUrl: '../html/toast_new_version.html',
                locals: {
                    version: $routeParams.version,
                },
            });
        }
    },
]);

app.controller('ToastNewVersionController', [
    '$scope',
    '$location',
    '$mdToast',
    'version',
    function ($scope, $location, $mdToast, version) {
        $scope.version = version;

        $scope.closeToast = function () {
            $mdToast.hide().then(function () {
                $location.path('/');
            });
        };

        $scope.openGitHubReleases = function () {
            chrome.tabs.create({
                url: 'https://github.com/sylouuu/chrome-tab-modifier/releases',
            });

            $scope.closeToast();
        };
    },
]);

app.controller('FormModalController', [
    '$scope',
    '$mdDialog',
    'rule',
    'icon_list',
    function ($scope, $mdDialog, rule, icon_list) {
        $scope.rule = rule;
        $scope.icon_list = icon_list;

        $scope.$watch('rule.url_fragment', function () {
            if (rule.url_fragment === '' || rule.url_fragment === undefined) {
                rule.setModel({ url_fragment: null });
            }
        });

        $scope.$watch('rule.tab.title', function () {
            if (rule.tab.title === '' || rule.tab.title === undefined) {
                rule.tab.title = null;
            }
        });

        $scope.$watch('rule.tab.icon', function () {
            if (rule.tab.icon === '' || rule.tab.title === undefined) {
                rule.tab.icon = null;
            }
        });

        $scope.$watch('rule.tab.url_matcher', function () {
            if (
                rule.tab.url_matcher === '' ||
                rule.tab.url_matcher === undefined
            ) {
                rule.tab.url_matcher = null;
            }
        });

        $scope.closeForm = function () {
            $mdDialog.cancel();
        };

        $scope.clearIcon = function () {
            rule.tab.icon = null;
        };

        $scope.save = function (rule) {
            $mdDialog.hide(rule);
        };
    },
]);

app.directive('inputFileButton', function () {
    return {
        restrict: 'E',
        link: function (scope, elem) {
            const button = elem.find('button');
            const input = elem.find('input');

            input.css({ display: 'none' });

            button.bind('click', function () {
                input[0].click();
            });
        },
    };
});

app.directive('onReadFile', [
    '$parse',
    function ($parse) {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, element, attrs) {
                const fn = $parse(attrs.onReadFile);

                element.on('change', function (onChangeEvent) {
                    const reader = new FileReader();

                    reader.onload = function (onLoadEvent) {
                        scope.$apply(function () {
                            fn(scope, {
                                $fileContent: onLoadEvent.target.result,
                            });
                        });
                    };

                    reader.readAsText(
                        (onChangeEvent.srcElement || onChangeEvent.target)
                            .files[0],
                    );
                });
            },
        };
    },
]);

app.factory('Rule', function () {
    class rule {
        constructor(properties) {
            this.name = null;
            this.detection = 'CONTAINS';
            this.url_fragment = null;
            this.tab = {
                title: null,
                icon: null,
                pinned: false,
                protected: false,
                unique: false,
                muted: false,
                title_matcher: null,
                url_matcher: null,
            };

            angular.extend(this, properties);
        }

        setModel(obj) {
            angular.extend(this, obj);
        }
    }

    return rule;
});

/**
 * Tests for web extension.
 */
// @ts-check
/* eslint-disable no-unused-vars */

const { test, expect } = require('@playwright/test');

test.describe('Rule model', function () {
    /*
    test.beforeEach(module('TabModifier'));

    let Rule;

    test.beforeEach(
        test.inject(function (_Rule_) {
            Rule = _Rule_;
        })
    );

    test.it('Create a rule', function () {
        const rule = new Rule();

        expect(rule instanceof Rule).toBe(true);
    });

    test.it('Modify a rule', function () {
        const rule = new Rule();

        rule.setModel({ name: 'Hello' });

        expect(rule.name).toBe('Hello');
    });
    */
});

app.factory('TabModifier', [
    'Rule',
    function (Rule) {
        const tab_modifier = function (properties) {
            this.settings = {
                enable_new_version_notification: false,
            };
            this.rules = [];

            angular.extend(this, properties);
        };

        tab_modifier.prototype.setModel = function (obj) {
            angular.extend(this, obj);
        };

        tab_modifier.prototype.addRule = function (rule) {
            this.rules.push(rule);
        };

        tab_modifier.prototype.removeRule = function (rule) {
            this.rules.splice(this.rules.indexOf(rule), 1);
        };

        tab_modifier.prototype.save = function (rule, index) {
            if (index === null || index === undefined) {
                this.addRule(rule);
            } else {
                this.rules[index] = rule;
            }
        };

        tab_modifier.prototype.build = function (data, replace_existing_rules) {
            replace_existing_rules =
                typeof replace_existing_rules !== 'undefined'
                    ? replace_existing_rules
                    : true;
            const that = this;

            if (data.settings !== undefined) {
                this.settings = data.settings;
            }

            if (replace_existing_rules === true) {
                this.deleteRules();
            }

            angular.forEach(data.rules, function (rule) {
                that.addRule(new Rule(rule));
            });
        };

        tab_modifier.prototype.sync = function () {
            chrome.storage.local.set({ tab_modifier: this });
        };

        tab_modifier.prototype.checkFileBeforeImport = function (json) {
            if (json !== undefined) {
                try {
                    const settings = JSON.parse(json);

                    if ('rules' in settings === false) {
                        return 'INVALID_SETTINGS';
                    }
                } catch (e) {
                    return 'INVALID_JSON_FORMAT';
                }

                return true;
            } else {
                return false;
            }
        };

        tab_modifier.prototype.import = function (json, replace_existing_rules) {
            replace_existing_rules =
                typeof replace_existing_rules !== 'undefined'
                    ? replace_existing_rules
                    : true;

            this.build(JSON.parse(json), replace_existing_rules);

            return this;
        };

        tab_modifier.prototype.export = function () {
            const blob = new Blob([JSON.stringify(this, null, 4)], {
                type: 'text/plain',
            });

            return (window.URL || window.webkitURL).createObjectURL(blob);
        };

        tab_modifier.prototype.deleteRules = function () {
            this.setModel({ rules: [] });

            return this;
        };

        return tab_modifier;
    },
]);

/**
 * Tests for web extension.
 */
// @ts-check
/* eslint-disable no-unused-vars */

// import { angular } from 'angular';
import fixtureTabModifier from '../fixtures/tab_modifier.json';
import fixtureOldSettings from '../fixtures/old_settings.json';
import { test, expect } from '@playwright/test';

test.describe('TabModifier model', () => {
    /*
    let TabModifier;
    test.beforeEach(function () {
        TabModifier = angular.module('TabModifier');
    });

    // test.beforeEach(
    //     test.inject(function (_TabModifier_, _Rule_) {
    //         TabModifier = _TabModifier_;
    //         Rule = _Rule_;
    //     })
    // );

    test('Create a tab modifier', function () {
        const tab_modifier = new TabModifier();

        expect(tab_modifier instanceof TabModifier).toBe(true);
        expect(tab_modifier.settings.enable_new_version_notification).toBe(false);

        // #todo
        // expect(tab_modifier.rules).toBeEmptyArray();
    });

    test('Modify a tab modifier', function () {
        const tab_modifier = new TabModifier();

        tab_modifier.setModel({
            settings: { enable_new_version_notification: true },
        });

        expect(tab_modifier.settings.enable_new_version_notification).toBe(true);
    });

    test.it('Add a rule', function () {
        const tab_modifier = new TabModifier();

        tab_modifier.addRule(new Rule());

        expect(tab_modifier.rules).toBeArrayOfSize(1);
        expect(tab_modifier.rules[0] instanceof Rule).toBe(true);
    });

    test.it('Remove a rule', function () {
        const tab_modifier = new TabModifier();

        tab_modifier.addRule(new Rule());
        tab_modifier.addRule(new Rule());

        expect(tab_modifier.rules).toBeArrayOfSize(2);

        tab_modifier.removeRule(tab_modifier.rules[0]);

        expect(tab_modifier.rules).toBeArrayOfSize(1);
    });

    test.it('Save a rule (create)', function () {
        const tab_modifier = new TabModifier();

        tab_modifier.save(new Rule());

        expect(tab_modifier.rules).toBeArrayOfSize(1);
    });

    test.it('Save a rule (update)', function () {
        const tab_modifier = new TabModifier();

        tab_modifier.save(new Rule());
        tab_modifier.save(new Rule({ name: 'updated rule' }), 0);

        expect(tab_modifier.rules).toBeArrayOfSize(1);
        expect(tab_modifier.rules[0].name).toBe('updated rule');
    });

    test.it('Build rules', function () {
        const tab_modifier = new TabModifier();

        tab_modifier.save(new Rule());

        tab_modifier.build(fixtureTabModifier);

        expect(tab_modifier.rules).toBeArrayOfSize(7);

        expect(tab_modifier.rules[0].name).toBe('Local dev');
        expect(tab_modifier.rules[0].detection).toBe('CONTAINS');
        expect(tab_modifier.rules[0].url_fragment).toBe('.local');
        expect(tab_modifier.rules[0].tab.title).toBe('[DEV] {title}');
        expect(tab_modifier.rules[0].tab.icon).toBe(null);
        expect(tab_modifier.rules[0].tab.pinned).toBe(false);
        expect(tab_modifier.rules[0].tab.protected).toBe(false);
        expect(tab_modifier.rules[0].tab.unique).toBe(false);
        expect(tab_modifier.rules[0].tab.muted).toBe(false);
        expect(tab_modifier.rules[0].tab.url_matcher).toBe(null);

        expect(tab_modifier.rules[1].name).toBe('Production');
        expect(tab_modifier.rules[1].detection).toBe('CONTAINS');
        expect(tab_modifier.rules[1].url_fragment).toBe('domain.com');
        expect(tab_modifier.rules[1].tab.title).toBe('[PROD] {title}');
        expect(tab_modifier.rules[1].tab.icon).toBe(null);
        expect(tab_modifier.rules[1].tab.pinned).toBe(false);
        expect(tab_modifier.rules[1].tab.protected).toBe(false);
        expect(tab_modifier.rules[1].tab.unique).toBe(false);
        expect(tab_modifier.rules[1].tab.muted).toBe(false);
        expect(tab_modifier.rules[1].tab.url_matcher).toBe(null);

        expect(tab_modifier.rules[2].name).toBe('Youtube');
        expect(tab_modifier.rules[2].detection).toBe('CONTAINS');
        expect(tab_modifier.rules[2].url_fragment).toBe('youtube.com');
        expect(tab_modifier.rules[2].tab.title).toBe(null);
        expect(tab_modifier.rules[2].tab.icon).toBe('https://www.google.com/favicon.ico');
        expect(tab_modifier.rules[2].tab.pinned).toBe(true);
        expect(tab_modifier.rules[2].tab.protected).toBe(false);
        expect(tab_modifier.rules[2].tab.unique).toBe(false);
        expect(tab_modifier.rules[2].tab.muted).toBe(false);
        expect(tab_modifier.rules[2].tab.url_matcher).toBe(null);

        expect(tab_modifier.rules[3].name).toBe('Twitter');
        expect(tab_modifier.rules[3].detection).toBe('CONTAINS');
        expect(tab_modifier.rules[3].url_fragment).toBe('twitter.com');
        expect(tab_modifier.rules[3].tab.title).toBe("I'm working hard!");
        expect(tab_modifier.rules[3].tab.icon).toBe('chrome/default.png');
        expect(tab_modifier.rules[3].tab.pinned).toBe(false);
        expect(tab_modifier.rules[3].tab.protected).toBe(true);
        expect(tab_modifier.rules[3].tab.unique).toBe(false);
        expect(tab_modifier.rules[3].tab.muted).toBe(false);
        expect(tab_modifier.rules[3].tab.url_matcher).toBe(null);

        expect(tab_modifier.rules[4].name).toBe('Unique GMail');
        expect(tab_modifier.rules[4].detection).toBe('STARTS');
        expect(tab_modifier.rules[4].url_fragment).toBe('https://mail.google.com');
        expect(tab_modifier.rules[4].tab.title).toBe(null);
        expect(tab_modifier.rules[4].tab.icon).toBe(null);
        expect(tab_modifier.rules[4].tab.pinned).toBe(false);
        expect(tab_modifier.rules[4].tab.protected).toBe(false);
        expect(tab_modifier.rules[4].tab.unique).toBe(true);
        expect(tab_modifier.rules[4].tab.muted).toBe(false);
        expect(tab_modifier.rules[4].tab.url_matcher).toBe(null);

        expect(tab_modifier.rules[5].name).toBe('Pinterest search');
        expect(tab_modifier.rules[5].detection).toBe('CONTAINS');
        expect(tab_modifier.rules[5].url_fragment).toBe('pinterest.com/search');
        expect(tab_modifier.rules[5].tab.title).toBe('$1 | Pinterest');
        expect(tab_modifier.rules[5].tab.icon).toBe(null);
        expect(tab_modifier.rules[5].tab.pinned).toBe(false);
        expect(tab_modifier.rules[5].tab.protected).toBe(false);
        expect(tab_modifier.rules[5].tab.unique).toBe(false);
        expect(tab_modifier.rules[5].tab.muted).toBe(false);
        expect(tab_modifier.rules[5].tab.url_matcher).toBe('q=([^&]+)');

        expect(tab_modifier.rules[6].name).toBe('GitHub');
        expect(tab_modifier.rules[6].detection).toBe('CONTAINS');
        expect(tab_modifier.rules[6].url_fragment).toBe('github.com');
        expect(tab_modifier.rules[6].tab.title).toBe('{title} | $2 by $1');
        expect(tab_modifier.rules[6].tab.icon).toBe(null);
        expect(tab_modifier.rules[6].tab.pinned).toBe(false);
        expect(tab_modifier.rules[6].tab.protected).toBe(false);
        expect(tab_modifier.rules[6].tab.unique).toBe(false);
        expect(tab_modifier.rules[6].tab.muted).toBe(false);
        expect(tab_modifier.rules[6].tab.url_matcher).toBe('github[.]com/([A-Za-z0-9_-]+)/([A-Za-z0-9_-]+)');
    });

    test.it('Sync data', function () {
        test.pending();
    });

    test.it('Check file before import', function () {
        const tab_modifier = new TabModifier();

        expect(tab_modifier.checkFileBeforeImport(JSON.stringify(fixtureOldSettings))).toBe('INVALID_SETTINGS');
        expect(tab_modifier.checkFileBeforeImport(null)).toBe('INVALID_JSON_FORMAT');
        expect(tab_modifier.checkFileBeforeImport(JSON.stringify(fixtureTabModifier))).toBe(true);
        expect(tab_modifier.checkFileBeforeImport()).toBe(false);
    });

    test.it('Export file', function () {
        test.pending();
    });

    test.it('Delete all rules', function () {
        const tab_modifier = new TabModifier();

        tab_modifier.addRule(new Rule());
        tab_modifier.addRule(new Rule());

        expect(tab_modifier.rules).toBeArrayOfSize(2);

        tab_modifier.deleteRules();

        expect(tab_modifier.rules).toBeEmptyArray();
    });
    */
});
