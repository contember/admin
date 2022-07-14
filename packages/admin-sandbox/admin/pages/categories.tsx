import { Component, MultiEditPage, Repeater, SideDimensions, TextField, View } from '@contember/admin'

export const CategoryForm = Component(() => <>
	<View span={1}>
		<TextField field={'name'} label={'Name'} />
	</View>
	<View span={2}>
		<Repeater
			compact
			scrollable
			direction="horizontal"
			field={'locales'}
			label={'Locales'}
			orderBy={'id'}
		>
				{/* <View span={2}>
					<SelectField label={'Locale'} options={'Locale.code'} field={'locale'} createNewForm={<TextField field={'code'} label={'Locale code'} />} />
				</View>
				<View span={1}>
					<TextField width="fluid" field={'name'} label={'Name'} />
				</View> */}

				<SideDimensions
					dimension="locale"
					variableName="currentLocaleCode"
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
					<TextField width="fluid" field={'name'} label={'Name'} />
				</SideDimensions>
		</Repeater>
	</View>
</>)


export default () => (
	<MultiEditPage
		entities="Category"
		rendererProps={{
			fit: 'none',
			pageContentLayout: 'start',
			sortableBy: 'order',
			title: 'Categories',
		}}
	>
		<CategoryForm/>
	</MultiEditPage>
)
