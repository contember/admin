import { BoxProps, Layout, LayoutPage, Stack, StyleProvider } from '../../../src'
import { boxTestFactory } from '../assets/boxTestFactory'

const intentsEnum: BoxProps['intent'][] = ['default', 'primary', 'secondary', 'tertiary', 'positive', 'success', 'warn', 'danger']

export default function () {
	return (
		<StyleProvider>
			<Layout>
				<LayoutPage title="Box Intent">
					<Stack direction="horizontal">
						{intentsEnum.map(intent => (
							<Stack key={intent} direction="vertical">
								<strong>{intent}</strong>
								{boxTestFactory({ intent })}
							</Stack>
						))}
					</Stack>
				</LayoutPage>
			</Layout>
		</StyleProvider>
	)
}
