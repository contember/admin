import { Icon, LinkButton, MultiEditPage, Repeater, SelectField, TextField, View } from '@contember/admin'

export default () => (
	<MultiEditPage
		compact
		scrollable
		entities="Tag"
		rendererProps={{
			title: 'Tags',
			pageContentLayout: 'start',
			containerComponentExtraProps: {
				maxHeight: '--cui-page-content-height',
			},
			itemComponentExtraProps: {
				actions: <LinkButton flow="circular" size="small" distinction="seamless" to="tagEdit(id: $entity.id)"><Icon blueprintIcon="edit" /></LinkButton>,
			},
		}}
	>
		<View span={1}>
			<TextField field={'name'} label={'Name'} />
		</View>
		<View span={2}>
			<Repeater compact field={'locales'} label={'Locales'} sortableBy={'order'}>
				<SelectField
					labelPosition="labelLeft"
					label={'Locale'}
					options={'Locale.code'}
					field={'locale'}
					createNewForm={<TextField field={'code'} label={'Locale code'} />}
				/>
				<TextField
					labelPosition="labelLeft"
					field={'name'} label={'Name'}
				/>
			</Repeater>
		</View>
	</MultiEditPage>
)
