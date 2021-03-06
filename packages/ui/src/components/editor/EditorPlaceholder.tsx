import type { ComponentType, ReactNode } from 'react'
import { useClassNamePrefix } from '../../auxiliary'
import { EditorNonEditable } from './EditorNonEditable'

export interface EditorPlaceholderProps {
	children: ReactNode
}

// TODO add this to storybook
export const EditorPlaceholder: ComponentType<EditorPlaceholderProps> = props => (
	<EditorNonEditable className={`${useClassNamePrefix()}editorPlaceholder`} inline>
		{props.children}
	</EditorNonEditable>
)
EditorPlaceholder.displayName = 'EditorPlaceholder'
