import { ChangeEvent, forwardRef, memo, Ref, useCallback, useEffect, useMemo, useRef } from 'react'
import { Stack } from '../../Stack'
import { assertDatetimeString, splitDatetime } from './Serializer'
import { DateTimeInputProps } from './Types'

export const FallbackDateTimeInput = memo(
	forwardRef(({ size, distinction, max, min, onChange, validationState, withTopToolbar, value, ...rest }: DateTimeInputProps, ref: Ref<HTMLInputElement>) => {
		if (value) {
			assertDatetimeString(value)
		}

		if (max) {
			assertDatetimeString(max)
		}

		if (min) {
			assertDatetimeString(min)
		}

		const [maxDate, maxTime] = useMemo(() => splitDatetime(max), [max])
		const [minDate, minTime] = useMemo(() => splitDatetime(min), [min])
		const [valueDate, valueTime] = useMemo(() => splitDatetime(value), [value])

		const date = useRef<string>(valueDate)
		const time = useRef<string>(valueTime)

		useEffect(() => {
			date.current = valueDate
			time.current = valueTime
		}, [valueDate, valueTime])

		const maybeCallOnChange = useCallback(() => {
			const newValue = date.current && time.current ? `${date.current}T${time.current}` : ''

			if (newValue !== value) {
				onChange?.(newValue)
			}
		}, [onChange, value])

		const onDateChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
			date.current = event.target.value
			maybeCallOnChange()
		}, [maybeCallOnChange])

		const onTimeChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
			time.current = event.target.value
			maybeCallOnChange()
		}, [maybeCallOnChange])

		return <>
			<Stack direction="horizontal">
				<input
					ref={ref}
					max={maxDate}
					min={minDate}
					onChange={onDateChange}
					value={valueDate}
					{...rest}
					placeholder={rest.placeholder ?? undefined}
					type="date"
				/>
				<input
					max={date.current && date.current === maxDate ? maxTime : ''}
					min={date.current && date.current === minDate ? minTime : ''}
					onChange={onTimeChange}
					value={valueTime}
					{...rest}
					placeholder={undefined}
					type="time"
				/>
			</Stack>
    </>
	}),
)
FallbackDateTimeInput.displayName = 'FallbackDateTimeInput'
