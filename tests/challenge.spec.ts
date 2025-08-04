import { test, expect } from '@playwright/test';
import { billingAddress } from './test-data';

test.describe('Checkout', () => {
  test.use({ storageState: '.auth/customer01.json'});
  test.beforeEach( async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');
  });

test('GET /product/{id}', async({ request, page }) => {
  await expect(page.locator('a[class="card"]')).toHaveCount(9);
  
  const apiURL = 'https://api.practicesoftwaretesting.com';
  const productHref = await page.locator('a[class="card"]').nth(0).getAttribute('href');
  const productId = productHref?.replace(/[product\/]/gm, '');
  const response = await request.get(apiURL + '/products/' + productId);

  await expect(response.status()).toBe(200);
  
  const body = await response.json();
  console.log(body);
  });

test('checkout', async({ page }) => {
  await expect(page.locator('a[class="card"]')).toHaveCount(9);
  page.locator('a[class="card"]').nth(0).click(); // click first product

  await expect(page.locator('h1')).toHaveText('Combination Pliers') // check if landed on first product PDP successfully
  await page.locator('#btn-add-to-cart').click(); // added one product to cart
  await expect(page.locator('#lblCartCount')).toHaveText('1'); // check if product added to cart successfully
  await page.locator('a[data-test="nav-cart"]').click();
  await page.locator('button[data-test="proceed-1"]').click();
  await page.locator('button[data-test="proceed-2"]').click();

  // fill in billing address
  await page.locator('#street').fill(billingAddress.street);
  await page.locator('#city').fill(billingAddress.city);
  await page.locator('#state').fill(billingAddress.state);
  await page.locator('#country').fill(billingAddress.country);
  await page.locator('#postal_code').fill(billingAddress.zipCode);
  await expect(page.locator('button[data-test="proceed-3"]')).toBeVisible();
  await page.locator('button[data-test="proceed-3"]').click();
  await page.locator('select[data-test="payment-method"]').selectOption('cash-on-delivery');
  await expect(page.locator('button[data-test="finish"]')).toBeVisible();
  await page.locator('button[data-test="finish"]').click();
  await expect(page.locator('div[data-test="payment-success-message"]')).toHaveText('Payment was successful');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('order-confirmation-success.png',
    { mask: [page.getByTitle('Practice Software Testing - Toolshop')] });
  });
});