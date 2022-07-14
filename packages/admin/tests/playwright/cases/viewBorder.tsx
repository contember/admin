import { Layout, LayoutPage, StyleProvider, View } from '../../../src'

export default function () {
	return (
		<StyleProvider>
			<Layout>
				<LayoutPage pageContentLayout="stretch">
					<strong>Border</strong>
					<View border>border</View>
					<View backgroundColor border>bg + border</View>
					<View backgroundColor border padding>bg + border + padding</View>
					<View border padding="small">border + padding-small</View>
					<View border padding="large">border + padding-large</View>
					<View border padding="xlarge">border + padding-xlarge</View>
					<View backgroundColor="orange" border padding borderRadius>padding + borderRadius</View>
					<View backgroundColor="orange" border padding borderRadius="border">padding + borderRadius=border</View>
					<View backgroundColor="orange" border padding borderRadius="small">padding + borderRadius=small</View>
					<View backgroundColor="orange" border padding borderRadius="large">padding + borderRadius=large</View>
					<View backgroundColor="orange" border padding borderRadius="xlarge">padding + borderRadius=xlarge</View>
					<View backgroundColor="lightblue" borderColor="pink" borderWidth="5px" border padding borderRadius="xlarge">padding + borderRadius=xlarge</View>
				</LayoutPage>
			</Layout>
		</StyleProvider>
	)
}
