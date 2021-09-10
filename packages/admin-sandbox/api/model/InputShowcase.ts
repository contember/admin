import { SchemaDefinition as d } from '@contember/schema-definition'

import { One } from './One'

export const SomeEnum = d.createEnum('a', 'b', 'c')

export class InputShowcase {
	unique = d.enumColumn(One).notNull().unique()
	textValue = d.stringColumn()
	slugValue = d.stringColumn()
	multilineValue = d.stringColumn()
	boolValue = d.boolColumn()
	intValue = d.intColumn()
	floatValue = d.doubleColumn()
	dateValue = d.dateColumn()
	dateTimeValue = d.dateTimeColumn()
	gpsLatValue = d.doubleColumn()
	gpsLonValue = d.doubleColumn()
	enumValue = d.enumColumn(SomeEnum)
	selectValue = d.enumColumn(SomeEnum)
}