import { Button, ButtonProps, toStateClass, toViewClass } from '@contember/ui'
import cn from 'classnames'
import { memo, ReactNode, Ref, useCallback, useRef, useState } from 'react'

export interface ConcealableFieldRendererProps {
	onFocus: () => void
	onBlur: () => void
	inputRef: Ref<HTMLInputElement | undefined>
}

export interface ConcealableFieldProps {
	buttonProps?: ButtonProps
	concealTimeout?: number
	renderConcealedValue: () => ReactNode
	children: (rendererProps: ConcealableFieldRendererProps) => ReactNode
	isExtended?: boolean
	editButtonLabel?: ReactNode
}

export const ConcealableField = memo(
	({ buttonProps, concealTimeout = 2000, renderConcealedValue, isExtended, children }: ConcealableFieldProps) => {
		const [isEditing, setIsEditing] = useState(false)
		const [concealTimeoutId, setConcealTimeoutId] = useState<number | undefined>(undefined)
		const inputRef = useRef<HTMLInputElement>()
		const onFocus = useCallback(() => {
			if (concealTimeoutId !== undefined) {
				clearTimeout(concealTimeoutId)
			}
		}, [concealTimeoutId])
		const onBlur = useCallback(() => {
			setConcealTimeoutId(setTimeout(() => setIsEditing(false), concealTimeout) as any as number)
		}, [concealTimeout])

		return (
			<div className={cn('concealableField', toViewClass('extended', isExtended), toStateClass('editing', isEditing))}>
				<div className={cn('concealableField-field')}>
					{children({
						onBlur,
						onFocus,
						inputRef,
					})}
				</div>
				<div
					className="concealableField-cover"
					onClick={() => {
						setIsEditing(true)
					}}
					key="concealableField-cover"
					onTransitionEnd={e => {
						if (isEditing && inputRef.current && e.currentTarget === e.target) {
							inputRef.current.focus()
						}
					}}
				>
					<div className="concealableField-value">{renderConcealedValue()}</div>
					<Button
						size="small"
						distinction="seamless"
						children="Edit"
						{...buttonProps}
						className="concealableField-button"
					/>
				</div>
			</div>
		)
	},
)
ConcealableField.displayName = 'ConcealableField'
