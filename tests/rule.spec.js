import { module } from 'angular';
const { test, expect } = require('@playwright/test');

test.describe('Rule model', function () {
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
});
