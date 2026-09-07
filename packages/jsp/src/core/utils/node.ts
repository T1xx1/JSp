import { TSESTree } from '@typescript-eslint/types';

export type TSNode =
	| TSESTree.AccessorProperty
	| TSESTree.ArrayExpression
	| TSESTree.ArrayPattern
	| TSESTree.ArrowFunctionExpression
	| TSESTree.AssignmentExpression
	| TSESTree.AssignmentPattern
	| TSESTree.AwaitExpression
	| TSESTree.BinaryExpression
	| TSESTree.BlockStatement
	| TSESTree.BreakStatement
	| TSESTree.CallExpression
	| TSESTree.CatchClause
	| TSESTree.ChainExpression
	| TSESTree.ClassBody
	| TSESTree.ClassDeclaration
	| TSESTree.ClassExpression
	| TSESTree.ConditionalExpression
	| TSESTree.ContinueStatement
	| TSESTree.DebuggerStatement
	| TSESTree.Decorator
	| TSESTree.DoWhileStatement
	| TSESTree.EmptyStatement
	| TSESTree.ExportAllDeclaration
	| TSESTree.ExportDefaultDeclaration
	| TSESTree.ExportNamedDeclaration
	| TSESTree.ExportSpecifier
	| TSESTree.ExpressionStatement
	| TSESTree.ForInStatement
	| TSESTree.ForOfStatement
	| TSESTree.ForStatement
	| TSESTree.FunctionDeclaration
	| TSESTree.FunctionExpression
	| TSESTree.Identifier
	| TSESTree.IfStatement
	| TSESTree.ImportAttribute
	| TSESTree.ImportDeclaration
	| TSESTree.ImportDefaultSpecifier
	| TSESTree.ImportExpression
	| TSESTree.ImportNamespaceSpecifier
	| TSESTree.ImportSpecifier
	| TSESTree.LabeledStatement
	| TSESTree.Literal
	| TSESTree.LogicalExpression
	| TSESTree.MemberExpression
	| TSESTree.MetaProperty
	| TSESTree.MethodDefinition
	| TSESTree.NewExpression
	| TSESTree.ObjectExpression
	| TSESTree.ObjectPattern
	| TSESTree.PrivateIdentifier
	| TSESTree.Program
	| TSESTree.Property
	| TSESTree.PropertyDefinition
	| TSESTree.RestElement
	| TSESTree.ReturnStatement
	| TSESTree.SequenceExpression
	| TSESTree.SpreadElement
	| TSESTree.StaticBlock
	| TSESTree.Super
	| TSESTree.SwitchCase
	| TSESTree.SwitchStatement
	| TSESTree.TaggedTemplateExpression
	| TSESTree.TemplateElement
	| TSESTree.TemplateLiteral
	| TSESTree.ThisExpression
	| TSESTree.ThrowStatement
	| TSESTree.TryStatement
	| TSESTree.UnaryExpression
	| TSESTree.UpdateExpression
	| TSESTree.VariableDeclaration
	| TSESTree.VariableDeclarator
	| TSESTree.WhileStatement
	// | TSESTree.WithStatement
	| TSESTree.YieldExpression
	| TSESTree.TSAbstractAccessorProperty
	| TSESTree.TSAbstractKeyword
	| TSESTree.TSAbstractMethodDefinition
	| TSESTree.TSAbstractPropertyDefinition
	| TSESTree.TSAnyKeyword
	| TSESTree.TSArrayType
	| TSESTree.TSAsExpression
	| TSESTree.TSAsyncKeyword
	| TSESTree.TSBigIntKeyword
	| TSESTree.TSBooleanKeyword
	| TSESTree.TSCallSignatureDeclaration
	| TSESTree.TSClassImplements
	| TSESTree.TSConditionalType
	| TSESTree.TSConstructorType
	| TSESTree.TSConstructSignatureDeclaration
	| TSESTree.TSDeclareFunction
	| TSESTree.TSDeclareKeyword
	| TSESTree.TSEmptyBodyFunctionExpression
	| TSESTree.TSEnumBody
	| TSESTree.TSEnumDeclaration
	| TSESTree.TSEnumMember
	| TSESTree.TSExportAssignment
	| TSESTree.TSExportKeyword
	| TSESTree.TSExternalModuleReference
	| TSESTree.TSFunctionType
	| TSESTree.TSImportEqualsDeclaration
	| TSESTree.TSImportType
	| TSESTree.TSIndexedAccessType
	| TSESTree.TSIndexSignature
	| TSESTree.TSInferType
	| TSESTree.TSInstantiationExpression
	| TSESTree.TSInterfaceBody
	| TSESTree.TSInterfaceDeclaration
	| TSESTree.TSInterfaceHeritage
	| TSESTree.TSIntersectionType
	| TSESTree.TSIntrinsicKeyword
	| TSESTree.TSLiteralType
	| TSESTree.TSMappedType
	| TSESTree.TSMethodSignature
	| TSESTree.TSModuleBlock
	| TSESTree.TSModuleDeclaration
	| TSESTree.TSNamedTupleMember
	| TSESTree.TSNamespaceExportDeclaration
	| TSESTree.TSNeverKeyword
	| TSESTree.TSNonNullExpression
	| TSESTree.TSNullKeyword
	| TSESTree.TSNumberKeyword
	| TSESTree.TSObjectKeyword
	| TSESTree.TSOptionalType
	| TSESTree.TSParameterProperty
	| TSESTree.TSPrivateKeyword
	| TSESTree.TSPropertySignature
	| TSESTree.TSProtectedKeyword
	| TSESTree.TSPublicKeyword
	| TSESTree.TSQualifiedName
	| TSESTree.TSReadonlyKeyword
	| TSESTree.TSRestType
	| TSESTree.TSSatisfiesExpression
	| TSESTree.TSStaticKeyword
	| TSESTree.TSStringKeyword
	| TSESTree.TSSymbolKeyword
	| TSESTree.TSTemplateLiteralType
	| TSESTree.TSThisType
	| TSESTree.TSTupleType
	| TSESTree.TSTypeAliasDeclaration
	| TSESTree.TSTypeAnnotation
	| TSESTree.TSTypeAssertion
	| TSESTree.TSTypeLiteral
	| TSESTree.TSTypeOperator
	| TSESTree.TSTypeParameter
	| TSESTree.TSTypeParameterDeclaration
	| TSESTree.TSTypeParameterInstantiation
	| TSESTree.TSTypePredicate
	| TSESTree.TSTypeQuery
	| TSESTree.TSTypeReference
	| TSESTree.TSUndefinedKeyword
	| TSESTree.TSUnionType
	| TSESTree.TSUnknownKeyword
	| TSESTree.TSVoidKeyword;

/*  */

import type {
	PipelineExpression,
	PipelineIdentifier,
} from '../../plugins/pipelineoperator/_index.js';

export type JSpPipelineExpression = Omit<PipelineExpression, 'type'> & {
	type: 'JSpPipelineExpression';
};
export type JSpPipelineIdentifier = Omit<PipelineIdentifier, 'type'> & {
	type: 'JSpPipelineIdentifier';
};

export type JSpNode = JSpPipelineExpression | JSpPipelineIdentifier;

/*  */

export type AnyNode = TSNode | JSpNode;
