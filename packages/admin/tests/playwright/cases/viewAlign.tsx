import { Layout, LayoutPage, StyleProvider, supportedClassNameEnums, View } from '../../../src'
import { viewTestFactory } from '../assets/viewTestFactory'

export default function () {
	return (
		<StyleProvider>
			<Layout>
				<LayoutPage pageContentLayout="stretch">
					<strong>Align</strong>
					{supportedClassNameEnums.align.map(align => (
						<View backgroundColor="white" key={align} gap display="flex" align={align}>{align}: {viewTestFactory({})}</View>
					))}
				</LayoutPage>
			</Layout>
		</StyleProvider>
	)
}
