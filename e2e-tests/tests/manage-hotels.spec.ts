import { test, expect } from '@playwright/test'
import path from 'path'

const UI_URL = 'http://localhost:5173/'

test.beforeEach(async ({ page }) => {
    await page.goto(UI_URL)
    // Click the sign in button.
    await page.getByRole('link', { name: 'Sign In' }).click();
    // Expects page to have a heading with the name of Sign in.
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

    await page.locator('[name=email]').fill('test@test.com')
    await page.locator('[name=password]').fill('123456')

    await page.getByRole('button', { name: 'Log in' }).click();

    await expect(page.getByText('Logged in succesfully!')).toBeVisible();
})

test('should allow user to add a hotel', async ({ page }) => {
    await page.goto(`${UI_URL}add-hotel`)

    await page.locator('[name="name"]').fill('Test Hotel')
    await page.locator('[name="city"]').fill('Test City')
    await page.locator('[name="country"]').fill('Test Country')
    await page.locator('[name="description"]').fill('Test Description')
    await page.locator('[name="pricePerNight"]').fill('100')
    await page.selectOption('select[name="starRating"]', "3")

    await page.getByText('Budget').click()

    await page.getByLabel('Free WiFi').check()
    await page.getByLabel('Parking').check()

    await page.locator('[name="adultCount"]').fill('5')
    await page.locator('[name="childCount"]').fill('3')

    await page.setInputFiles('[name="imageFiles"]', [
        path.join(__dirname, 'files', '1.png'),
        path.join(__dirname, 'files', '2.jpg'),
        path.join(__dirname, 'files', '3.png'),
    ])

    await page.getByRole('button', { name: 'Save' }).click()
    await expect(page.getByText('Hotel Saved!')).toBeVisible()
})