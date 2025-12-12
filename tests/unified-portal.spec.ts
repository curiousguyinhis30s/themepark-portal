import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8086';

test.describe('Unified Portal Tests', () => {
  test('Login page displays all demo accounts', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    // Check demo accounts are visible
    await expect(page.getByText('Admin')).toBeVisible();
    await expect(page.getByText('Merchant')).toBeVisible();
    await expect(page.getByText('Staff')).toBeVisible();

    await page.screenshot({ path: 'tests/screenshots/login-page.png' });
  });

  test('Merchant login shows merchant-only navigation', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    // Click merchant demo account to fill credentials
    await page.getByRole('button', { name: /Merchant/i }).click();

    // Click Sign In
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Wait for dashboard
    await page.waitForURL(`${BASE_URL}/`);

    // Check merchant badge is visible
    await expect(page.getByText('Merchant').first()).toBeVisible();

    // Check merchant-specific nav items are visible
    await expect(page.getByRole('link', { name: 'Orders' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Products' })).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/merchant-dashboard.png', fullPage: true });
  });

  test('Admin login shows admin-only navigation', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    // Click admin demo account
    await page.getByRole('button', { name: /Admin/i }).click();

    // Click Sign In
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Wait for dashboard
    await page.waitForURL(`${BASE_URL}/`);

    // Check admin badge
    await expect(page.getByText('Admin').first()).toBeVisible();

    // Check admin-specific nav items
    await expect(page.getByRole('link', { name: 'Attractions' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Zones' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Users' })).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/admin-dashboard.png', fullPage: true });
  });

  test('Merchant Orders page works', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.getByRole('button', { name: /Merchant/i }).click();
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL(`${BASE_URL}/`);

    // Navigate to Orders
    await page.getByRole('link', { name: 'Orders' }).click();
    await page.waitForURL(`${BASE_URL}/orders`);

    // Check orders page content
    await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible();
    await expect(page.getByText('ORD-001')).toBeVisible();

    await page.screenshot({ path: 'tests/screenshots/orders-page.png', fullPage: true });
  });

  test('Merchant Products page works', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.getByRole('button', { name: /Merchant/i }).click();
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL(`${BASE_URL}/`);

    // Navigate to Products
    await page.getByRole('link', { name: 'Products' }).click();
    await page.waitForURL(`${BASE_URL}/products`);

    // Check products page content
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
    await expect(page.getByText('Thunder Burger')).toBeVisible();

    await page.screenshot({ path: 'tests/screenshots/products-page.png', fullPage: true });
  });
});
