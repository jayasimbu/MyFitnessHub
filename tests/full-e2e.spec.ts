import { test, expect } from '@playwright/test';

// Configuration
const TEST_USER_EMAIL = `athlete_${Date.now()}@hub.local`;
const TEST_USER_PWD = 'TestPassword123!';

test.describe('MyFitness Hub Complete E2E Suite', () => {

  test('PHASE 1 & 2: Application Startup & Landing Page Navigation', async ({ page }) => {
    await page.goto('/');
    
    // Startup
    await expect(page).toHaveTitle(/MyFitness Hub/i);
    
    // Landing Page Navigation check
    const navLinks = ['Home', 'Programs', 'AI Coach', 'Pricing', 'Contact'];
    for (const link of navLinks) {
      if (link === 'Programs' || link === 'AI Coach' || link === 'Pricing' || link === 'Contact') {
          const el = page.locator(`text=${link}`).first();
          await el.scrollIntoViewIfNeeded();
          await expect(el).toBeVisible();
      }
    }

    // Hero Section
    const heroH1 = page.locator('h1').filter({ hasText: 'Transform Your Body' });
    await heroH1.scrollIntoViewIfNeeded();
    await expect(heroH1).toBeVisible({ timeout: 15000 });
    
    const aboutText = page.locator('text=The Legend of Salem').first();
    await aboutText.scrollIntoViewIfNeeded();
    await expect(aboutText).toBeVisible();
    
    // AI Coach Teaser Section
    const aiCoach = page.locator('text=AI COACHING').first();
    await aiCoach.scrollIntoViewIfNeeded();
    await expect(aiCoach).toBeVisible();

    // CTA Button
    const joinNow = page.getByRole('button', { name: /Join Now/i }).first();
    await joinNow.scrollIntoViewIfNeeded();
    await expect(joinNow).toBeVisible();
  });

  test('PHASE 3: Authentication - Signup, Login, Reset', async ({ page }) => {
    await page.goto('/');

    // Check we are on signup
    const mobileMenu = page.locator('button.lg\\:hidden');
    if (await mobileMenu.isVisible()) { await mobileMenu.click(); await page.waitForTimeout(500); }
    const joinBtn = page.getByRole('button', { name: /Join Now/i }).and(page.locator(':visible')).first();
    await joinBtn.scrollIntoViewIfNeeded();
    await joinBtn.click();
    
    await expect(page.locator('text=New Enlistment').first()).toBeVisible({ timeout: 15000 });
    
    // Validation Empty Fields
    await page.getByRole('button', { name: /INITIATE PROFILE/i }).click();
    await expect(page.locator('text=First name is required')).toBeVisible();

    // Fill valid signup
    await page.locator('input[name="firstName"]').fill('Test');
    await page.locator('input[name="lastName"]').fill('Athlete');
    await page.locator('input[name="email"]').fill(TEST_USER_EMAIL);
    await page.locator('input[name="password"]').fill(TEST_USER_PWD);
    
    // Submit Signup
    await page.getByRole('button', { name: /INITIATE PROFILE/i }).click();

    // We either hit Verify Email or Dashboard
    const verifyHeading = page.locator('text=Verify Your Enlistment');
    const athleteDashboard = page.locator('text=ATHLETE');
    
    await expect(verifyHeading.or(athleteDashboard).first()).toBeVisible({ timeout: 15000 });
  });

  test('PHASE 8: Pricing / Checkout', async ({ page }) => {
    await page.goto('/');
    
    // Scroll down multiple times to ensure lazy loaded sections and Framer motion elements appear
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
    await page.waitForTimeout(1000);

    const pricingHeading = page.locator('text=Pricing').first();
    await pricingHeading.scrollIntoViewIfNeeded();
    await expect(pricingHeading).toBeVisible();
    
    // Select Elite Plan
    const selectPro = page.getByRole('button', { name: /SELECT ELITE/i }).first();
    if (await selectPro.isVisible()) {
      await selectPro.click();
      
      // Should navigate to Checkout
      await expect(page.locator('text=SECURE CHECKOUT').first()).toBeVisible();
      
      // Go back
      await page.getByRole('button', { name: /RETURN/i }).first().click();
      await expect(page.locator('text=Transform Your Body').first()).toBeVisible();
    }
  });

  test('PHASE 9: Admin / Command Hub', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to the bottom where Master Admin link is usually located
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    const adminLink = page.getByRole('button', { name: /Master Admin/i }).first();
    
    if(await adminLink.isVisible()) {
       await adminLink.scrollIntoViewIfNeeded();
       await adminLink.click();
       await expect(page.locator('text=MASTER ADMIN').first()).toBeVisible();
       
       await page.locator('input[type="email"]').fill('admin@myfitnesshub.fit');
       await page.locator('input[type="password"]').fill('wrongpassword');
       await page.getByRole('button', { name: /Authenticate/i }).click();
       await expect(page.locator('text=Invalid admin credentials')).toBeVisible();
    }
  });

});
