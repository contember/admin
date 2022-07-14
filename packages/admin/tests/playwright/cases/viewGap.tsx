import { Layout, LayoutPage, StyleProvider, supportedClassNameEnums, View } from '../../../src'
import { viewTestFactory } from '../assets/viewTestFactory'

export default function () {
	return (
		<StyleProvider>
			<Layout>
				<LayoutPage pageContentLayout="stretch">
					<strong>Gap</strong>
					<View display="flex" align="center">(none) {viewTestFactory({})}</View>
					<View gap display="flex" align="center">true: {viewTestFactory({})}</View>
					<View gap="44px" display="flex" align="center">44px: {viewTestFactory({})}</View>
					<View gap="10%" display="flex" align="center">10%: {viewTestFactory({})}</View>
					{supportedClassNameEnums.gap.map(gap => (
						<View key={gap} gap={gap} display="flex" align="center">{gap}: {viewTestFactory({})}</View>
					))}
				</LayoutPage>
			</Layout>
		</StyleProvider>
	)
}
