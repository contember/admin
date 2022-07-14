import { Fragment } from 'react'
import { Box, Button, Icon, Layout, LayoutPage, Stack, StyleProvider, supportedClassNameEnums, TextInput } from '../../../src'
import { boxTestFactory } from '../assets/boxTestFactory'

export default function () {
	return (
		<StyleProvider>
			<Layout>
				<LayoutPage title="Box Direction">
					<strong>Button at the end</strong>
					<Box
						heading="Swapped"
						direction="horizontal"
						maxWidth="min-content"
					>
						<TextInput />
						<Button flow="circular" distinction="seamless" intent="danger"><Icon blueprintIcon="trash" /></Button>
					</Box>
					{supportedClassNameEnums.direction.map(direction => (
						<Fragment key={direction}>
							<strong>{direction}</strong>
							<Stack direction="horizontal" align="flex-start">
								{boxTestFactory({ direction })}
							</Stack>
						</Fragment>
					))}
				</LayoutPage>
			</Layout>
		</StyleProvider>
	)
}
