import { TokenType, tokTypes as tt } from 'acorn';
import type { BaseNodeWithoutComments } from 'estree';

import { createPlugin } from '../../core/plugin.js';

/**
 * '|'
 */
const PIPE_CHAR = 124;
/**
 * '>'
 */
const GT_CHAR = 62;

export const pipelineTokenType = new TokenType('|>', {
	beforeExpr: true,
	binop: 0,
});

export type PipelineExpression = BaseNodeWithoutComments & {
	type: 'JSpPipelineExpression';
};
export type PipelineIdentifier = BaseNodeWithoutComments & {
	type: 'JSpPipelineIdentifier';
	name: '%';
};

/**
 * @see https://github.com/tc39/proposal-pipeline-operator
 */
export const pipelineOperator = createPlugin({
	parser: (Parser) => {
		return class extends Parser {
			pipelinePlaceholderScopes: {
				used: boolean;
			}[] = [];

			constructor(...args) {
				super(...args);
			}

			readToken_pipe_amp(code) {
				if (code === PIPE_CHAR && this.input.charCodeAt(this.pos + 1) === GT_CHAR) {
					return this.finishOp(pipelineTokenType, 2);
				}

				return super.readToken_pipe_amp(code);
			}

			parseExprOp(left, leftStartPos, leftStartLoc, minPrec, ...rest) {
				if (this.type === pipelineTokenType && pipelineTokenType.binop > minPrec) {
					const node = this.startNodeAt(leftStartPos, leftStartLoc);

					node.left = left;
					node.operator = '|>';

					this.next();

					this.pipelinePlaceholderScopes.push({
						used: false,
					});

					const bodyStartPos = this.start;
					const bodyStartLoc = this.startLoc;

					let body = this.parseMaybeUnary(null, false, false, ...rest);

					body = this.parseExprOp(
						body,
						bodyStartPos,
						bodyStartLoc,
						pipelineTokenType.binop,
						...rest,
					);

					this.pipelinePlaceholderScopes.pop();

					node.right = body;

					const pipelineExpr = this.finishNode(node, 'JSpPipelineExpression');

					return this.parseExprOp(pipelineExpr, leftStartPos, leftStartLoc, minPrec, ...rest);
				}

				return super.parseExprOp(left, leftStartPos, leftStartLoc, minPrec, ...rest);
			}

			parseExprAtom(...args) {
				const scopes = this.pipelinePlaceholderScopes;

				if (this.type === tt.modulo && scopes.length > 0) {
					const scope = scopes[scopes.length - 1];

					if (scope.used) {
						this.raise(this.start, 'Pipeline identifier `%` can only consumed once');
					}

					scope.used = true;

					const node = this.startNode();

					this.next();

					node.name = '%';

					return this.finishNode(node, 'JSpPipelineIdentifier');
				}

				return super.parseExprAtom(...args);
			}
		};
	},
});
