// Uncomment to see what caused re-renders
// Note: Does not work with pages containing content editor
// import './wdyr' // THIS MUST BE THE FIRST IMPORT!

import { ApplicationEntrypoint, Pages, runReactApp } from '@contember/admin'
import { Layout } from './components/Layout'
import './index.sass'

runReactApp(
	<ApplicationEntrypoint
		apiBaseUrl={import.meta.env.VITE_CONTEMBER_ADMIN_API_BASE_URL as string}
		sessionToken={import.meta.env.VITE_CONTEMBER_ADMIN_SESSION_TOKEN as string}
		project={'admin-sandbox'}
		stage={'live'}
		basePath={import.meta.env.BASE_URL}
		children={<Pages layout={Layout} children={import.meta.glob('./pages/**/*.tsx')} />}
	/>,
)
