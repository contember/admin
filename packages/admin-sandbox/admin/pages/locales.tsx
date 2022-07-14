import { MultiEditPage, Stack, TextField, View } from '@contember/admin'

export default () => (
	<MultiEditPage compact entities="Locale" pageName="locales" rendererProps={{ title: 'Languages' }}>
		<Stack wrap direction="horizontal">
			<View span={1}>
				<TextField label="Code" field="code" />
			</View>
			<View span={3}>
				<TextField label="Label" field="label" />
			</View>
		</Stack>
	</MultiEditPage>
)
