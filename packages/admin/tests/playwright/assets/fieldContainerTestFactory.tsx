import { Button, Divider, FieldContainer, FieldContainerProps, Layout, LayoutPage, StyleProvider, TextInput } from '../../../src'

const dummyInput = (
	<TextInput style={{ minWidth: '2.25em' }} />
)

export function fieldContainerTestFactory (position: FieldContainerProps['labelPosition'], props?: Partial<FieldContainerProps>) {
  return (
		<StyleProvider>
			<Layout>
				<LayoutPage title={`FieldContainer/labelPosition: ${position}`}>
					<FieldContainer
						{...props}
						label="Lorem ipsum"
						labelPosition={position}
					>{props?.children ?? dummyInput}</FieldContainer>

					<Divider />

					<FieldContainer
						{...props}
						label="Lorem ipsum"
						description="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
						labelPosition={position}
					>{props?.children ?? dummyInput}</FieldContainer>

					<Divider />

					<FieldContainer
						{...props}
						label="Lorem ipsum"
						description="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
						labelPosition={position}
						footer={<Button>Footer button</Button>}
					>{props?.children ?? dummyInput}</FieldContainer>

					<Divider />

					<FieldContainer
						{...props}
						label="Lorem ipsum"
						labelDescription="Lorem ipsum dolor sit amet"
						description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
						labelPosition={position}
					>{props?.children ?? dummyInput}</FieldContainer>

					<Divider />

					<FieldContainer
						{...props}
						label="Lorem ipsum"
						labelDescription="Lorem ipsum dolor sit amet"
						description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
						labelPosition={position}
						errors={[{ message: 'This field needs to have value' }]}
					>{props?.children ?? dummyInput}</FieldContainer>

					<Divider />

					<FieldContainer
						{...props}
						label="Lorem ipsum"
						labelDescription="Lorem ipsum dolor sit amet"
						description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
						labelPosition={position}
						footer={<Button>Footer button</Button>}
						errors={[{ message: 'This field needs to have value' }]}
					>{props?.children ?? dummyInput}</FieldContainer>
				</LayoutPage>
			</Layout>
		</StyleProvider>
	)
}
