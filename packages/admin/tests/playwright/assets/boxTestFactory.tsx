import { Box, BoxProps, Button, TextInput } from '../../../src'

const action = <Button>Add</Button>
const input = <TextInput />

export function boxTestFactory(props: Partial<BoxProps>) {
	return (
    <>
      <Box {...props}>
        {input}
      </Box>

      <Box heading="Just box" {...props}>
        {input}
      </Box>

      <Box actions={action} heading="Box + action" {...props}>
        {input}
      </Box>

      <Box isActive actions={action} heading="Box is active" {...props}>
        {input}
      </Box>

      <Box distinction="seamless" actions={action} heading="Seamless + action" {...props}>
        {input}
      </Box>

      <Box distinction="seamless" padding="with-padding" actions={action} heading="Seamless + action + padding" {...props}>
        {input}
      </Box>
    </>
  )
}
