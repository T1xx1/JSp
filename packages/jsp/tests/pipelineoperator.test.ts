import { describe, expect, test } from 'vitest';

import { parse } from '../src/core/parser.ts';

describe('Parser', () => {
	test('SyntaxError: /%', () => {
		expect(() => {
			try {
				parse(`'Hello, world!
	|>`);
			} catch (e) {
				throw e;
			}
		}).toThrow(SyntaxError);
	});
	test('SyntaxError: 2 %', () => {
		expect(() => {
			try {
				parse(`1
	|> % + %`);
			} catch (e) {
				throw e;
			}
		}).toThrow(SyntaxError);
	});
	test('SyntaxError: % % %', () => {
		expect(() => {
			try {
				parse(`1
	|> % % %`);
			} catch (e) {
				throw e;
			}
		}).toThrow(SyntaxError);
	});

	test('|>', () => {
		expect(
			parse(`'Hello, world!'
	|> %;`),
		).toMatchObject({
			type: 'Program',
			body: [
				{
					type: 'ExpressionStatement',
					expression: {
						type: 'JSpPipelineExpression',
						left: {
							type: 'Literal',
							value: 'Hello, world!',
							raw: "'Hello, world!'",
						},
						right: {
							type: 'JSpPipelineIdentifier',
						},
					},
				},
			],
			sourceType: 'module',
		});
	});

	test('|> f(%)', () => {
		expect(
			parse(`'Hello, world!'
	|> console.log(%);
		`),
		).toMatchObject({
			type: 'Program',
			body: [
				{
					type: 'ExpressionStatement',
					expression: {
						type: 'JSpPipelineExpression',
						left: {
							type: 'Literal',
							value: 'Hello, world!',
							raw: "'Hello, world!'",
						},
						right: {
							type: 'CallExpression',
							callee: {
								type: 'MemberExpression',
								object: {
									type: 'Identifier',
									name: 'console',
								},
								property: {
									type: 'Identifier',
									name: 'log',
								},
								computed: false,
								optional: false,
							},
							arguments: [
								{
									type: 'JSpPipelineIdentifier',
								},
							],
							optional: false,
						},
					},
				},
			],
			sourceType: 'module',
		});
	});
	test('|> f(x, %)', () => {
		expect(
			parse(`2
	|> Math.max(1, %)`),
		).toMatchObject({
			type: 'Program',
			body: [
				{
					type: 'ExpressionStatement',
					expression: {
						type: 'JSpPipelineExpression',
						left: {
							type: 'Literal',
							value: 2,
							raw: '2',
						},
						operator: '|>',
						right: {
							type: 'CallExpression',
							callee: {
								type: 'MemberExpression',
								object: {
									type: 'Identifier',
									name: 'Math',
								},
								property: {
									type: 'Identifier',
									name: 'max',
								},
								computed: false,
								optional: false,
							},
							arguments: [
								{
									type: 'Literal',
									value: 1,
									raw: '1',
								},
								{
									type: 'JSpPipelineIdentifier',
									name: '%',
								},
							],
							optional: false,
						},
					},
				},
			],
			sourceType: 'module',
		});
	});
	test('|> %.m()', () => {
		expect(
			parse(`'Hello, world!'
	|> %.toUpperCase();`),
		).toMatchObject({
			type: 'Program',

			body: [
				{
					type: 'ExpressionStatement',

					expression: {
						type: 'JSpPipelineExpression',

						left: {
							type: 'Literal',

							value: 'Hello, world!',
							raw: "'Hello, world!'",
						},
						right: {
							type: 'CallExpression',

							callee: {
								type: 'MemberExpression',

								object: {
									type: 'JSpPipelineIdentifier',
								},
								property: {
									type: 'Identifier',

									name: 'toUpperCase',
								},
								computed: false,
								optional: false,
							},
							arguments: [],
							optional: false,
						},
					},
				},
			],
			sourceType: 'module',
		});
	});
	test('|> % + x', () => {
		expect(
			parse(`1
	|> % + 1`),
		).toMatchObject({
			type: 'Program',
			body: [
				{
					type: 'ExpressionStatement',
					expression: {
						type: 'JSpPipelineExpression',
						left: {
							type: 'Literal',
							value: 1,
							raw: '1',
						},
						operator: '|>',
						right: {
							type: 'BinaryExpression',
							left: {
								type: 'JSpPipelineIdentifier',
								name: '%',
							},
							operator: '+',
							right: {
								type: 'Literal',
								value: 1,
								raw: '1',
							},
						},
					},
				},
			],
			sourceType: 'module',
		});
	});
	test('|> % % x', () => {
		expect(
			parse(`1
	|> % % 1`),
		).toMatchObject({
			type: 'Program',
			body: [
				{
					type: 'ExpressionStatement',
					expression: {
						type: 'JSpPipelineExpression',
						left: {
							type: 'Literal',
							value: 1,
							raw: '1',
						},
						right: {
							type: 'BinaryExpression',

							left: {
								type: 'JSpPipelineIdentifier',
							},
							operator: '%',
							right: {
								type: 'Literal',
								value: 1,
								raw: '1',
							},
						},
					},
				},
			],
			sourceType: 'module',
		});
	});
	test('|> [%]', () => {
		expect(
			parse(`1
	|> [%]`),
		).toMatchObject({
			type: 'Program',
			body: [
				{
					type: 'ExpressionStatement',
					expression: {
						type: 'JSpPipelineExpression',
						left: {
							type: 'Literal',
							value: 1,
							raw: '1',
						},
						operator: '|>',
						right: {
							type: 'ArrayExpression',
							elements: [
								{
									type: 'JSpPipelineIdentifier',
									name: '%',
								},
							],
						},
					},
				},
			],
			sourceType: 'module',
		});
	});
	test.todo('|> {x: %}');
	test.todo('|> `${%}`');
	test.todo('|> new Foo(%)');
	test.todo(`|> await %`);
	test.todo('|> yield %');
	test.todo('|> import(%)');

	test('|> |>', () => {
		expect(
			parse(`'Hello, world!'
	|> %.toUpperCase()
	|> console.log(%);
		`),
		).toMatchObject({
			type: 'Program',
			body: [
				{
					type: 'ExpressionStatement',
					expression: {
						type: 'JSpPipelineExpression',
						left: {
							type: 'JSpPipelineExpression',
							left: {
								type: 'Literal',
								value: 'Hello, world!',
								raw: "'Hello, world!'",
							},
							right: {
								type: 'CallExpression',
								callee: {
									type: 'MemberExpression',
									object: {
										type: 'JSpPipelineIdentifier',
									},
									property: {
										type: 'Identifier',
										name: 'toUpperCase',
									},
									computed: false,
									optional: false,
								},
								arguments: [],
								optional: false,
							},
						},
						right: {
							type: 'CallExpression',
							callee: {
								type: 'MemberExpression',
								object: {
									type: 'Identifier',
									name: 'console',
								},
								property: {
									type: 'Identifier',
									name: 'log',
								},
								computed: false,
								optional: false,
							},
							arguments: [
								{
									type: 'JSpPipelineIdentifier',
								},
							],
							optional: false,
						},
					},
				},
			],
			sourceType: 'module',
		});
	});
});
