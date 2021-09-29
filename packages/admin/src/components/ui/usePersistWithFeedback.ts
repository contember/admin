import { ErrorPersistResult, PersistOptions, SuccessfulPersistResult, usePersist } from '@contember/binding'
import { useCallback } from 'react'
import { useMessageFormatter } from '../../i18n'
import { persistFeedbackDictionary } from './persistFeedbackDictionary'
import { useShowToast } from '../Toaster'

export interface PersistWithFeedbackOptions extends PersistOptions {
	successMessage?: string
	successDuration?: number

	errorMessage?: string
	errorDuration?: number

	afterPersistErrorMessage?: string
	afterPersistErrorDuration?: number
}

export const usePersistWithFeedback = ({
	successMessage,
	successDuration,
	errorMessage,
	errorDuration,
	afterPersistErrorMessage,
	afterPersistErrorDuration,
	...persistOptions
}: PersistWithFeedbackOptions = {}) => {
	const persistAll = usePersist()
	const showToast = useShowToast()
	const formatMessage = useMessageFormatter(persistFeedbackDictionary)

	return useCallback((): Promise<SuccessfulPersistResult> => {
		return persistAll(persistOptions)
			.then(result => {
				console.debug('persist success', result)
				showToast(
					{
						type: 'success',
						message: formatMessage(successMessage, 'persistFeedback.successMessage'),
						dismiss: successDuration ?? true,
					},
				)
				if (result.type === 'justSuccess' && result.afterPersistError) {
					showToast(
						{
							type: 'error',
							message: formatMessage(afterPersistErrorMessage, 'persistFeedback.afterPersistErrorMessage'),
							dismiss: afterPersistErrorDuration ?? true,
						},
					)
				}
				return result
			})
			.catch((result: ErrorPersistResult) => {
				console.debug('persist error', result)
				showToast(
					{
						type: 'error',
						message: formatMessage(errorMessage, 'persistFeedback.errorMessage'),
						dismiss: errorDuration ?? true,
					},
				)
				return Promise.reject(result)
			})
	}, [
		persistAll,
		persistOptions,
		showToast,
		formatMessage,
		successMessage,
		successDuration,
		errorMessage,
		errorDuration,
		afterPersistErrorDuration,
		afterPersistErrorMessage,
	])
}
