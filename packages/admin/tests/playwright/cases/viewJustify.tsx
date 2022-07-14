import { Layout, LayoutPage, StyleProvider, supportedClassNameEnums, View } from '../../../src'
import { viewTestFactory } from '../assets/viewTestFactory'

export default function () {
	return (
		<StyleProvider>
			<Layout>
				<LayoutPage pageContentLayout="stretch">
					<strong>Justify</strong>
					{supportedClassNameEnums.justify.map(justify => (
						<View backgroundColor="white" key={justify} gap display="flex" justify={justify}>{justify}: {viewTestFactory(justify === 'stretch' ? { width: 'auto', maxWidth: 'auto', minWidth: 'auto', flexGrow: 1 } : {})}</View>
					))}
				</LayoutPage>
			</Layout>
		</StyleProvider>
	)
}
