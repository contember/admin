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

test('view: basic test', async ({ page }) => {
	expectNoConsoleErrors(page)

	await page.goto(`/${projectSlug}/viewAlign`)
	await page.waitForLoadState('networkidle') // wait for fonts
	await page.waitForTimeout(200)
	expect(await page.screenshot()).toMatchSnapshot('viewAlign.png')
})

test('view: basis test', async ({ page }) => {
	expectNoConsoleErrors(page)

	await page.goto(`/${projectSlug}/viewBasis`)
	await page.waitForLoadState('networkidle') // wait for fonts
	await page.waitForTimeout(200)
	expect(await page.screenshot()).toMatchSnapshot('viewBasis.png')
})

test('view: border test', async ({ page }) => {
	expectNoConsoleErrors(page)

	await page.goto(`/${projectSlug}/viewBorder`)
	await page.waitForLoadState('networkidle') // wait for fonts
	await page.waitForTimeout(200)
	expect(await page.screenshot()).toMatchSnapshot('viewBorder.png')
})

test('view: colors test', async ({ page }) => {
	expectNoConsoleErrors(page)

	await page.goto(`/${projectSlug}/viewColors`)
	await page.waitForLoadState('networkidle') // wait for fonts
	await page.waitForTimeout(200)
	expect(await page.screenshot()).toMatchSnapshot('viewColors.png')
})

test('view: direction test', async ({ page }) => {
	expectNoConsoleErrors(page)

	await page.goto(`/${projectSlug}/viewDirection`)
	await page.waitForLoadState('networkidle') // wait for fonts
	await page.waitForTimeout(200)
	expect(await page.screenshot()).toMatchSnapshot('viewDirection.png')
})

test('view: display test', async ({ page }) => {
	expectNoConsoleErrors(page)

	await page.goto(`/${projectSlug}/viewDisplay`)
	await page.waitForLoadState('networkidle') // wait for fonts
	await page.waitForTimeout(200)
	expect(await page.screenshot()).toMatchSnapshot('viewDisplay.png')
})

test('view: justify test', async ({ page }) => {
	expectNoConsoleErrors(page)

	await page.goto(`/${projectSlug}/viewJustify`)
	await page.waitForLoadState('networkidle') // wait for fonts
	await page.waitForTimeout(200)
	expect(await page.screenshot()).toMatchSnapshot('viewJustify.png')
})

test('view: gap test', async ({ page }) => {
	expectNoConsoleErrors(page)

	await page.goto(`/${projectSlug}/viewGap`)
	await page.waitForLoadState('networkidle') // wait for fonts
	await page.waitForTimeout(200)
	expect(await page.screenshot()).toMatchSnapshot('viewGap.png')
})

test('view: padding test', async ({ page }) => {
	expectNoConsoleErrors(page)

	await page.goto(`/${projectSlug}/viewPadding`)
	await page.waitForLoadState('networkidle') // wait for fonts
	await page.waitForTimeout(200)
	expect(await page.screenshot()).toMatchSnapshot('viewPadding.png')
})

test('view: span test', async ({ page }) => {
	expectNoConsoleErrors(page)

	await page.goto(`/${projectSlug}/viewSpan`)
	await page.waitForLoadState('networkidle') // wait for fonts
	await page.waitForTimeout(200)
	expect(await page.screenshot()).toMatchSnapshot('viewSpan.png')
})
