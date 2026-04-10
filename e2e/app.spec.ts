import { test, expect } from '@playwright/test';

test.describe('ContentPilot — Social Media Autoposter', () => {
  test('should load the login page when unauthenticated', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('text=ContentPilot')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should display login form with email and password fields', async ({ page }) => {
    await page.goto('/login');
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('placeholder', 'you@business.com');
  });

  test('should toggle between sign in and sign up', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('button[type="submit"]')).toContainText('Sign In');
    await page.click('text=Don\'t have an account? Sign up');
    await expect(page.locator('button[type="submit"]')).toContainText('Create Account');
    await page.click('text=Already have an account? Sign in');
    await expect(page.locator('button[type="submit"]')).toContainText('Sign In');
  });

  test('should show feature highlights on login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('text=Calendar View')).toBeVisible();
    await expect(page.locator('text=Auto-Publish')).toBeVisible();
    await expect(page.locator('text=Analytics')).toBeVisible();
  });

  test('should show validation error for empty form submission', async ({ page }) => {
    await page.goto('/login');
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('required', '');
  });

  test('should show the app title and tagline', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('text=ContentPilot')).toBeVisible();
    await expect(
      page.locator('text=Schedule & auto-publish across all your socials')
    ).toBeVisible();
  });

  test('should redirect all unknown routes to login when not authenticated', async ({ page }) => {
    await page.goto('/some-random-page');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should redirect /create to login when not authenticated', async ({ page }) => {
    await page.goto('/create');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should redirect /analytics to login when not authenticated', async ({ page }) => {
    await page.goto('/analytics');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should redirect /settings to login when not authenticated', async ({ page }) => {
    await page.goto('/settings');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should have correct page title', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/ContentPilot/);
  });

  test('login page should be styled correctly with dark theme', async ({ page }) => {
    await page.goto('/login');
    const body = page.locator('body');
    await expect(body).toHaveClass(/bg-gray-950/);
  });
});
