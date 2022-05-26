import type { ReactNode } from 'react'
import { BindingError } from '../BindingError'
import type { Filter } from '../treeParameters'
import equal from 'fast-deep-equal/es6'
import { Schema, SchemaColumn, SchemaEntity, SchemaRelation } from '../core/schema'

class Environment {
	private constructor(
		private readonly options: Environment.Options,
	) {
	}

	public static create() {
		return new Environment({
			labelMiddleware: label => label,
			dimensions: {},
			variables: {},
			parameters: {},
		})
	}

	public getSubTree(): Environment.SubTreeNode {
		for (let env: Environment = this; env.options.node; env = env.getParent()) {
			const node = env.options.node
			if (node.type === 'subtree-entity' || node.type === 'subtree-entity-list') {
				return node
			}
		}
		throw new BindingError('Not in a SubTree')
	}

	public getSubTreeNode(): Environment.AnyNode {
		if (!this.options.node) {
			throw new BindingError()
		}
		return this.options.node
	}

	public withSubTree(SubTree: Environment.SubTreeNode) {
		const { parent, ...options } = this.options
		return new Environment({
			...options,
			node: SubTree,
		})
	}

	public withSubTreeChild(node: Environment.InnerNode) {
		if (!this.options.node) {
			throw new BindingError(`Cannot call withTreeChild without previous call of withSubTree`)
		}
		if (this.options.node.entity.fields.get(node.field.name) !== node.field) {
			throw new BindingError()
		}
		return new Environment({
			...this.options,
			node,
			parent: this,
		})
	}


	public hasVariable(key: string): boolean {
		return key in this.options.variables
	}

	public getVariable<F, V extends Environment.Value = Environment.Value>(key: string, fallback: F): V | F
	public getVariable<V extends Environment.Value = Environment.Value>(key: string): V
	public getVariable<F, V extends Environment.Value = Environment.Value>(key: string, fallback?: F): V | F {
		if (!(key in this.options.variables)) {
			if (arguments.length > 1) {
				return fallback as F
			}
			throw new BindingError(`Variable ${key} not found`)
		}
		return this.options.variables[key] as V
	}

	/** @deprecated use getVariable or getParameter */
	public getValueOrElse<F, V extends Environment.Value = Environment.Value>(key: string, fallback: F): V | F {
		console.warn('Environment.getValueOrElse() is deprecated, use Environment.getVariable() or Environment.getParameter() instead.')
		return this.getVariable(key, fallback) ?? this.getParameter(key, fallback) as V | F
	}

	/** @deprecated */
	public hasName(key: string): boolean {
		console.warn('Environment.hasName() is deprecated, use Environment.hasVariable() or Environment.hasParameter() instead.')
		return key in this.options.variables || key in this.options.parameters
	}

	public withVariables(variables: Environment.ValuesMapWithFactory | undefined): Environment {
		if (variables === undefined) {
			return this
		}
		const newVariables = { ...this.options.variables }
		for (const [newName, newValue] of Object.entries(variables)) {
			if (newName === 'labelMiddleware') {
				throw new BindingError('You cannot pass labelMiddleware to withVariables method. Use withLabelMiddleware instead.')
			}
			const resolvedValue = typeof newValue === 'function' ? newValue(this) : newValue
			if (resolvedValue === undefined) {
				delete newVariables[newName]
			} else {
				newVariables[newName] = resolvedValue
			}
		}
		return new Environment({ ...this.options, variables: newVariables })
	}

	public hasParameter(key: string): boolean {
		return key in this.options.parameters
	}

	public getParameter<F>(key: string, fallback: F): string | F
	public getParameter(key: string): string
	public getParameter<F>(key: string, fallback?: F): string | F {
		if (!(key in this.options.parameters) || this.options.parameters[key] === undefined) {
			if (arguments.length > 1) {
				return fallback as F
			}
			throw new BindingError(`Parameter ${key} not found`)
		}
		return this.options.parameters[key] as string
	}

	public withParameters(parameters: Environment.Parameters): Environment {
		return new Environment({ ...this.options, parameters })
	}

	public hasDimension(dimensionName: string): boolean {
		return dimensionName in this.options.dimensions
	}

	public getDimension<F>(dimensionName: string, fallback: F): string[] | F
	public getDimension(dimensionName: string): string[]
	public getDimension<F>(dimensionName: string, fallback?: F): string[] | F {
		if (!(dimensionName in this.options.dimensions)) {
			if (arguments.length > 1) {
				return fallback as F
			}
			throw new BindingError(`Dimension ${dimensionName} does not exist.`)
		}
		return this.options.dimensions[dimensionName]
	}
	public getAllDimensions(): Environment.SelectedDimensions {
		return this.options.dimensions
	}

	public withDimensions(dimensions: Environment.SelectedDimensions): Environment {
		const newDimensions = {
			...this.options.dimensions,
			...dimensions,
		}
		if (equal(newDimensions, this.options.dimensions)) {
			return this
		}
		return new Environment({ ...this.options, dimensions: newDimensions })
	}

	public applyLabelMiddleware(label: React.ReactNode): React.ReactNode {
		return this.options['labelMiddleware'](label, this)
	}

	public withLabelMiddleware(labelMiddleware: Environment.Options['labelMiddleware']) {
		return new Environment({ ...this.options, labelMiddleware })
	}

	public getSchema(): Schema {
		if (!this.options.schema) {
			throw new BindingError('Schema is not set')
		}
		return this.options.schema
	}

	public withSchema(schema: Schema): Environment {
		return new Environment({ ...this.options, schema })
	}

	public getParent(): Environment {
		if (!this.options.parent) {
			throw new BindingError('There is no parent environment')
		}
		return this.options.parent
	}

	public merge(other: Environment): Environment {
		if (other === this) {
			return this
		}
		if (!equal(this.options.node, other.options.node)) {
			throw new BindingError(`Cannot merge two environments with different tree position.`)
		}
		if (this.options.parameters !== other.options.parameters) {
			throw new BindingError(`Cannot merge two environments with different parameters.`)
		}
		if (this.options.dimensions !== other.options.dimensions) {
			throw new BindingError(`Cannot merge two environments with different dimensions.`)
		}
		if (equal(this.options.variables, other.options.variables) && this.options.parent === other.options.parent) {
			return this
		}
		for (const key in other.options.variables) {
			if (key in this.options.variables && !equal(this.options.variables[key], other.options.variables[key])) {
				throw new BindingError(`Cannot merge two environments with different value of variable ${key}:\n`
					+ JSON.stringify(this.options.variables[key]) + '\n'
					+ JSON.stringify(other.options.variables[key]))
			}
		}

		return new Environment({
			...this.options,
			parent: this.options.parent && other.options.parent ? this.options.parent.merge(other.options.parent) : undefined,
			variables: { ...this.options.variables, ...other.options.variables },
		})
	}
}

namespace Environment {
	export type Name = string

	export type Value = ReactNode

	export type ResolvedValue = Value | Filter

	export type LabelMiddleware = (label: ReactNode, environment: Environment) => ReactNode

	export interface Options {
		node?: AnyNode
		schema?: Schema
		dimensions: SelectedDimensions
		parameters: Parameters
		variables: CustomVariables
		labelMiddleware: LabelMiddleware
		parent?: Environment
	}

	export type SubTreeNode =
		| SubTreeEntityNode
		| SubTreeEntityListNode

	export type InnerNode =
		| EntityNode
		| EntityListNode
		| ColumnNode

	export type AnyNode =
		| SubTreeNode
		| InnerNode

	export interface SubTreeEntityNode {
		type: 'subtree-entity'
		entity: SchemaEntity
		expectedCardinality: 'zero' | 'one' | 'zero-or-one'
		filter: Filter
	}

	export interface SubTreeEntityListNode {
		type: 'subtree-entity-list'
		entity: SchemaEntity
		expectedCardinality: 'zero-to-many' | 'zero'
		filter: Filter
	}

	export interface EntityNode {
		type: 'entity'
		entity: SchemaEntity
		field: SchemaRelation
	}

	export interface EntityListNode {
		type: 'entity-list'
		entity: SchemaEntity
		field: SchemaRelation
	}

	export interface ColumnNode {
		type: 'column'
		entity: SchemaEntity
		field: SchemaColumn
	}

	export interface SelectedDimensions {
		[key: string]: string[]
	}

	export interface Parameters {
		[key: string]: string | undefined
	}

	export interface CustomVariables {
		[key: string]: Value
	}

	export interface ValuesMapWithFactory {
		[key: string]:
			| ((environment: Environment) => Value)
			| Value
	}

	/** @deprecated */
	export type DeltaFactory = ValuesMapWithFactory
}

export { Environment }
