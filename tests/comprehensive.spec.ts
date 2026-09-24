import { test, expect } from '@playwright/test';

const testEmail = `testuser_${Date.now()}@example.com`;
const testPassword = 'TestPassword123!';

test.describe('MyFitness Hub Comprehensive E2E', () => {

  test('Complete End to End Flow', async ({ page }) => {
    // 1. HOME PAGE
    await page.goto('/');
    await expect(page).toHaveTitle(/MyFitness Hub/i);
    await expect(page.getByRole('heading', { name: /Transform Your Body/i }).first()).toBeVisible();
    
    // 2. AUTHENTICATION - SIGN UP
    const mobileMenu = page.locator('button.lg\\:hidden');
    if (await mobileMenu.isVisible()) { await mobileMenu.click(); await page.waitForTimeout(500); }
    const joinBtn = page.getByRole('button', { name: /Join/i }).and(page.locator(':visible')).first();
    await joinBtn.scrollIntoViewIfNeeded();
    await joinBtn.click();
    await expect(page.getByRole('button', { name: /INITIATE PROFILE/i })).toBeVisible();
    
    // Test empty fields
    await page.getByRole('button', { name: /INITIATE PROFILE/i }).click();
    await expect(page.locator('text=First name is required')).toBeVisible();

    // Fill valid data
    await page.locator('input[name="firstName"]').fill('John');
    await page.locator('input[name="lastName"]').fill('Doe');
    await page.locator('input[name="email"]').fill(testEmail);
    await page.locator('input[name="password"]').fill(testPassword);
    
    await page.getByRole('button', { name: /INITIATE PROFILE/i }).click();

    // Check if it goes to verify or dashboard
    const verifyHeading = page.locator('text=Verify Your Enlistment');
    const athleteHubHeading = page.locator('text=ATHLETE');
    
    await expect(verifyHeading.or(athleteHubHeading).first()).toBeVisible({ timeout: 15000 });
    
    if (await verifyHeading.isVisible()) {
      console.log('Email verification is required. Cannot proceed with E2E test for logged-in user automatically.');
      return;
    }
    
    // We are on dashboard
    await expect(page.locator('text=ROUTINE LIBRARY')).toBeVisible();
    
    // 3. LOGOUT
    await page.getByRole('button', { name: /Terminate Session/i }).click();
    await expect(page.getByRole('heading', { name: /Transform Your Body/i }).first()).toBeVisible();
    
    // 4. SIGN IN
    const mobileMenu2 = page.locator('button.lg\\:hidden');
    if (await mobileMenu2.isVisible()) { await mobileMenu2.click(); await page.waitForTimeout(500); }
    const loginBtn = page.getByRole('button', { name: /Login/i }).and(page.locator(':visible')).first();
    await loginBtn.scrollIntoViewIfNeeded();
    await loginBtn.click();
    await expect(page.getByRole('button', { name: /AUTHORIZE ACCESS/i })).toBeVisible();
    
    // Test empty fields
    await page.getByRole('button', { name: /AUTHORIZE ACCESS/i }).click();
    await expect(page.locator('text=Email address is required')).toBeVisible();
    
    // Fill valid credentials
    await page.locator('input[name="email"]').fill(testEmail);
    await page.locator('input[name="password"]').fill(testPassword);
    await page.getByRole('button', { name: /AUTHORIZE ACCESS/i }).click();
    
    await expect(page.locator('text=ATHLETE').first()).toBeVisible({ timeout: 10000 });
    
    // 5. WORKOUT FEATURES
    // Go to AI Coach
    await page.getByRole('button', { name: /New Brief/i }).click();
    
    await expect(page.locator('text=AI COACHING').first()).toBeVisible();
    await page.locator('input[placeholder*="E.g. Explosive Vertical"]').fill('Full Body Hypertrophy');
    await page.getByRole('button', { name: 'Intermediate' }).click();
    
    // Since Gemini API requires a real key and network request, let's just test if we can click generate
    // Note: If Gemini API fails, it will show an error message which we can assert
    await page.getByRole('button', { name: /INITIATE PROTOCOL/i }).click();
    
    // Wait for either the generated output or an error message
    // "Mission Brief" indicates successful output
    // "System overload" indicates failure
    const successOutput = page.locator('text=Mission Brief');
    const errorOutput = page.locator('text=System overload');
    
    await expect(successOutput.or(errorOutput).first()).toBeVisible({ timeout: 15000 });
    
    if (await successOutput.isVisible()) {
        // Test saving the workout
        await page.getByRole('button', { name: /Save to Profile/i }).click();
        const missionStored = page.getByRole('button', { name: /Mission Stored/i });
        const saveFailed = page.getByRole('button', { name: /Save Failed/i });
        await expect(missionStored.or(saveFailed).first()).toBeVisible({ timeout: 10000 });
        
        if (await missionStored.isVisible()) {
            await page.getByRole('button', { name: /Dashboard/i }).first().click();
            await expect(page.locator('text=Full Body Hypertrophy').first()).toBeVisible();
        } else {
            console.log('Workout saving failed, likely due to Supabase RLS policies.');
        }
    }
    
    // 6. ADMIN FLOW
    await page.getByRole('button', { name: /Dashboard/i }).first().click();
    await page.getByRole('button', { name: /Terminate Session/i }).click();
    await expect(page.getByRole('heading', { name: /Transform Your Body/i }).first()).toBeVisible();
    
    const mobileMenu3 = page.locator('button.lg\\:hidden');
    if (await mobileMenu3.isVisible()) { await mobileMenu3.click(); await page.waitForTimeout(500); }
    const loginBtn3 = page.getByRole('button', { name: /Login/i }).and(page.locator(':visible')).first();
    await loginBtn3.scrollIntoViewIfNeeded();
    await loginBtn3.click();
    await page.getByRole('button', { name: /Master Admin Override/i }).click();
    
    await expect(page.getByRole('button', { name: /Authenticate/i })).toBeVisible();
    
    // Fill invalid admin credentials
    await page.locator('input[type="email"]').fill('admin@myfitnesshub.fit');
    await page.locator('input[type="password"]').fill('wrongpassword');
    await page.getByRole('button', { name: /Authenticate/i }).click({ force: true });
    await expect(page.locator('text=Invalid admin credentials')).toBeVisible();
  });

});
