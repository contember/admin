import { FC } from 'react'
import { ElementWithReference } from '../elements'
import { AccessorProvider } from '@contember/binding'
import { useReferencedEntity } from './useReferencedEntity'
import { ReactEditor, useSlateStatic } from 'slate-react'

export const ReferenceElementWrapper: FC<{element: ElementWithReference}> = ({ children, element }) => {
	const editor = useSlateStatic()
	const path = ReactEditor.findPath(editor, element)
	const ref = useReferencedEntity(path, element.referenceId)
	return <AccessorProvider accessor={ref}>{children}</AccessorProvider>
}
