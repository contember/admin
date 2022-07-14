import { Fragment } from 'react'
import { Layout, LayoutPage, StyleProvider, supportedClassNameEnums, View } from '../../../src'
import { viewTestFactory } from '../assets/viewTestFactory'

export default function () {
	return (
		<StyleProvider>
			<Layout>
				<LayoutPage pageContentLayout="stretch">
					<strong>Padding</strong>
					{supportedClassNameEnums.padding.map(padding => <Fragment key={padding}>
						<strong>{padding}</strong>
						<View padding={padding} border borderRadius gap display="flex">{viewTestFactory({ flex: 1, maxWidth: 'auto' })}</View>
					</Fragment>)}
				</LayoutPage>
			</Layout>
		</StyleProvider>
	)
}
