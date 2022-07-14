import { Fragment } from 'react'
import { Layout, LayoutPage, StyleProvider, supportedClassNameEnums, View } from '../../../src'
import { viewTestFactory } from '../assets/viewTestFactory'

export default function () {
	return (
		<StyleProvider>
			<Layout>
				<LayoutPage pageContentLayout="stretch">
					<strong>Display</strong>
					{supportedClassNameEnums.display.map(display => <Fragment key={display}>
						<strong>{display}</strong>
						<View display={display} align="center">{viewTestFactory({ display: 'inline-block' })}</View>
					</Fragment>)}
				</LayoutPage>
			</Layout>
		</StyleProvider>
	)
}
