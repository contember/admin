import * as React from 'react'
import { RenderElementProps } from 'slate-react'
import { TableRowElement } from './TableRowElement'

export interface TableRowElementRendererProps extends Omit<RenderElementProps, 'element'> {
	element: TableRowElement
}

export const TableRowElementRenderer = React.memo(function TableRowElementRenderer(
	props: TableRowElementRendererProps,
) {
	return (
		<div {...props.attributes} style={{ display: 'contents' }}>
			{props.children}
		</div>
	)
})