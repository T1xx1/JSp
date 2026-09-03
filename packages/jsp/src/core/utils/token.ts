import type { AnyNode as N } from 'acorn';

export type TSAsExpression = {
	type: 'TSAsExpression';
};
export type TSEnumDeclaration = {
	type: 'TSEnumDeclaration';
};
export type TSEnumMember = {
	type: 'TSEnumMember';
};
export type TSFunctionType = {
	type: 'TSFunctionType';
};
export type TSStringKeyword = {
	type: 'TSStringKeyword';
};
export type TSTypeAliasDeclaration = {
	type: 'TSTypeAliasDeclaration';
};
export type TSTypeAnnotation = {
	type: 'TSTypeAnnotation';
};
export type TSTypeParameter = {
	type: 'TSTypeParameter';
};
export type TSTypeReference = {
	type: 'TSTypeReference';
};
export type TSVoidKeyword = {
	type: 'TSVoidKeyword';
};

/*  */

import type {
	PipelineExpression,
	PipelineIdentifier,
} from '../../plugins/pipelineoperator/_index.js';

export type JSpPipelineExpression = PipelineExpression & {
	type: 'JSpPipelineExpression';
};
export type JSpPipelineIdentifier = PipelineIdentifier & {
	type: 'JSpPipelineIdentifier';
};

export type AnyNode =
	| N
	| TSAsExpression
	| TSEnumDeclaration
	| TSEnumMember
	| TSFunctionType
	| TSStringKeyword
	| TSTypeAliasDeclaration
	| TSTypeAnnotation
	| TSTypeParameter
	| TSTypeReference
	| TSVoidKeyword
	| JSpPipelineExpression
	| JSpPipelineIdentifier;
