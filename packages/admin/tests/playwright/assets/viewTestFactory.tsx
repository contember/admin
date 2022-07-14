import { CSSProperties } from 'react'

export const viewTestFactory = ({ display = 'block', ...props }: CSSProperties) => <>
	<div style={{ display, backgroundColor: 'lightBlue', border: '1px solid blue', borderRadius: '0.25em', minHeight: '1em', minWidth: '1em', maxWidth: '5em', ...props }}></div>
	<div style={{ display, backgroundColor: 'lightBlue', border: '1px solid blue', borderRadius: '0.25em', minHeight: '1.5em', minWidth: '1.5em', maxWidth: '5em', ...props }}></div>
	<div style={{ display, backgroundColor: 'lightBlue', border: '1px solid blue', borderRadius: '0.25em', minHeight: '2em', minWidth: '2em', maxWidth: '5em', ...props }}></div>
</>
