import { CustomElementPlugin } from '../../../baseEditor'
import { Editor as SlateEditor, Element as SlateElement, Element, Node, Node as SlateNode, Transforms } from 'slate'
import { createEmptyTableCellElement, isTableCellElement, tableCellElementType } from './TableCellElement'
import { TableRowElementRenderer } from './TableRowElementRenderer'
import { ContemberEditor } from '../../../ContemberEditor'
import { tableElementType } from './TableElement'

export const tableRowElementType = 'tableRow' as const

export interface TableRowElement extends SlateElement {
	type: typeof tableRowElementType
	children: SlateEditor['children']
	headerScope?: 'table'
}

export const isTableRowElement = (element: Node): element is TableRowElement => Element.isElement(element) && element.type === tableRowElementType

export const createEmptyTableRowElement = (columnCount = 2) => ({
	type: tableRowElementType,
	children: Array.from({ length: columnCount }, () => createEmptyTableCellElement()),
})

export const tableRowElementPlugin: CustomElementPlugin<TableRowElement> = {
	type: tableRowElementType,
	render: TableRowElementRenderer,
	normalizeNode: ({ editor, path, element, preventDefault }) => {
		for (const [child, childPath] of SlateNode.children(editor, path)) {
			if (SlateElement.isElement(child)) {
				if (!isTableCellElement(child)) {
					ContemberEditor.ejectElement(editor, childPath)
					Transforms.setNodes(editor, { type: tableCellElementType }, { at: childPath })
				}
			} else {
				Transforms.removeNodes(editor, { at: path })
				return preventDefault()
			}
		}
		if (!ContemberEditor.hasParentOfType(editor, [element, path], tableElementType)) {
			Transforms.unwrapNodes(editor, { at: path })
			return preventDefault()
		}
		if (path[path.length - 1] > 0 && element.headerScope) {
			Transforms.setNodes(editor, { headerScope: null }, { at: path })
			return preventDefault()
		}
	},
	canContainAnyBlocks: false,
}
