import { useSelector } from 'react-redux'
import type State from '../state'
import { useIdentity } from '../components'
import { useMemo } from 'react'

export type ProjectUserRoles = Set<string>

export const useProjectUserRoles = (): ProjectUserRoles => {
	const identity = useIdentity()
	const projectSlug = useSelector<State, string | undefined>(state => state.request?.project)
	return useMemo(() => {
		if (!projectSlug) {
			return new Set()
		}
		const targetProject = identity.projects.find(project => project.slug === projectSlug)
		if (targetProject === undefined) {
			return new Set()
		}

		return new Set(targetProject.roles)
	}, [identity.projects, projectSlug])
}
