import * as React from 'react'
import { RenderElementProps, useSelected } from 'slate-react'
import { BlockElement } from '../../../baseEditor'
import { HorizontalRuleElement } from './HorizontalRuleElement'

export interface HorizontalRuleRendererProps extends Omit<RenderElementProps, 'element'> {
	element: HorizontalRuleElement
}

export const HorizontalRuleRenderer: React.FunctionComponent<HorizontalRuleRendererProps> = (
	props: HorizontalRuleRendererProps,
) => {
	const isSelected = useSelected()
	return (
		<BlockElement element={props.element} attributes={props.attributes} withBoundaries>
			<span contentEditable={false}>
				<hr
					style={{
						boxShadow: isSelected ? '0 0 0 0.2em rgba(0, 148, 255, 0.3)' : 'none',
						backgroundColor: isSelected ? 'black' : undefined,
					}}
				/>
			</span>
			{props.children}
		</BlockElement>
	)
}
HorizontalRuleRenderer.displayName = 'HorizontalRuleRenderer'