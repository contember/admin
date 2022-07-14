import { Box, BoxProps, Button, Layout, LayoutPage, StyleProvider, TextInput } from '../../../src'
import { boxTestFactory } from '../assets/boxTestFactory'

export default function () {
	return (
		<StyleProvider>
			<Layout>
				<LayoutPage title="Box">
					{boxTestFactory({})}
				</LayoutPage>
			</Layout>
		</StyleProvider>
	)
}
