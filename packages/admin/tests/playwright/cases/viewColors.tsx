import { useMemo, useState } from 'react'
import { Button, Layout, LayoutPage, StyleProvider, supportedClassNameEnums, View } from '../../../src'

export default function () {
	const [refreshed, setRefreshed] = useState(1)

	return (
		<StyleProvider>
			<Layout>
				<LayoutPage
					pageContentLayout="stretch"
					actions={<Button
						onClick={() => {
							setRefreshed(refreshed + 1)
						}}
						>Redraw</Button>
					}
				>
					<strong>Colors</strong>
					<View>No props: inherits</View>
					<View backgroundColor purpose="filled-primary-control" hoverProps={useMemo(() => ({ theme: 'danger' }), [])}>true</View>
					<View padding backgroundColor="red">red</View>
					<View padding backgroundColor="#C94" focusProps={useMemo(() => ({ elevation: true }), [])}>#C94</View>
					<View padding backgroundColor="#04C" color="white">#04C + white color</View>
					<View padding elevation backgroundColor borderRadius hoverProps={useMemo(() => ({ purpose: 'above' }), [])}>elevation</View>
					{supportedClassNameEnums.purpose.map(purpose => (
							<div key={purpose} style={{ display: 'flex' }}>
								<View padding="small" key={`${purpose}`} backgroundColor purpose={purpose}>
									{purpose}
								</View>

								{supportedClassNameEnums.color.map(color => (
									<View padding="small" key={`${purpose}-${color}`} backgroundColor purpose={purpose} color={color}>
										{purpose}-{color}
									</View>
								))}
							</div>
					))}
				</LayoutPage>
			</Layout>
		</StyleProvider>
	)
}
