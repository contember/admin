import * as React from 'react'
import { BuiltinElements } from './BuiltinElements'
import { BuiltinLeaves } from './BuiltinLeaves'
import { ElementRenderer, RenderElement } from './ElementRenderer'
import { LeafRenderer, RenderLeaf } from './LeafRenderer'
import { RichTextElement } from './RichTextElement'
import { RichTextLeaf } from './RichTextLeaf'

export interface RenderChildrenOptions<
	CustomElements extends RichTextElement = never,
	CustomLeaves extends RichTextLeaf = never
> {
	renderElement?: RenderElement<CustomElements, CustomLeaves>
	renderLeaf?: RenderLeaf<CustomLeaves>
	formatVersion: number
}

export const renderChildren = <
	CustomElements extends RichTextElement = never,
	CustomLeaves extends RichTextLeaf = never
>(
	children:
		| CustomElements
		| BuiltinElements<CustomElements, CustomLeaves>
		| CustomLeaves
		| BuiltinLeaves
		| Array<CustomElements | BuiltinElements<CustomElements, CustomLeaves> | CustomLeaves | BuiltinLeaves>,
	options: RenderChildrenOptions<CustomElements, CustomLeaves>,
): React.ReactElement | null => {
	if (!Array.isArray(children)) {
		children = [children]
	}
	return (
		<>
			{children.map((child, i) => {
				if ('text' in child) {
					return (
						<LeafRenderer<CustomLeaves>
							key={i}
							leaf={child}
							renderLeaf={options.renderLeaf}
							formatVersion={options.formatVersion}
						/>
					)
				}
				if ('children' in child) {
					return (
						<ElementRenderer<CustomElements, CustomLeaves>
							key={i}
							element={child}
							renderElement={options.renderElement}
							formatVersion={options.formatVersion}
						>
							{renderChildren<CustomElements, CustomLeaves>(child.children as typeof children, options)}
						</ElementRenderer>
					)
				}
				return null // Throw?
			})}
		</>
	)
}