import { test, expect } from '@playwright/test';

const UI_URL = 'http://localhost:5173/'

test('should allow user to sign in', async ({ page }) => {
  await page.goto(UI_URL)
  // Click the sign in button.
  await page.getByRole('link', { name: 'Sign In' }).click();
  // Expects page to have a heading with the name of Sign in.
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

  await page.locator('[name=email]').fill('test@test.com')
  await page.locator('[name=password]').fill('123456')

  await page.getByRole('button', { name: 'Log in' }).click();

  await expect(page.getByText('Logged in succesfully!')).toBeVisible();
  await expect(page.getByRole('link', { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole('link', { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole('button', { name: "Sign out" })).toBeVisible();
});

test('should allow user to register', async ({ page }) => {
  const testEmail = `test${Math.floor(Math.random() * 90000) + 10000}@test.com`
  await page.goto(UI_URL)

  await page.getByRole('link', { name: 'Sign In' }).click();
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();

  await page.getByRole('link', { name: 'Create an account here' }).click();

  await expect(page.getByRole('heading', { name: 'Create an Account' })).toBeVisible();
  await page.locator('[name=firstName]').fill('test1')
  await page.locator('[name=lastName]').fill('test1')
  await page.locator('[name=email]').fill(testEmail)
  await page.locator('[name=password]').fill('123456')
  await page.locator('[name=confirmPassword]').fill('123456')

  await page.getByRole('button', { name: 'Create Account' }).click();

  await expect(page.getByText('Registeration succesful!')).toBeVisible();
  await expect(page.getByRole('link', { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole('link', { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole('button', { name: "Sign out" })).toBeVisible();
});