module.exports = {
    extends: ['semistandard', 'standard', 'prettier'],
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
    },
    parserOptions: {
        ecmaVersion: 'latest',
    },

    ignorePatterns: [
        '**/*.min.*',
        '.yarn/cache/**/*',
        'dist/**/*',
        'node_modules/**/*',
        'coverage/**/*',
    ],

    // $ npx eslint-config-prettier karma.conf.js
    //-----------------------------------------------------------------------
    // The following rules are unnecessary or might conflict with Prettier:
    //
    // - array-bracket-spacing
    // - brace-style
    // - comma-dangle
    // - comma-style
    // - eol-last
    // - indent
    // - key-spacing
    // - keyword-spacing
    // - no-mixed-spaces-and-tabs
    // - no-multiple-empty-lines
    // - operator-linebreak
    // - quote-props
    // - semi
    // - space-before-blocks
    // - space-before-function-paren
    // - space-in-parens
    // - space-unary-ops
    // - wrap-iife
    //
    // The following rules are enabled but cannot be automatically checked. See:
    // https://github.com/prettier/eslint-config-prettier#special-rules
    //
    // - max-len
    // - quotes
    rules: {
        // "quote-props": [2, "as-needed"],
        'dot-notation': 2,
        // semi: [2, "always"],
        curly: [2, 'all'],
        // "keyword-spacing": [2, {}],
        // "space-before-blocks": [2, "always"],
        // "wrap-iife": 2,
        // "space-before-function-paren": [2, "always"],
        'one-var': [2, 'never'],
        'no-empty': [
            2,
            {
                allowEmptyCatch: true,
            },
        ],
        // "array-bracket-spacing": [2, "always"],
        // "space-in-parens": [2, "never"],
        // "key-spacing": [
        //     2,
        //     {
        //         beforeColon: false,
        //         afterColon: true,
        //     },
        // ],
        // "comma-style": [2, "last"],
        // "operator-linebreak": [2, "after"],
        // "space-unary-ops": [
        //     2,
        //     {
        //         words: false,
        //         nonwords: false,
        //     },
        // ],
        'no-implicit-coercion': [
            2,
            {
                boolean: true,
                string: true,
                number: true,
            },
        ],
        'no-with': 2,
        'no-multi-str': 2,
        // "no-multiple-empty-lines": 2,
        // quotes: [2, "single"],
        // indent: [
        //     2,
        //     4,
        //     {
        //         SwitchCase: 1,
        //     },
        // ],
        // "no-mixed-spaces-and-tabs": 2,
        // "comma-dangle": [2, "never"],
        // "brace-style": [
        //     2,
        //     "1tbs",
        //     {
        //         allowSingleLine: true,
        //     },
        // ],
        // "eol-last": 2,
        // "max-len": [2, 600],
        'consistent-this': [2, 'that'],
        yoda: [2, 'never'],
        'spaced-comment': 0,
    },
};
