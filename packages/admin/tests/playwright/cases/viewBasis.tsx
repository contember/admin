import { Fragment } from 'react'
import { Layout, LayoutPage, Stack, StyleProvider, supportedClassNameEnums, View, ViewProps } from '../../../src'
import { viewTestFactory } from '../assets/viewTestFactory'

const contentFactory = (basis?: ViewProps['basis']) => (<>
	<View backgroundColor="white" display="flex" direction="horizontal" gap="small" span shrink wrap basis={basis}>Cell 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod&hellip; <div style={{ minWidth: '200px', backgroundColor: 'orange', height: '1em' }}></div></View>
	<View backgroundColor="white" display="flex" direction="horizontal" gap="small" span shrink wrap>Cell 2: {viewTestFactory({})}</View>
	<View backgroundColor="white" display="flex" direction="horizontal" gap="small" span shrink wrap>Cell 3: {viewTestFactory({})}</View>
</>)

export default function () {
	return (
		<StyleProvider>
			<Layout>
				<LayoutPage pageContentLayout="stretch">
					<strong>Basis: default</strong>
					<Stack gap span direction="horizontal">{contentFactory()}</Stack>

					<strong>Basis: 50px</strong>
					<Stack gap span direction="horizontal">{contentFactory('50px')}</Stack>

					<strong>Basis: 300px</strong>
					<Stack gap span direction="horizontal">{contentFactory('300px')}</Stack>

					{supportedClassNameEnums.basis.map(basis => <Fragment key={basis}>
						<strong>Basis: {basis}</strong>
						<Stack gap span direction="horizontal">{contentFactory(basis)}</Stack>
					</Fragment>)}
				</LayoutPage>
			</Layout>
		</StyleProvider>
	)
}
