module.exports = {
    root: true,
    env: {
        browser: true,
        es6: true,
        node: true
    },
    ignorePatterns: ['projects/**/*'],
    overrides: [
        {
            files: ['*.ts'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                project: ['tsconfig.json'],
                tsconfigRootDir: __dirname,
                sourceType: 'module'
            },
            plugins: [
                '@angular-eslint',
                '@typescript-eslint'
            ],
            extends: [
                'plugin:@angular-eslint/recommended',
                'plugin:@typescript-eslint/recommended'
            ],
            rules: {
                '@angular-eslint/component-selector': 'off',
                '@angular-eslint/directive-selector': 'off',
                '@angular-eslint/no-host-metadata-property': 'error',
                '@angular-eslint/no-inputs-metadata-property': 'error',
                '@angular-eslint/no-output-rename': 'error',
                '@angular-eslint/no-outputs-metadata-property': 'error',
                '@angular-eslint/use-lifecycle-interface': 'error',
                '@angular-eslint/use-pipe-transform-interface': 'error',

                '@typescript-eslint/consistent-type-definitions': 'error',
                '@typescript-eslint/dot-notation': 'off',
                '@typescript-eslint/explicit-member-accessibility': 'off',
                '@typescript-eslint/no-empty-function': 'off',
                '@typescript-eslint/no-empty-interface': 'error',
                '@typescript-eslint/no-inferrable-types': [
                    'error',
                    { ignoreParameters: true }
                ],
                '@typescript-eslint/prefer-function-type': 'error',
                '@typescript-eslint/unified-signatures': 'error',

                'keyword-spacing': ['error', { after: true, before: true }],
                'space-before-blocks': 'error',
                'brace-style': ['error', '1tbs', { allowSingleLine: true }],
                'object-curly-spacing': ['error', 'always'],
                'curly': 'error',
                'comma-spacing': ['error', { before: false, after: true }],
                'dot-notation': 'off',
                'eol-last': 'error',
                'eqeqeq': ['error', 'smart'],
                'guard-for-in': 'off',
                'id-blacklist': 'off',
                'id-match': 'off',
                'max-len': ['off', { code: 140 }],
                'no-caller': 'error',
                'no-console': [
                    'error',
                    {
                        allow: [
                            'debug', 'info', 'dirxml', 'warn', 'dir', 'time',
                            'timeEnd', 'timeLog', 'trace', 'assert', 'clear',
                            'count', 'countReset', 'group', 'groupCollapsed',
                            'groupEnd', 'table', 'Console', 'markTimeline',
                            'profile', 'profileEnd', 'timeline', 'timelineEnd',
                            'timeStamp', 'context', 'error'
                        ]
                    }
                ],
                'no-debugger': 'error',
                'no-empty': 'off',
                'no-empty-function': 'off',
                'no-eval': 'error',
                'no-fallthrough': 'error',
                'no-new-wrappers': 'error',
                'no-redeclare': 'error',
                'no-restricted-imports': 'error',
                'no-throw-literal': 'error',
                'no-trailing-spaces': 'error',
                'no-underscore-dangle': 'off',
                'no-unused-labels': 'error',
                'prefer-const': ['error', {
                    destructuring: 'any',
                    ignoreReadBeforeAssign: false
                }],
                'prefer-arrow-callback': [
                    'error',
                    { allowUnboundThis: true, allowNamedFunctions: true }
                ],
                'space-before-function-paren': [
                    'error',
                    {
                        anonymous: 'always',
                        named: 'never',
                        asyncArrow: 'always'
                    }
                ],
                'quotes': ['error', 'single'],
                'radix': 'error',
                'semi': 'error',
                'spaced-comment': [
                    'error',
                    'always',
                    { markers: ['/'] }
                ],
                'array-bracket-spacing': [
                    'error',
                    'never',
                    {
                        singleValue: false,
                        objectsInArrays: false,
                        arraysInArrays: false
                    }
                ],
                'no-irregular-whitespace': ['error', { skipComments: true }],
                'no-multi-spaces': 'error',
                'no-var': 'error'
            }
        },
        {
            files: ['*.html'],
            extends: ['plugin:@angular-eslint/template/recommended'],
            rules: {}
        }
    ]
};