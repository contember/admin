import type { ToolbarButtonSpec } from '../../../toolbars'
import { strikeThroughMark } from './strikeThroughMark'

export const strikeThroughToolbarButton: ToolbarButtonSpec = {
	marks: { [strikeThroughMark]: true },
	label: 'Strikethrough',
	title: 'Strikethrough',
	blueprintIcon: 'strikethrough',
}
