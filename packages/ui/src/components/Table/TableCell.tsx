import {
	ReactNode,
	ReactElement,
	useMemo,
	useCallback,
	useEffect,
	useRef,
	ComponentType,
	MouseEvent as ReactMouseEvent,
	memo,
	useState,
	useContext,
} from 'react'
import { useComponentClassName } from '../../auxiliary'
import { Alignment, Justification } from '../../types'
import cn from 'classnames'
import { toEnumViewClass, toViewClass } from '../../utils'
import { UseTableElementContext } from './Table'

export interface TableCellProps {
	children?: ReactNode
	alignment?: Alignment
	justification?: Justification
	shrunk?: boolean
	numeric?: boolean
	colSpan?: number
}

export const TableCell = memo(({ shrunk = false, numeric = false, ...props }: TableCellProps) => {
	const useTableElement = useContext(UseTableElementContext)
	const className = cn(
		useComponentClassName('table-cell'),
		toEnumViewClass(props.alignment),
		toEnumViewClass(props.justification),
		toViewClass('numeric', numeric),
		toViewClass('shrunk', shrunk),
	)

	if (useTableElement) {
		return (
			<td className={className} colSpan={props.colSpan}>
				{props.children}
			</td>
		)
	}
	return <div className={className}>{props.children}</div>
})
TableCell.displayName = 'TableCell'
