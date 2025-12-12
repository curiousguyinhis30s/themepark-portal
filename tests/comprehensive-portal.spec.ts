import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8086';

test.describe('Unified Portal - Comprehensive Tests', () => {

  // ==================== LOGIN TESTS ====================
  test.describe('Authentication', () => {
    test('Login page renders correctly', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);

      // Check branding
      await expect(page.getByRole('heading', { name: 'Theme Park Portal' })).toBeVisible();
      await expect(page.getByText('Sign in to access the management portal')).toBeVisible();

      // Check form elements
      await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
      await expect(page.getByPlaceholder('Enter your password')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();

      // Check demo accounts section
      await expect(page.getByText('Demo Accounts')).toBeVisible();
    });

    test('Invalid credentials show error', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);

      await page.fill('[placeholder="Enter your email"]', 'wrong@email.com');
      await page.fill('[placeholder="Enter your password"]', 'wrongpassword');
      await page.click('button:has-text("Sign In")');

      await expect(page.getByText('Invalid email or password')).toBeVisible();
    });

    test('Admin can login successfully', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);

      // Click admin demo account
      await page.getByRole('button', { name: /Admin/i }).click();
      await page.getByRole('button', { name: 'Sign In' }).click();

      await page.waitForURL(`${BASE_URL}/`);
      await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    });

    test('Merchant can login successfully', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);

      await page.getByRole('button', { name: /Merchant/i }).click();
      await page.getByRole('button', { name: 'Sign In' }).click();

      await page.waitForURL(`${BASE_URL}/`);
      await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    });
  });

  // ==================== ADMIN ROLE TESTS ====================
  test.describe('Admin Role', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      await page.getByRole('button', { name: /Admin/i }).click();
      await page.getByRole('button', { name: 'Sign In' }).click();
      await page.waitForURL(`${BASE_URL}/`);
    });

    test('Admin sees all navigation items', async ({ page }) => {
      // Admin-only items
      await expect(page.getByRole('link', { name: 'Attractions' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Zones' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Tickets' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Users' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Staff Management' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Roles & Permissions' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Audit Trail' })).toBeVisible();

      // Shared items
      await expect(page.getByRole('link', { name: 'Analytics' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible();
    });

    test('Admin does NOT see merchant-only items', async ({ page }) => {
      await expect(page.getByRole('link', { name: 'Orders' })).not.toBeVisible();
      await expect(page.getByRole('link', { name: 'Products' })).not.toBeVisible();
      await expect(page.getByRole('link', { name: 'Store Settings' })).not.toBeVisible();
    });

    test('Admin can access Attractions page', async ({ page }) => {
      await page.click('a:has-text("Attractions")');
      await expect(page.getByRole('heading', { name: 'Attractions' })).toBeVisible();
    });

    test('Admin can access Zones page', async ({ page }) => {
      await page.click('a:has-text("Zones")');
      await expect(page.getByRole('heading', { name: 'Zones' })).toBeVisible();
    });

    test('Admin can logout', async ({ page }) => {
      await page.click('button:has-text("Sign Out")');
      await expect(page).toHaveURL(`${BASE_URL}/login`);
    });
  });

  // ==================== MERCHANT ROLE TESTS ====================
  test.describe('Merchant Role', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      await page.getByRole('button', { name: /Merchant/i }).click();
      await page.getByRole('button', { name: 'Sign In' }).click();
      await page.waitForURL(`${BASE_URL}/`);
    });

    test('Merchant sees merchant navigation items', async ({ page }) => {
      await expect(page.getByRole('link', { name: 'Orders' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Products' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Store Settings' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Promotions' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Analytics' })).toBeVisible();
    });

    test('Merchant does NOT see admin-only items', async ({ page }) => {
      await expect(page.getByRole('link', { name: 'Attractions' })).not.toBeVisible();
      await expect(page.getByRole('link', { name: 'Zones' })).not.toBeVisible();
      await expect(page.getByRole('link', { name: 'Users' })).not.toBeVisible();
      await expect(page.getByRole('link', { name: 'Audit Trail' })).not.toBeVisible();
    });

    test('Merchant business info is displayed', async ({ page }) => {
      await expect(page.getByText('Thunder Snacks')).toBeVisible();
      await expect(page.getByText('Adventure Zone - Stall A12')).toBeVisible();
    });

    test('Orders page - view orders', async ({ page }) => {
      await page.click('a:has-text("Orders")');
      await page.waitForURL(`${BASE_URL}/orders`);

      await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible();
      await expect(page.getByText('ORD-001')).toBeVisible();
      await expect(page.getByText('ORD-002')).toBeVisible();
    });

    test('Orders page - status indicators', async ({ page }) => {
      await page.click('a:has-text("Orders")');

      await expect(page.getByText('Pending').first()).toBeVisible();
      await expect(page.getByText('Preparing').first()).toBeVisible();
      await expect(page.getByText('Ready').first()).toBeVisible();
    });

    test('Orders page - update order status', async ({ page }) => {
      await page.click('a:has-text("Orders")');

      // Click "Start Preparing" on pending order
      const startButton = page.getByRole('button', { name: 'Start Preparing' });
      await startButton.click();

      // Order should now show preparing status
      await expect(page.locator('text=Preparing').first()).toBeVisible();
    });

    test('Products page - view products', async ({ page }) => {
      await page.click('a:has-text("Products")');
      await page.waitForURL(`${BASE_URL}/products`);

      await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
      await expect(page.getByText('Thunder Burger')).toBeVisible();
      await expect(page.getByText('Mega Combo')).toBeVisible();
    });

    test('Products page - category filters', async ({ page }) => {
      await page.click('a:has-text("Products")');

      // Check category buttons
      await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Burgers' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Combos' })).toBeVisible();
    });

    test('Products page - toggle availability', async ({ page }) => {
      await page.click('a:has-text("Products")');

      // Find a toggle and click it
      const toggle = page.locator('[role="switch"]').first();
      await toggle.click();
    });

    test('Store Settings page', async ({ page }) => {
      await page.click('a:has-text("Store Settings")');
      await page.waitForURL(`${BASE_URL}/store-settings`);

      await expect(page.getByRole('heading', { name: 'Store Settings' })).toBeVisible();
      await expect(page.getByText('Business Information')).toBeVisible();
      await expect(page.getByText('Location')).toBeVisible();
      await expect(page.getByText('Operating Hours')).toBeVisible();
    });
  });

  // ==================== MOBILE RESPONSIVE TESTS ====================
  test.describe('Mobile Responsive', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('Mobile menu works on login page', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      await expect(page.getByRole('heading', { name: 'Theme Park Portal' })).toBeVisible();
    });

    test('Mobile menu works in portal', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      await page.getByRole('button', { name: /Merchant/i }).click();
      await page.getByRole('button', { name: 'Sign In' }).click();
      await page.waitForURL(`${BASE_URL}/`);

      // Mobile menu button should be visible
      const menuButton = page.locator('button').filter({ has: page.locator('svg') }).first();
      await menuButton.click();

      // Sidebar should appear
      await expect(page.getByRole('link', { name: 'Orders' })).toBeVisible();
    });
  });

  // ==================== ERROR HANDLING TESTS ====================
  test.describe('Error Handling', () => {
    test('Protected routes redirect to login', async ({ page }) => {
      await page.goto(`${BASE_URL}/orders`);
      await expect(page).toHaveURL(`${BASE_URL}/login`);
    });

    test('Unauthorized routes redirect to dashboard', async ({ page }) => {
      // Login as merchant
      await page.goto(`${BASE_URL}/login`);
      await page.getByRole('button', { name: /Merchant/i }).click();
      await page.getByRole('button', { name: 'Sign In' }).click();
      await page.waitForURL(`${BASE_URL}/`);

      // Try to access admin-only route
      await page.goto(`${BASE_URL}/attractions`);
      await expect(page).toHaveURL(`${BASE_URL}/`);
    });
  });
});
