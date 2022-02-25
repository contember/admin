import {
	Component,
	Environment,
	Field,
	SugaredRelativeSingleField,
	useDerivedField,
	useEnvironment,
} from '@contember/binding'
import { SlugInput, TextInputProps } from '@contember/ui'
import slugify from '@sindresorhus/slugify'
import { useCallback, useMemo } from 'react'
import type { SimpleRelativeSingleFieldProps } from '../auxiliary'
import { SimpleRelativeSingleField } from '../auxiliary'
import {
	stringFieldParser,
	useFieldControl,
} from './useFieldControl'

type SlugPrefix = string | ((environment: Environment) => string)

export type SlugFieldProps =
	& SimpleRelativeSingleFieldProps
	& Omit<TextInputProps, 'value' | 'onChange' | 'validationState' | 'allowNewlines'>
	& {
		derivedFrom: SugaredRelativeSingleField['field']
		unpersistedHardPrefix?: SlugPrefix
		persistedHardPrefix?: SlugPrefix
		persistedSoftPrefix?: SlugPrefix
		linkToExternalUrl?: boolean
	}

const useNormalizedPrefix = (value?: SlugPrefix) => {
	const environment = useEnvironment()
	return useMemo(() => typeof value === 'function' ? value(environment) : value ?? '', [value, environment])
}

export const SlugField = Component<SlugFieldProps>(
	props => <SlugFieldInner {...props}/>,
	props => <>
		<Field field={props.derivedFrom} />
		<SlugFieldInner {...props} />
	</>,
)

export const SlugFieldInner = SimpleRelativeSingleField<SlugFieldProps, string>(
	(fieldMetadata, {
		name,
		label,
		unpersistedHardPrefix,
		persistedHardPrefix,
		persistedSoftPrefix,
		linkToExternalUrl,
		derivedFrom,
		field,
		...props
	}) => {
		const normalizedUnpersistedHardPrefix = useNormalizedPrefix(unpersistedHardPrefix)
		const normalizedPersistedHardPrefix = useNormalizedPrefix(persistedHardPrefix)
		const normalizedPersistedSoftPrefix = useNormalizedPrefix(persistedSoftPrefix)

		const inputProps = useFieldControl<string, string>({
			...props,
			fieldMetadata,
			parse: (val, field) => {
				const parsedValue = stringFieldParser(val, field)
				return parsedValue !== null ? `${normalizedPersistedHardPrefix}${parsedValue}` : null
			},
			format: value => typeof value === 'string' ? value.substring(normalizedPersistedHardPrefix.length) : '',
			type: 'text',
		})
		const transform = useCallback(
			(driverFieldValue: string | null) => {
				if (driverFieldValue === null) {
					return null
				}

				const slugValue = slugify(driverFieldValue)

				return `${normalizedPersistedHardPrefix}${normalizedPersistedSoftPrefix}${slugValue}`
			},
			[normalizedPersistedHardPrefix, normalizedPersistedSoftPrefix],
		)
		useDerivedField<string>(derivedFrom, field, transform)

		const hardPrefix = normalizedUnpersistedHardPrefix + normalizedPersistedHardPrefix
		const fullValue = hardPrefix + inputProps.value

		return (
			<SlugInput
				{...inputProps}
				prefix={hardPrefix}
				link={linkToExternalUrl ? fullValue : undefined}
			/>
		)
	},
	'SlugField',
)
