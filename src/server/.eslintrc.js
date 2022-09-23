module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
    },
    extends: [
        "plugin:prettier/recommended",
        "eslint:recommended"
    ],
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': ['error'],
    },
    globals: {
        _: true,
    },
}