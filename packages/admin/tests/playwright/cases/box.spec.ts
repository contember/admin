import { SchemaDefinition as def } from '@contember/schema-definition/dist/src/model'
import { expect, test } from '@playwright/test'
import { expectNoConsoleErrors, initContemberProject } from '../utils'

namespace Model {
	export class Dummy {
		dummy = def.stringColumn()
	}
}

let projectSlug: string

test.beforeAll(async ({}, testInfo) => {
	projectSlug = await initContemberProject(testInfo, Model)
})

test('box: basic test', async ({ page }) => {
	expectNoConsoleErrors(page)

	await page.goto(`/${projectSlug}/box`)
	await page.waitForLoadState('networkidle') // wait for fonts
	await page.waitForTimeout(200)
	expect(await page.screenshot()).toMatchSnapshot('initial.png')
})


test('box: direction', async ({ page }) => {
	expectNoConsoleErrors(page)

	await page.goto(`/${projectSlug}/boxDirection`)
	await page.waitForLoadState('networkidle') // wait for fonts
	await page.waitForTimeout(200)
	expect(await page.screenshot()).toMatchSnapshot('boxDirection.png')
})

test('box: intent', async ({ page }) => {
	expectNoConsoleErrors(page)

	await page.goto(`/${projectSlug}/boxIntent`)
	await page.waitForLoadState('networkidle') // wait for fonts
	await page.waitForTimeout(200)
	expect(await page.screenshot()).toMatchSnapshot('boxIntent.png')
})
