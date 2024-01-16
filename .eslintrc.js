/**
 * ESLint configuration file for web extensions.
 */

/** @type {import('eslint').Linter.StringSeverity} */
const OFF = 'off';

/** @type {import('eslint').Linter.StringSeverity} */
const WARN = 'warn'; // eslint-disable-line no-unused-vars

/** @type {import('eslint').Linter.StringSeverity} */
const ERROR = 'error';

/** @type {import('eslint').Linter.Config} */
module.exports = {
    extends: ['semistandard', 'standard', 'prettier'],
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        webextensions: true,
    },
    parserOptions: {
        ecmaVersion: 'latest',
    },

    globals: {
        chrome: true,
        angular: true,
        app: true,
    },

    ignorePatterns: [
        '**/*.min.*',
        '.yarn/cache/**/*',
        'dist/**/*',
        'node_modules/**/*',
        'coverage/**/*',
    ],

    rules: {
        'dot-notation': ERROR,
        'curly': [ERROR, 'all'],
        'one-var': [ERROR, 'never'],
        'no-var': ERROR,
        'no-empty': [
            ERROR,
            {
                allowEmptyCatch: true,
            },
        ],
        'no-implicit-coercion': [
            ERROR,
            {
                boolean: true,
                string: true,
                number: true,
            },
        ],
        'no-with': ERROR,
        'no-multi-str': ERROR,
        'camelcase': OFF,
        'consistent-this': [ERROR, 'that'],
        'yoda': [ERROR, 'never'],
        'spaced-comment': OFF,

        //
        // $ npx eslint-config-prettier "src/js/background.js"
        //
        //-----------------------------------------------------------------------
        // The following rules are unnecessary or might conflict with Prettier:
        //
        // 'quote-props': [ERROR, 'as-needed'],
        // 'semi': [ERROR, 'always'],
        // 'keyword-spacing': [ERROR, {}],
        // 'space-before-blocks': [ERROR, 'always'],
        // 'wrap-iife': ERROR,
        // 'space-before-function-paren': [ERROR, 'always'],
        // 'array-bracket-spacing': [ERROR, 'always'],
        // 'space-in-parens': [ERROR, 'never'],
        // 'key-spacing': [
        //     ERROR,
        //     {
        //         beforeColon: false,
        //         afterColon: true,
        //     },
        // ],
        // 'comma-style': [ERROR, 'last'],
        // 'operator-linebreak': [ERROR, 'after'],
        // 'space-unary-ops': [
        //     ERROR,
        //     {
        //         words: false,
        //         nonwords: false,
        //     },
        // ],
        // 'no-multiple-empty-lines': ERROR,
        // 'indent': [
        //     ERROR,
        //     4,
        //     {
        //         SwitchCase: WARN,
        //     },
        // ],
        // 'no-mixed-spaces-and-tabs': ERROR,
        // 'comma-dangle': [ERROR, 'never'],
        // 'brace-style': [
        //     ERROR,
        //     '1tbs',
        //     {
        //         allowSingleLine: true,
        //     },
        // ],
        // 'eol-last': ERROR,
        //
        // The following rules are enabled but cannot be automatically checked. See:
        //
        // https://github.com/prettier/eslint-config-prettier#special-rules
        //
        // 'max-len': [ERROR, 600],
        // 'quotes': [ERROR, 'single'],
    },
};
