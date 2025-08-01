import { test, expect } from '@playwright/test';

test.describe("home page with no auth", () => {
  test.beforeEach( async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');
  })

  test('homepage visual test', async( {page }) => {
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('home-page-no-auth.png', 
      { mask: [page.getByTitle('Practice Software Testing - Toolshop')] });
;  });
  
  test('check sign-in', async ({ page }) => {
    // ensure sign-in link is present
    await expect(page.getByTestId('nav-sign-in')).toHaveText('Sign in');
  });

  test('validate page title', async ({ page }) => {
    await expect(page).toHaveTitle('Practice Software Testing - Toolshop');
  });

  test('grid loads 9 items', async ({ page }) => {
    const productCard = page.locator('a[class="card"]');
    await expect(productCard).toHaveCount(9);
  });

  test('search for Thor Hammer', async ({ page }) => {
    const serachField = page.locator('#search-query');
    const searchBtn = page.locator('button[data-test="search-submit"]');
    await expect(serachField).toBeVisible();
    await expect(searchBtn).toBeVisible();
    await serachField.fill('Thor Hammer');
    await searchBtn.click();
    const productCard = page.locator('a[class="card"]');
    await expect(productCard).toHaveCount(1);
    await expect(productCard.locator('div[class="card-body"] > h5[data-test="product-name"]')).toHaveText(' Thor Hammer ');
  });
});

test.describe('Homepage customer 01 auth', () => {
  test.use({ storageState: '.auth/customer01.json'});
  test.beforeEach( async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');
  })

  test('homepage visual test with auth user', async( { page }) => {
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('home-page-customer01.png', 
      { mask: [page.getByTitle('Practice Software Testing - Toolshop')] });
;  });

  test('check customer 01 is signed in', async({ page }) => {
    await expect(page.getByTestId('nav-sign-in')).not.toBeVisible();
  })
});