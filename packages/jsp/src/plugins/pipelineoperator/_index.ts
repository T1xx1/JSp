import { TokenType, tokTypes } from 'acorn';

import { createPlugin } from '../../core/plugin.js';

const pipelineOperatorTokenType = new TokenType('|>', {
	beforeExpr: true,
});

export const pipelineOperator = createPlugin({
	parser: (acornParser) => {
		return class extends acornParser {
			_pipelineDepth = 0;

			readToken_pipe_amp(code) {
				if (code === 124 && this.input.charCodeAt(this.pos + 1) === 62) {
					return this.finishOp(pipelineOperatorTokenType, 2);
				}

				return super.readToken_pipe_amp(code);
			}

			parseMaybeConditional(noIn, forInit) {
				const startPos = this.start;
				const startLoc = this.startLoc;

				let expr = super.parseMaybeConditional(noIn, forInit);

				while (this.type === pipelineOperatorTokenType) {
					expr = this.parsePipelineExpression(expr, startPos, startLoc, noIn, forInit);
				}

				return expr;
			}

			parsePipelineExpression(left, startPos, startLoc, noIn, forInit) {
				const node = this.startNodeAt(startPos, startLoc);

				node.left = left;

				this.expect(pipelineOperatorTokenType);

				this._pipelineDepth++;

				try {
					node.right = super.parseMaybeConditional(noIn, forInit);
				} finally {
					this._pipelineDepth--;
				}

				return this.finishNode(node, 'JSpPipelineExpression');
			}

			parseExprAtom(refDestructuringErrors, forInit) {
				if (this.type === tokTypes.modulo) {
					if (!this._pipelineDepth) {
						this.raise(
							this.start,
							"Unexpected token '%': the pipeline placeholder can only be used inside the right-hand side of a pipeline chain",
						);
					}

					const node = this.startNode();

					this.next();

					return this.finishNode(node, 'JSpPipelineIdentifier');
				}

				return super.parseExprAtom(refDestructuringErrors, forInit);
			}
		};
	},
});
