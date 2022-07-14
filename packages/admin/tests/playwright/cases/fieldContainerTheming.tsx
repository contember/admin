import { Button, Icon, TextInput, View } from '@contember/ui'
import { fieldContainerTestFactory } from '../assets/fieldContainerTestFactory'

export default function () {
	return fieldContainerTestFactory('default', {
		align: 'center',
		direction: 'horizontal',
		border: true,
		backgroundColor: true,
		purpose: 'above',
		borderRadius: true,
		padding: 'none',
		theme: 'success',
		states: ['focus', 'hover'],
		children: <>
			<View align="center" padding="small" basis={0}>+420</View>
			<View span={7} basis={0}>
				<TextInput distinction="seamless-with-padding" placeholder="XXX XXX XXX" style={{ paddingLeft: 0 }} />
			</View>
			<Button intent="default" distinction="seamless" size="small" style={{ marginRight: 'var(--cui-gap-horizontal)' }}><Icon blueprintIcon="cross" /></Button>
		</>,
	})
}
