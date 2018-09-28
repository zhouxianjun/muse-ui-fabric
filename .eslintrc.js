module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/essential',
        '@vue/standard'
    ],
    globals: {
        fabric: true
    },
    rules: {
        indent: [
            'error',
            4,
            {
                SwitchCase: 1
            }
        ],
        quotes: [
            'error',
            'single'
        ],
        semi: [
            'error',
            'always'
        ],
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-empty': 2,
        'no-eq-null': 2,
        'no-new': 2,
        'no-fallthrough': 2,
        'no-unreachable': 2,
        'no-var': 2,
        'no-return-assign': 0,
        'vue/attribute-hyphenation': [
            'error',
            'always'
        ],
        'vue/html-indent': [
            'error',
            4
        ],
        'vue/require-prop-types': 'error',
        'vue/order-in-components': 'error',
        'vue/no-parsing-error': [
            2,
            {
                'x-invalid-end-tag': false
            }
        ],
        'vue/html-quotes': [
            'error',
            'double'
        ]
    },
    parserOptions: {
        parser: 'babel-eslint'
    }
};
