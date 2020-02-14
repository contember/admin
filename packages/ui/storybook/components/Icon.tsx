import { IconSvgPaths16 } from '@blueprintjs/icons'
import { color, number, select } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { BlueprintIconName, ContemberIconName, Icon } from '../../src'
import { iconSizeKnob } from '../utils/knobs'
import * as ContemberIcons from '../../src/components/Icon/contemberIcons'

const blueprintIconNames = Object.keys(IconSvgPaths16) as BlueprintIconName[]
const contemberIconNames = Object.keys(ContemberIcons) as ContemberIconName[]

const iconStory = (type: 'blueprint' | 'contember') => {
	let icon: React.ReactNode

	if (type === 'blueprint') {
		const iconName = select<BlueprintIconName>('Blueprint icon name', blueprintIconNames, blueprintIconNames[0])
		const size = iconSizeKnob()
		icon = <Icon blueprintIcon={iconName} size={size} />
	} else if (type === 'contember') {
		const iconName = select<ContemberIconName>('Contember icon name', contemberIconNames, contemberIconNames[0])
		const size = iconSizeKnob()
		icon = <Icon contemberIcon={iconName} size={size} />
	}
	const fontSize = number('Font size', 96, {
		range: true,
		min: 12,
		max: 160,
		step: 1,
	})
	const fontColor = color('Font color', '#000000')

	return (
		<div style={{ color: fontColor }}>
			<h1>Standalone:</h1>
			<div
				style={{
					fontSize: `${fontSize / 16}rem`,
				}}
			>
				{icon}
			</div>
			<h1>Within text:</h1>
			<div
				style={{
					fontSize: `${fontSize / 16}rem`,
				}}
			>
				Lorem ipsum {icon} dolor sit icon.
			</div>
		</div>
	)
}

storiesOf('Icon', module)
	.add('blueprint icon', () => {
		return (
			<>
				{iconStory('blueprint')}
				<hr />
				<h1>
					<a href="https://blueprintjs.com/docs/#icons" target="_blank" rel="noopener noreferrer">
						Blueprint icon names <Icon blueprintIcon="arrow-top-right" size="lowercase" />
					</a>
				</h1>
			</>
		)
	})
	.add('contember icon', () => iconStory('contember'))
