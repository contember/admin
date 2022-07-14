import { Button, FieldContainer, Layout, LayoutPage, RepeaterItemContainer, Stack, StyleProvider } from '@contember/ui'

const dummyInput = (
	<div style={{ backgroundColor: 'lightBlue', border: '1px solid blue', borderRadius: '0.25em', height: '2.25em', minWidth: '10em' }}></div>
)

const Handle = () => <>=</>

const addButton = <Button distinction="seamless" justification="justifyStart">+ Add new item</Button>

export default function () {
	return (
		<StyleProvider>
			<Layout>
				<LayoutPage title="Repeater Item Container">
					<Stack direction="horizontal" align="flex-start" wrap>
						<RepeaterItemContainer dragHandleComponent={Handle}>
							{dummyInput}
							{dummyInput}
							{dummyInput}
						</RepeaterItemContainer>
						<RepeaterItemContainer>
							{dummyInput}
							{dummyInput}
							{dummyInput}
						</RepeaterItemContainer>
						<RepeaterItemContainer dragHandleComponent={Handle} label="Lorem ipsum">
							{dummyInput}
							{dummyInput}
							{dummyInput}
						</RepeaterItemContainer>
					</Stack>

					<FieldContainer useLabelElement={false} footer={addButton} label="Horizontal Repeater" gap="border" direction="horizontal" wrap>
						<RepeaterItemContainer compact dragHandleComponent={Handle} label="Lorem ipsum">
							{dummyInput}
						</RepeaterItemContainer>
						<RepeaterItemContainer compact dragHandleComponent={Handle} label="Lorem ipsum">
							{dummyInput}
						</RepeaterItemContainer>
						<RepeaterItemContainer compact dragHandleComponent={Handle} label="Lorem ipsum">
							{dummyInput}
						</RepeaterItemContainer>
					</FieldContainer>

					<FieldContainer useLabelElement={false} footer={addButton} label="Vertical Repeater" gap="border">
						<RepeaterItemContainer compact dragHandleComponent={Handle} label="Lorem ipsum">
							{dummyInput}
						</RepeaterItemContainer>
						<RepeaterItemContainer compact dragHandleComponent={Handle} label="Lorem ipsum">
							{dummyInput}
						</RepeaterItemContainer>
						<RepeaterItemContainer compact dragHandleComponent={Handle} label="Lorem ipsum">
							{dummyInput}
						</RepeaterItemContainer>
					</FieldContainer>
				</LayoutPage>
			</Layout>
		</StyleProvider>
	)
}
