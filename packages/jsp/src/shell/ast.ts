import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';

import { TSESTree } from '@typescript-eslint/types';
import chalk from 'chalk';

import { checkConfig, getConfig } from '../core/config/config.js';
import { parse } from '../core/parser.js';
import { checkJsType } from '../core/preflight.js';
import { colors } from '../core/utils/color.js';
import { getPackageJson } from '../core/utils/packageJson.js';
import { printExit } from '../core/utils/print.js';
import { assert } from '../tslib/std/assert.js';

export const ast = (fileName: string): void => {
	const CWD = cwd();
	const packageJson = getPackageJson(CWD);

	checkJsType(packageJson);

	const config = checkConfig({
		config: getConfig(CWD),
	});

	fileName = join(config.compiler.srcDir, fileName);

	if (!existsSync(fileName)) {
		printExit({
			message: `${fileName} does not exist.`,
			severity: 'error',
		});
	}

	const fileContent = readFileSync(fileName, 'utf8');

	const program = parse(fileContent);

	/* @ts-expect-error */
	program.ext = fileName.split('.').at(-1);

	printAst({
		node: program,
	});
};

/*  */

const symbols = {
	branch: '├ ',
	stick: '│',
	leaf: '└ ',
};

const indent = (prefix: string, isLeaf: boolean = false): string => {
	return `${prefix.replace(symbols.leaf, ' ').replaceAll(symbols.branch, symbols.stick)} ${isLeaf ? symbols.leaf : symbols.branch}`;
};
const literal = (identifier: string): string => {
	switch (typeof identifier) {
		case 'bigint': {
			return chalk.hex(colors.token.number)(identifier);
		}
		case 'boolean': {
			return chalk.hex(colors.token.boolean)(identifier);
		}
		case 'function': {
			return chalk.hex(colors.token.function)(identifier);
		}
		case 'number': {
			return chalk.hex(colors.token.number)(identifier);
		}
		case 'object': {
			return chalk.hex(colors.token.block)(identifier);
		}
		case 'string': {
			return chalk.hex(colors.token.string)(identifier);
		}
		case 'symbol': {
			return chalk.hex(colors.token.identifier)(identifier);
		}
		case 'undefined': {
			return chalk.hex(colors.token.null)(identifier);
		}
	}
};

const printAst = ({ node, prefix = '' }: { node: TSESTree.Node; prefix?: string }): void => {
	switch (node.type) {
		/* JS */
		case 'Program': {
			/* @ts-expect-error */
			switch (node.ext ?? '') {
				case 'js': {
					console.log(chalk.hex(colors.js)('Program'));

					break;
				}
				case 'jsp': {
					console.log(chalk.hex(colors.jsp)('Program'));

					break;
				}
				case 'ts': {
					console.log(chalk.hex(colors.ts)('Program'));

					break;
				}
				default: {
					console.log('Program');
				}
			}

			for (let i = 0; i < node.body.length; i++) {
				printAst({
					node: node.body[i],
					prefix: i + 1 !== node.body.length ? symbols.branch : symbols.leaf,
				});
			}

			break;
		}

		/*  */

		case 'AccessorProperty': {
			console.log(`${prefix}${chalk.hex(colors.token.identifier)(node.type)}`);

			printAst({
				node: node.key,
				prefix: indent(prefix),
			});

			printAst({
				node: node.value,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'ArrayExpression': {
			console.log(`${prefix}${chalk.hex(colors.token.block)(node.type)}`);

			for (let i = 0; i < node.elements.length; i++) {
				printAst({
					node: node.elements[i],
					prefix: indent(prefix, i + 1 === node.elements.length),
				});
			}

			break;
		}
		case 'ArrayPattern': {
			console.log(`${prefix}${chalk.hex(colors.token.block)(node.type)}`);

			for (let i = 0; i < node.elements.length; i++) {
				printAst({
					node: node.elements[i],
					prefix: indent(prefix, i + 1 === node.elements.length),
				});
			}

			break;
		}
		case 'ArrowFunctionExpression': {
			console.log(`${prefix}${chalk.hex(colors.token.function)(node.type)}`);

			if (node.returnType) {
				printAst({
					node: node.returnType,
					prefix: indent(prefix),
				});
			}

			for (let i = 0; i < node.params.length; i++) {
				printAst({
					node: node.params[i],
					prefix: indent(prefix),
				});
			}

			printAst({
				node: node.body,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'AssignmentExpression': {
			console.log(`${prefix}${chalk.hex(colors.token.variable)(node.type)}`);

			printAst({
				node: node.left,
				prefix: indent(prefix),
			});

			printAst({
				node: node.right,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'AssignmentPattern': {
			console.log(`${prefix}${chalk.hex(colors.token.identifier)(node.type)}`);

			printAst({
				node: node.left,
				prefix: indent(prefix),
			});

			printAst({
				node: node.right,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'AwaitExpression': {
			console.log(`${prefix}${chalk.hex(colors.token.keyword)(node.type)}`);

			printAst({
				node: node.argument,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'BinaryExpression': {
			console.log(`${prefix}${node.type} (${node.operator})`);

			printAst({
				node: node.left,
				prefix: indent(prefix),
			});

			printAst({
				node: node.right,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'BlockStatement': {
			console.log(`${prefix}${chalk.hex(colors.token.block)(node.type)}`);

			for (let i = 0; i < node.body.length; i++) {
				printAst({
					node: node.body[i],
					prefix: indent(prefix, i + 1 === node.body.length),
				});
			}

			break;
		}
		case 'BreakStatement': {
			console.log(`${prefix}${chalk.hex(colors.token.keyword)(node.type)}`);

			if (node.label) {
				printAst({
					node: node.label,
					prefix: indent(prefix),
				});
			}

			break;
		}
		case 'CallExpression': {
			console.log(`${prefix}${chalk.hex(colors.token.function)(node.type)}`);

			printAst({
				node: node.callee,
				prefix: indent(prefix, node.arguments.length === 0),
			});

			for (let i = 0; i < node.arguments.length; i++) {
				printAst({
					node: node.arguments[i],
					prefix: indent(prefix, i + 1 === node.arguments.length),
				});
			}

			break;
		}
		case 'CatchClause': {
			console.log(`${prefix}${chalk.hex(colors.token.keyword)(node.type)}`);

			printAst({
				node: node.param,
				prefix: indent(prefix),
			});

			printAst({
				node: node.body,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'ChainExpression': {
			console.log(`${prefix}${node.type}`);

			for (let i = 0; i < node.expressions.length; i++) {
				printAst({
					node: node.expressions[i],
					prefix: indent(prefix, i + 1 === node.expressions.length),
				});
			}

			break;
		}
		case 'ClassBody': {
			console.log(`${prefix}${chalk.hex(colors.token.block)(node.type)}`);

			for (let i = 0; i < node.body.length; i++) {
				printAst({
					node: node.body[i],
					prefix: indent(prefix, i + 1 === node.body.length),
				});
			}

			break;
		}
		case 'ClassDeclaration': {
			console.log(`${prefix}${chalk.hex(colors.token.type)(node.type)}`);

			printAst({
				node: node.id,
				prefix: indent(prefix),
			});

			if (node.superClass) {
				printAst({
					node: node.superClass,
					prefix: indent(prefix),
				});
			}

			for (let i = 0; i < node.body.body.length; i++) {
				printAst({
					node: node.body.body[i],
					prefix: indent(prefix, i + 1 === node.body.body.length),
				});
			}

			break;
		}
		case 'ClassExpression': {
			console.log(`${prefix}${chalk.hex(colors.token.type)(node.type)}`);

			printAst({
				node: node.id,
				prefix: indent(prefix),
			});

			if (node.superClass) {
				printAst({
					node: node.superClass,
					prefix: indent(prefix),
				});
			}

			for (let i = 0; i < node.body.body.length; i++) {
				printAst({
					node: node.body.body[i],
					prefix: indent(prefix, i + 1 === node.body.body.length),
				});
			}

			break;
		}
		case 'ConditionalExpression': {
			console.log(`${prefix}${node.type}`);

			printAst({
				node: node.test,
				prefix: indent(prefix),
			});

			printAst({
				node: node.consequent,
				prefix: indent(prefix, true),
			});

			printAst({
				node: node.alternate,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'ContinueStatement': {
			console.log(`${prefix}${chalk.hex(colors.token.keyword)(node.type)}`);

			if (node.label) {
				printAst({
					node: node.label,
					prefix: indent(prefix),
				});
			}

			break;
		}
		case 'Decorator': {
			console.log(`${prefix}${chalk.hex(colors.token.keyword)(node.type)}`);

			printAst({
				node: node.expression,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'DebuggerStatement': {
			console.log(`${prefix}${chalk.hex(colors.token.keyword)(node.type)}`);

			break;
		}
		case 'DoWhileStatement': {
			console.log(`${prefix}${chalk.hex(colors.token.keyword)(node.type)}`);

			printAst({
				node: node.body,
				prefix: indent(prefix),
			});

			printAst({
				node: node.test,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'EmptyStatement': {
			console.log(`${prefix}${node.type}`);

			break;
		}
		case 'ExportAllDeclaration': {
			console.log(`${prefix}${chalk.hex(colors.token.keyword)(node.type)}`);

			printAst({
				node: node.source,
				prefix: indent(prefix),
			});

			break;
		}
		case 'ExportDefaultDeclaration': {
			console.log(`${prefix}${chalk.hex(colors.token.keyword)(node.type)}`);

			printAst({
				node: node.declaration,
				prefix: indent(prefix),
			});

			break;
		}
		case 'ExportNamedDeclaration': {
			console.log(`${prefix}${chalk.hex(colors.token.keyword)(node.type)}`);

			printAst({
				node: node.declaration,
				prefix: indent(prefix),
			});

			break;
		}
		case 'ExportSpecifier': {
			console.log(`${prefix}${chalk.hex(colors.token.keyword)(node.type)}`);

			printAst({
				node: node.local,
				prefix: indent(prefix),
			});

			printAst({
				node: node.exported,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'ExpressionStatement': {
			console.log(`${prefix}${node.type}`);

			printAst({
				node: node.expression,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'ForInStatement': {
			console.log(`${prefix}${chalk.hex(colors.token.keyword)(node.type)}`);

			printAst({
				node: node.left,
				prefix: indent(prefix),
			});

			printAst({
				node: node.right,
				prefix: indent(prefix, true),
			});

			printAst({
				node: node.body,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'ForStatement': {
			console.log(`${prefix}${chalk.hex(colors.token.keyword)(node.type)}`);

			printAst({
				node: node.init,
				prefix: indent(prefix),
			});

			printAst({
				node: node.test,
				prefix: indent(prefix, true),
			});

			printAst({
				node: node.update,
				prefix: indent(prefix, true),
			});

			printAst({
				node: node.body,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'ForOfStatement': {
			console.log(`${prefix}${chalk.hex(colors.token.keyword)(node.type)}`);

			printAst({
				node: node.left,
				prefix: indent(prefix),
			});

			printAst({
				node: node.right,
				prefix: indent(prefix, true),
			});

			printAst({
				node: node.body,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'FunctionDeclaration': {
			console.log(`${prefix}${chalk.hex(colors.token.function)(node.type)}`);

			printAst({
				node: node.id,
				prefix: indent(prefix),
			});

			for (let i = 0; i < node.params.length; i++) {
				printAst({
					node: node.params[i],
					prefix: indent(prefix),
				});
			}

			if (node.returnType) {
				printAst({
					node: node.returnType,
					prefix: indent(prefix),
				});
			}

			printAst({
				node: node.body,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'FunctionExpression': {
			console.log(`${prefix}${chalk.hex(colors.token.function)(node.type)}`);

			printAst({
				node: node.id,
				prefix: indent(prefix),
			});

			for (let i = 0; i < node.params.length; i++) {
				printAst({
					node: node.params[i],
					prefix: indent(prefix),
				});
			}

			if (node.returnType) {
				printAst({
					node: node.returnType,
					prefix: indent(prefix),
				});
			}

			printAst({
				node: node.body,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'Identifier': {
			console.log(`${prefix}${chalk.hex(colors.token.identifier)(node.type)} (${node.name})`);

			if (node.typeAnnotation) {
				printAst({
					node: node.typeAnnotation,
					prefix: indent(prefix, true),
				});
			}

			break;
		}
		case 'IfStatement': {
			console.log(`${prefix}${chalk.hex(colors.token.keyword)(node.type)}`);

			printAst({
				node: node.test,
				prefix: indent(prefix),
			});

			printAst({
				node: node.consequent,
				prefix: indent(prefix, true),
			});

			if (node.alternate) {
				printAst({
					node: node.alternate,
					prefix: indent(prefix, true),
				});
			}

			break;
		}
		case 'ImportAttribute': {
			console.log(`${prefix}${chalk.hex(colors.token.keyword)(node.type)}`);

			printAst({
				node: node.key,
				prefix: indent(prefix),
			});

			printAst({
				node: node.value,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'ImportDeclaration': {
			console.log(`${prefix}${chalk.hex(colors.token.keyword)(node.type)}`);

			for (let i = 0; i < node.specifiers.length; i++) {
				printAst({
					node: node.specifiers[i],
					prefix: indent(prefix),
				});
			}

			printAst({
				node: node.source,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'ImportDefaultSpecifier': {
			console.log(`${prefix}${chalk.hex(colors.token.keyword)(node.type)}`);

			printAst({
				node: node.local,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'ImportExpression': {
			console.log(`${prefix}${chalk.hex(colors.token.keyword)(node.type)}`);

			printAst({
				node: node.source,
				prefix: indent(prefix),
			});

			break;
		}
		case 'ImportNamespaceSpecifier': {
			console.log(`${prefix}${chalk.hex(colors.token.keyword)(node.type)}`);

			printAst({
				node: node.local,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'ImportSpecifier': {
			console.log(`${prefix}${chalk.hex(colors.token.keyword)(node.type)}`);

			printAst({
				node: node.imported,
				prefix: indent(prefix, node.imported.name === node.local.name),
			});

			if (node.imported.name !== node.local.name) {
				node.local.name = `${chalk.hex(colors.token.keyword)('as')} ${node.local.name}`;

				printAst({
					node: node.local,
					prefix: indent(prefix, true),
				});
			}

			break;
		}
		case 'LabeledStatement': {
			console.log(`${prefix}${chalk.hex(colors.token.keyword)(node.type)}`);

			printAst({
				node: node.label,
				prefix: indent(prefix),
			});

			printAst({
				node: node.body,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'Literal': {
			console.log(
				`${prefix}${chalk.hex(colors.token.identifier)(node.type)} (${literal(node.value)})`,
			);

			break;
		}
		case 'LogicalExpression': {
			console.log(`${prefix}${node.type}`);

			printAst({
				node: node.left,
				prefix: indent(prefix),
			});

			printAst({
				node: node.right,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'MemberExpression': {
			console.log(`${prefix}${chalk.hex(colors.token.identifier)(node.type)}`);

			printAst({
				node: node.object,
				prefix: indent(prefix),
			});

			printAst({
				node: node.property,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'MetaProperty': {
			console.log(`${prefix}${chalk.hex(colors.token.identifier)(node.type)}`);

			printAst({
				node: node.meta,
				prefix: indent(prefix),
			});

			printAst({
				node: node.property,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'MethodDefinition': {
			console.log(`${prefix}${chalk.hex(colors.token.function)(node.type)}`);

			printAst({
				node: node.key,
				prefix: indent(prefix),
			});

			if (node.computed) {
				printAst({
					node: node.value,
					prefix: indent(prefix),
				});
			}

			printAst({
				node: node.value,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'NewExpression': {
			console.log(`${prefix}${chalk.hex(colors.token.variable)(node.type)}`);

			printAst({
				node: node.callee,
				prefix: indent(prefix),
			});

			for (let i = 0; i < node.arguments.length; i++) {
				printAst({
					node: node.arguments[i],
					prefix: indent(prefix, i + 1 === node.arguments.length),
				});
			}

			break;
		}
		case 'ObjectExpression': {
			console.log(`${prefix}${chalk.hex(colors.token.block)(node.type)}`);

			for (let i = 0; i < node.properties.length; i++) {
				printAst({
					node: node.properties[i],
					prefix: indent(prefix, i + 1 === node.properties.length),
				});
			}

			break;
		}
		case 'ObjectPattern': {
			console.log(`${prefix}${chalk.hex(colors.token.block)(node.type)}`);

			for (let i = 0; i < node.properties.length; i++) {
				printAst({
					node: node.properties[i],
					prefix: indent(prefix, i + 1 === node.properties.length),
				});
			}

			break;
		}
		case 'PrivateIdentifier': {
			console.log(`${prefix}${chalk.hex(colors.token.identifier)(node.type)}`);

			printAst({
				node: node.name,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'PropertyDefinition': {
			console.log(`${prefix}${chalk.hex(colors.token.identifier)(node.type)}`);

			printAst({
				node: node.key,
				prefix: indent(prefix),
			});

			printAst({
				node: node.value,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'Property': {
			console.log(`${prefix}${chalk.hex(colors.token.identifier)(node.type)}`);

			printAst({
				node: node.key,
				prefix: indent(prefix),
			});

			printAst({
				node: node.value,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'RestElement': {
			console.log(`${prefix}${chalk.hex(colors.token.identifier)(node.type)}`);

			printAst({
				node: node.argument,
				prefix: indent(prefix),
			});

			break;
		}
		case 'ReturnStatement': {
			console.log(`${prefix}${chalk.hex(colors.token.keyword)(node.type)}`);

			printAst({
				node: node.argument,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'SequenceExpression': {
			console.log(`${prefix}${chalk.hex(colors.token.block)(node.type)}`);

			for (let i = 0; i < node.expressions.length; i++) {
				printAst({
					node: node.expressions[i],
					prefix: indent(prefix, i + 1 === node.expressions.length),
				});
			}

			break;
		}
		case 'SpreadElement': {
			console.log(`${prefix}${chalk.hex(colors.token.identifier)(node.type)}`);

			printAst({
				node: node.argument,
				prefix: indent(prefix),
			});

			break;
		}
		case 'StaticBlock': {
			console.log(`${prefix}${chalk.hex(colors.token.block)(node.type)}`);

			for (let i = 0; i < node.body.length; i++) {
				printAst({
					node: node.body[i],
					prefix: indent(prefix, i + 1 === node.body.length),
				});
			}

			break;
		}
		case 'Super': {
			console.log(`${prefix}${chalk.hex(colors.token.keyword)(node.type)}`);

			break;
		}
		case 'SwitchCase': {
			console.log(`${prefix}${chalk.hex(colors.token.keyword)(node.type)}`);

			printAst({
				node: node.test,
				prefix: indent(prefix),
			});

			for (let i = 0; i < node.consequent.length; i++) {
				printAst({
					node: node.consequent[i],
					prefix: indent(prefix, i + 1 === node.consequent.length),
				});
			}

			break;
		}
		case 'SwitchStatement': {
			console.log(`${prefix}${chalk.hex(colors.token.keyword)(node.type)}`);

			printAst({
				node: node.discriminant,
				prefix: indent(prefix),
			});

			for (let i = 0; i < node.cases.length; i++) {
				printAst({
					node: node.cases[i],
					prefix: indent(prefix, i + 1 === node.cases.length),
				});
			}

			break;
		}
		case 'TaggedTemplateExpression': {
			console.log(`${prefix}${chalk.hex(colors.token.string)(node.type)}`);

			printAst({
				node: node.tag,
				prefix: indent(prefix),
			});

			printAst({
				node: node.quasi,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'TemplateElement': {
			console.log(`${prefix}${chalk.hex(colors.token.string)(node.type)} (${node.value.raw})`);

			break;
		}
		case 'TemplateLiteral': {
			console.log(`${prefix}${chalk.hex(colors.token.string)(node.type)}`);

			for (let i = 0; i < node.quasis.length; i++) {
				printAst({
					node: node.quasis[i],
					prefix: indent(prefix, i + 1 === node.quasis.length),
				});
			}

			for (let i = 0; i < node.expressions.length; i++) {
				printAst({
					node: node.expressions[i],
					prefix: indent(prefix, i + 1 === node.expressions.length),
				});
			}

			break;
		}
		case 'ThisExpression': {
			console.log(`${prefix}${chalk.hex(colors.token.keyword)(node.type)}`);

			break;
		}
		case 'ThrowStatement': {
			console.log(`${prefix}${chalk.hex(colors.token.keyword)(node.type)}`);

			printAst({
				node: node.argument,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'TryStatement': {
			console.log(`${prefix}${chalk.hex(colors.token.keyword)(node.type)}`);

			printAst({
				node: node.block,
				prefix: indent(prefix),
			});

			if (node.handler) {
				printAst({
					node: node.handler,
					prefix: indent(prefix, true),
				});
			}

			if (node.finalizer) {
				printAst({
					node: node.finalizer,
					prefix: indent(prefix, true),
				});
			}

			break;
		}
		case 'UnaryExpression': {
			console.log(`${prefix}${node.type}`);

			printAst({
				node: node.argument,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'UpdateExpression': {
			console.log(`${prefix}${chalk.hex(colors.token.variable)(node.type)}`);

			printAst({
				node: node.argument,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'VariableDeclaration': {
			console.log(
				`${prefix}${chalk.hex(colors.token.variable)(node.type)} (${chalk.hex(colors.token.variable)(node.kind)})`,
			);

			for (let i = 0; i < node.declarations.length; i++) {
				printAst({
					node: node.declarations[i],
					prefix: indent(prefix, i + 1 === node.declarations.length),
				});
			}

			break;
		}
		case 'VariableDeclarator': {
			console.log(`${prefix}${chalk.hex(colors.token.variable)(node.type)}`);

			printAst({
				node: node.id,
				prefix: indent(prefix, !node.init),
			});

			if (node.init) {
				printAst({
					node: node.init,
					prefix: indent(prefix, true),
				});
			}

			break;
		}
		case 'WhileStatement': {
			console.log(`${prefix}${chalk.hex(colors.token.keyword)(node.type)}`);

			printAst({
				node: node.test,
				prefix: indent(prefix),
			});

			printAst({
				node: node.body,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'YieldExpression': {
			console.log(`${prefix}${chalk.hex(colors.token.keyword)(node.type)}`);

			printAst({
				node: node.argument,
				prefix: indent(prefix, true),
			});

			break;
		}

		/* TS */
		case 'TSAbstractAccessorProperty': {
			console.log(`${prefix}${chalk.hex(colors.token.type)(node.type)}`);

			printAst({
				node: node.key,
				prefix: indent(prefix),
			});

			printAst({
				node: node.value,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'TSAsExpression': {
			console.log(`${prefix}${chalk.hex(colors.token.type)(node.type)}`);

			printAst({
				node: node.expression,
				prefix: indent(prefix),
			});

			printAst({
				node: node.typeAnnotation,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'TSEnumDeclaration': {
			console.log(`${prefix}${chalk.hex(colors.token.type)(node.type)}`);

			printAst({
				node: node.id,
				prefix: indent(prefix),
			});

			for (let i = 0; i < node.members.length; i++) {
				printAst({
					node: node.members[i],
					prefix: indent(prefix, i + 1 === node.members.length),
				});
			}

			break;
		}
		case 'TSEnumMember': {
			console.log(`${prefix}${chalk.hex(colors.token.type)(node.type)}`);

			printAst({
				node: node.id,
				prefix: indent(prefix, !node.init),
			});

			if (node.init) {
				printAst({
					node: node.init,
					prefix: indent(prefix, true),
				});
			}

			break;
		}
		case 'TSFunctionType': {
			console.log(`${prefix}${chalk.hex(colors.token.type)(node.type)}`);

			for (let i = 0; i < node.typeParameters.params.length; i++) {
				printAst({
					node: node.typeParameters.params[i],
					prefix: indent(prefix),
				});
			}

			for (let i = 0; i < node.parameters.length; i++) {
				printAst({
					node: node.parameters[i],
					prefix: indent(prefix),
				});
			}

			printAst({
				node: node.typeAnnotation,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'TSStringKeyword': {
			console.log(
				`${prefix}${chalk.hex(colors.token.type)(node.type)} (${chalk.hex(colors.token.type)('string')})`,
			);

			break;
		}
		case 'TSTypeAliasDeclaration': {
			console.log(`${prefix}${chalk.hex(colors.token.type)(node.type)}`);

			printAst({
				node: node.id,
				prefix: indent(prefix),
			});

			for (let i = 0; i < node.typeParameters.params.length; i++) {
				printAst({
					node: node.typeParameters.params[i],
					prefix: indent(prefix),
				});
			}

			printAst({
				node: node.typeAnnotation,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'TSTypeAnnotation': {
			console.log(`${prefix}${chalk.hex(colors.token.type)(node.type)}`);

			printAst({
				node: node.typeAnnotation,
				prefix: indent(prefix, true),
			});

			break;
		}
		case 'TSTypeParameter': {
			console.log(`${prefix}${chalk.hex(colors.token.type)(node.type)}`);

			printAst({
				node: node.name,
				prefix: indent(prefix),
			});

			if (node.constraint) {
				printAst({
					node: node.constraint,
					prefix: indent(prefix, true),
				});
			}

			break;
		}
		case 'TSTypeReference': {
			console.log(`${prefix}${chalk.hex(colors.token.type)(node.type)}`);

			break;
		}
		case 'TSUnionType': {
			console.log(`${prefix}${chalk.hex(colors.token.type)(node.type)}`);

			for (let i = 0; i < node.types.length; i++) {
				printAst({
					node: node.types[i],
					prefix: indent(prefix, i + 1 === node.types.length),
				});
			}

			break;
		}
		case 'TSUnknownKeyword': {
			console.log(
				`${prefix}${chalk.hex(colors.token.type)(node.type)} (${chalk.hex(colors.token.type)('unknown')})`,
			);

			break;
		}
		case 'TSVoidKeyword': {
			console.log(
				`${prefix}${chalk.hex(colors.token.type)(node.type)} (${chalk.hex(colors.token.type)('void')})`,
			);

			break;
		}

		/* JS+ */
		/* @ts-expect-error */
		case 'JSpPipelineExpression': {
			console.log(`${prefix}${chalk.hex(colors.jsp)(node.type)}`);

			printAst({
				node: node.left,
				prefix: indent(prefix),
			});

			printAst({
				node: node.right,
				prefix: indent(prefix, true),
			});

			break;
		}
		/* @ts-expect-error */
		case 'JSpPipelineIdentifier': {
			console.log(`${prefix}${chalk.hex(colors.jsp)(node.type)} (%)`);

			break;
		}

		/*  */

		default: {
			console.log(`${prefix}${chalk.bgWhite.white(' ? ')} ${node.type}`);

			assert<never>(node.type);

			break;
		}
	}
};
