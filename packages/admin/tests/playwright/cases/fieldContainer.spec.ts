import { SchemaDefinition as def } from '@contember/schema-definition'
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

test('field container: basic test', async ({ page }) => {
	expectNoConsoleErrors(page)

	await page.goto(`/${projectSlug}/fieldContainer`)
	await page.waitForLoadState('networkidle') // wait for fonts
	await page.waitForTimeout(200)
	expect(await page.screenshot()).toMatchSnapshot('initial.png')
})

test('field container: label left test', async ({ page }) => {
	expectNoConsoleErrors(page)
	await page.goto(`/${projectSlug}/fieldContainerLabelLeft`)
	await page.waitForLoadState('networkidle') // wait for fonts
	await page.waitForTimeout(200)
	expect(await page.screenshot()).toMatchSnapshot('labelLeft.png')
})

test('field container: label right test', async ({ page }) => {
	expectNoConsoleErrors(page)
	await page.goto(`/${projectSlug}/fieldContainerLabelRight`)
	await page.waitForLoadState('networkidle') // wait for fonts
	await page.waitForTimeout(200)
	expect(await page.screenshot()).toMatchSnapshot('labelRight.png')
})

test('field container: label inline left test', async ({ page }) => {
	expectNoConsoleErrors(page)
	await page.goto(`/${projectSlug}/fieldContainerLabelInlineLeft`)
	await page.waitForLoadState('networkidle') // wait for fonts
	await page.waitForTimeout(200)
	expect(await page.screenshot()).toMatchSnapshot('labeInlineLeft.png')
})

test('field container: label inline right test', async ({ page }) => {
	expectNoConsoleErrors(page)
	await page.goto(`/${projectSlug}/fieldContainerLabelInlineRight`)
	await page.waitForLoadState('networkidle') // wait for fonts
	await page.waitForTimeout(200)
	expect(await page.screenshot()).toMatchSnapshot('labelInlineRight.png')
})

test('field container: theming test', async ({ page }) => {
	expectNoConsoleErrors(page)
	await page.goto(`/${projectSlug}/fieldContainerTheming`)
	await page.waitForLoadState('networkidle') // wait for fonts
	await page.waitForTimeout(200)
	expect(await page.screenshot()).toMatchSnapshot('theming.png')
})
