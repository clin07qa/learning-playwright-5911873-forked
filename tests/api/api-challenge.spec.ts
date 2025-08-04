import { test, expect } from '@playwright/test';

test.describe('api challenge', () => {
  test.beforeEach( async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');
  })
  test('GET /product/{id}', async({ request, page }) => {  
    const apiURL = 'https://api.practicesoftwaretesting.com';
    await expect(page.locator('a[class="card"]')).toHaveCount(9);
    const productHref = await page.locator('a[class="card"]').nth(0).getAttribute('href');
    const productId = productHref?.replace(/[product\/]/gm, '');
    const response = await request.get(apiURL + '/products/' + productId);

    await expect(response.status()).toBe(200);
    
    const body = await response.json();
    console.log(body);
  });
});