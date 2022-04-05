// Based on https://dev.to/robertcoopercode/using-eslint-and-prettier-in-a-typescript-project-53jb

module.exports = {
	parser: '@typescript-eslint/parser',
	extends: ['plugin:@typescript-eslint/recommended', 'plugin:react/recommended', 'plugin:react/jsx-runtime'],
	plugins: ['react', 'react-hooks', '@typescript-eslint'],
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
	},
	rules: {
		'@typescript-eslint/array-type': 'off',
		'@typescript-eslint/ban-ts-ignore': 'off',
		'@typescript-eslint/ban-types': 'off',
		'@typescript-eslint/camelcase': 'off',
		'@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-member-accessibility': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-empty-interface': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-inferrable-types': 'off',
		'@typescript-eslint/no-namespace': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-object-literal-type-assertion': 'off',
		'@typescript-eslint/no-parameter-properties': 'off',
		'@typescript-eslint/no-this-alias': 'off',
		'@typescript-eslint/no-unused-vars': 'off',
		'@typescript-eslint/no-use-before-define': 'off',
		'@typescript-eslint/prefer-interface': 'off',

		'prefer-const': 'off',
		'react/display-name': 'off',
		'react/jsx-key': ['error', {'checkFragmentShorthand': true }],
		'react/no-children-prop': 'off',
		'react/no-render-return-value': 'off',
		'react/prop-types': 'off',
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'error',

		'array-bracket-newline': ['error', 'consistent'],
		'array-bracket-spacing': ['error', 'never'],
		'array-element-newline': ['error', 'consistent'],
		'arrow-parens': ['error', 'as-needed'],
		'arrow-spacing': ['error', { before: true, after: true }],
		'block-spacing': ['error', 'always'],
		'brace-style': ['error', '1tbs'],
		'comma-dangle': ['error', 'always-multiline'],
		'comma-spacing': ['error', { before: false, after: true }],
		'comma-style': ['error', 'last'],
		'computed-property-spacing': ['error', 'never'],
		'eol-last': ['error', 'always'],
		'function-call-argument-newline': ['error', 'consistent'],
		'jsx-quotes': ['error', 'prefer-double'],
		'key-spacing': ['error', { beforeColon: false, afterColon: true }],
		'keyword-spacing': ['error', { before: true, after: true }],
		'linebreak-style': ['error', 'unix'],
		'no-whitespace-before-property': ['error'],
		'object-curly-newline': ['error', { consistent: true }],
		'object-curly-spacing': ['error', 'always'],
		'quote-props': ['error', 'consistent'],
		'quotes': ['error', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
		'semi': ['error', 'never'],
		'space-in-parens': ['error', 'never'],
		'space-infix-ops': ['error'],
		'space-unary-ops': ['error', { words: true, nonwords: false }],

		'no-restricted-syntax': [
			'error',
			{
				selector: 'TSEnumDeclaration',
				message: 'TypeScript enums are banned. Use regular union types instead.',
			},
		],
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
}
