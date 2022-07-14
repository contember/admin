import { EditPage, MultiEditPage, Repeater, SelectField, SideDimensions, TextField, View } from '@contember/admin'

export default () => (
	<EditPage entity="Tag(id = $id)" rendererProps={{ title: 'Tag' }}>
		<SideDimensions
					dimension="locale"
					variableName="currentLocaleCode"
					// hasOneField="category"
					variables={currentLocaleCode => {
						return {
							labelMiddleware: label => (
								<>
									{label} ({currentLocaleCode})
								</>
							),
						}
					}}
				>

			<TextField field={'name'} label={'Name'} />

			</SideDimensions>

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

	</EditPage>
)
