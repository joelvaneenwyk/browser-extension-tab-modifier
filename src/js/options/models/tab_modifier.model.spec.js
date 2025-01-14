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
