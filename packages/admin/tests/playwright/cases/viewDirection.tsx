import { Fragment } from 'react'
import { Layout, LayoutPage, StyleProvider, supportedClassNameEnums, View } from '../../../src'
import { viewTestFactory } from '../assets/viewTestFactory'

export default function () {
	return (
		<StyleProvider>
			<Layout>
				<LayoutPage pageContentLayout="stretch">
					<strong>Direction</strong>
					{supportedClassNameEnums.direction.map(direction => <Fragment key={direction}>
						<strong>{direction}</strong>
						<View direction={direction} display="flex" align="center">{viewTestFactory({})}</View>
					</Fragment>)}
				</LayoutPage>
			</Layout>
		</StyleProvider>
	)
}
