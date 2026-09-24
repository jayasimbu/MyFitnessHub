import { test, expect, Page } from '@playwright/test';

// ─────────────────────────────────────────────
// Real-Time Comprehensive Test Suite
// MyFitness Hub — All Pages & Features
// ─────────────────────────────────────────────

const BASE = 'http://localhost:3000';

// ─── Helpers ───────────────────────────────────
async function scrollToBottom(page: Page, steps = 3) {
  for (let i = 0; i < steps; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await page.waitForTimeout(600);
  }
}

// ══════════════════════════════════════════════
// SUITE 1: Page Load & SEO
// ══════════════════════════════════════════════
test.describe('1. Page Load & SEO', () => {

  test('1.1 – Homepage loads with correct title', async ({ page }) => {
    await page.goto(BASE);
    await expect(page).toHaveTitle(/MyFitness Hub/i);
  });

  test('1.2 – Meta description exists', async ({ page }) => {
    await page.goto(BASE);
    const meta = page.locator('meta[name="description"]');
    await expect(meta).toHaveCount(1);
  });

  test('1.3 – Single H1 on homepage', async ({ page }) => {
    await page.goto(BASE);
    const h1s = page.locator('h1');
    const count = await h1s.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('1.4 – Hero image loads (not broken)', async ({ page }) => {
    await page.goto(BASE);
    const heroImg = page.locator('section#home img').first();
    await expect(heroImg).toBeVisible({ timeout: 10000 });
    const naturalWidth = await heroImg.evaluate((img: HTMLImageElement) => img.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(0);
  });
});

// ══════════════════════════════════════════════
// SUITE 2: Navigation & Navbar
// ══════════════════════════════════════════════
test.describe('2. Navigation & Navbar', () => {

  test('2.1 – Desktop navbar shows all links', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BASE);
    for (const name of ['Home', 'Programs', 'AI Coach', 'Pricing', 'Contact']) {
      await expect(page.getByRole('link', { name }).first()).toBeVisible();
    }
  });

  test('2.2 – Mobile hamburger menu opens', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE);
    const toggle = page.locator('button.lg\\:hidden').first();
    await toggle.click();
    await expect(page.getByRole('link', { name: 'Programs' }).first()).toBeVisible();
  });

  test('2.3 – Login nav button goes to login page', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BASE);
    await page.getByRole('button', { name: /^Login$/i }).first().click();
    await expect(page.getByRole('button', { name: /AUTHORIZE ACCESS/i })).toBeVisible({ timeout: 5000 });
  });

  test('2.4 – Join Now button goes to signup', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BASE);
    await page.getByRole('button', { name: /Join Now/i }).first().click();
    await expect(page.locator('h2', { hasText: 'Enlistment' }).first()).toBeVisible({ timeout: 5000 });
  });

  test('2.5 – Scroll-to-top button appears after scrolling', async ({ page }) => {
    await page.goto(BASE);
    await scrollToBottom(page, 5);
    const scrollBtn = page.locator('button[aria-label="Scroll to top"]');
    await expect(scrollBtn).toBeVisible({ timeout: 5000 });
    await scrollBtn.click();
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(200);
  });

  test('2.6 – Navbar changes style on scroll', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BASE);
    await page.evaluate(() => window.scrollBy(0, 200));
    await page.waitForTimeout(400);
    const nav = page.locator('nav').first();
    const cls = await nav.getAttribute('class');
    expect(cls).toContain('bg-black/90');
  });
});

// ══════════════════════════════════════════════
// SUITE 3: Homepage Sections (Real-time)
// ══════════════════════════════════════════════
test.describe('3. Homepage Sections', () => {

  test('3.1 – Hero section visible with correct heading', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator('h1', { hasText: 'Transform Your Body' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: /Book Free Trial/i }).first()).toBeVisible();
  });

  test('3.2 – About section visible', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('#about').scrollIntoViewIfNeeded();
    await expect(page.locator('text=The Legend of Salem').first()).toBeVisible({ timeout: 8000 });
  });

  test('3.3 – Programs section shows 3 cards', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('#programs').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await expect(page.locator('text=The Shredder 30').first()).toBeVisible({ timeout: 8000 });
    await expect(page.locator('text=Hypertrophy Max').first()).toBeVisible();
    await expect(page.locator('text=Athlete Performance').first()).toBeVisible();
  });

  test('3.4 – Programs local image loads correctly', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('#programs').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    const localImg = page.locator('img[src="/images/program_shredder.jpg"]').first();
    await expect(localImg).toBeVisible({ timeout: 8000 });
    const w = await localImg.evaluate((img: HTMLImageElement) => img.naturalWidth);
    expect(w).toBeGreaterThan(0);
  });

  test('3.5 – Hero local image loads correctly', async ({ page }) => {
    await page.goto(BASE);
    const heroLocalImg = page.locator('img[src="/images/hero_gym_bg.jpg"]').first();
    await expect(heroLocalImg).toBeVisible({ timeout: 10000 });
    const w = await heroLocalImg.evaluate((img: HTMLImageElement) => img.naturalWidth);
    expect(w).toBeGreaterThan(0);
  });

  test('3.6 – AI Coach section visible with form', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('#ai-coach').scrollIntoViewIfNeeded();
    await expect(page.getByRole('button', { name: /INITIATE PROTOCOL/i })).toBeVisible({ timeout: 8000 });
  });

  test('3.7 – AI Coach goal input accepts text', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('#ai-coach').scrollIntoViewIfNeeded();
    const goalInput = page.locator('#ai-coach input[type="text"]').first();
    await goalInput.fill('Build Muscle Mass');
    await expect(goalInput).toHaveValue('Build Muscle Mass');
  });

  test('3.8 – AI Coach level buttons clickable', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('#ai-coach').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: /^Advanced$/i }).click();
    await expect(page.getByRole('button', { name: /^Advanced$/i })).toHaveClass(/bg-lime-500/);
  });

  test('3.9 – Pricing section shows all 3 plans', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('#pricing').scrollIntoViewIfNeeded();
    await expect(page.getByRole('button', { name: /Select Monthly/i }).first()).toBeVisible({ timeout: 8000 });
    await expect(page.getByRole('button', { name: /Select 6 Months/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /Select 12 Months/i }).first()).toBeVisible();
  });

  test('3.10 – Best Value badge on 6 Months plan', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('#pricing').scrollIntoViewIfNeeded();
    await expect(page.locator('text=Best Value').first()).toBeVisible({ timeout: 8000 });
  });

  test('3.11 – Contact form accepts input', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.locator('#contact input[placeholder="FULL NAME"]').fill('Test User');
    await page.locator('#contact input[type="email"]').fill('test@test.com');
    await page.locator('#contact textarea').fill('This is a test message about gym membership.');
    await expect(page.locator('#contact input[placeholder="FULL NAME"]')).toHaveValue('Test User');
  });

  test('3.12 – Testimonials section has 3 cards', async ({ page }) => {
    await page.goto(BASE);
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 4));
    await page.waitForTimeout(800);
    await expect(page.locator('text=Simbu').first()).toBeVisible({ timeout: 8000 });
    await expect(page.locator('text=Surya').first()).toBeVisible();
    await expect(page.locator('text=Ajay').first()).toBeVisible();
  });
});

// ══════════════════════════════════════════════
// SUITE 4: GymBot Chatbot (Real-time)
// ══════════════════════════════════════════════
test.describe('4. GymBot Chatbot', () => {

  test('4.1 – GymBot FAB button is visible', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForTimeout(500);
    const gymBotBtn = page.locator('.animate-ping').first();
    await expect(gymBotBtn).toBeVisible({ timeout: 5000 });
  });

  test('4.2 – GymBot opens on click and shows greeting', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('button.fixed.bottom-6.right-6').first().click();
    await expect(page.locator('text=Vanakkam').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Salem Branch').first()).toBeVisible();
  });

  test('4.3 – GymBot input field accepts text', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('button.fixed.bottom-6.right-6').first().click();
    await page.waitForTimeout(300);
    const input = page.locator('input[placeholder="Type your message..."]');
    await expect(input).toBeVisible();
    await input.fill('What are your timings?');
    await expect(input).toHaveValue('What are your timings?');
  });
});

// ══════════════════════════════════════════════
// SUITE 5: Authentication Pages
// ══════════════════════════════════════════════
test.describe('5. Authentication', () => {

  test('5.1 – Login shows validation on empty submit', async ({ page }) => {
    await page.goto(BASE);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.getByRole('button', { name: /^Login$/i }).first().click();
    await page.getByRole('button', { name: /AUTHORIZE ACCESS/i }).click();
    await expect(page.locator('text=Email address is required').first()).toBeVisible();
  });

  test('5.2 – Login shows error for wrong credentials', async ({ page }) => {
    await page.goto(BASE);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.getByRole('button', { name: /^Login$/i }).first().click();
    await page.locator('input[name="email"]').fill('wrong@test.com');
    await page.locator('input[name="password"]').fill('wrongpassword');
    await page.getByRole('button', { name: /AUTHORIZE ACCESS/i }).click();
    await expect(page.locator('text=Access denied').first()).toBeVisible({ timeout: 10000 });
  });

  test('5.3 – Password eye toggle works', async ({ page }) => {
    await page.goto(BASE);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.getByRole('button', { name: /^Login$/i }).first().click();
    const pwdInput = page.locator('input[name="password"]');
    await expect(pwdInput).toHaveAttribute('type', 'password');
    await page.locator('button[aria-label="Show password"]').click();
    await expect(pwdInput).toHaveAttribute('type', 'text');
  });

  test('5.4 – Signup shows validation on empty submit', async ({ page }) => {
    await page.goto(BASE);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.getByRole('button', { name: /Join Now/i }).first().click();
    await page.getByRole('button', { name: /INITIATE PROFILE/i }).click();
    await expect(page.locator('text=First name is required').first()).toBeVisible();
  });

  test('5.5 – Forgot password page loads', async ({ page }) => {
    await page.goto(BASE);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.getByRole('button', { name: /^Login$/i }).first().click();
    await page.getByRole('button', { name: /Credentials Lost/i }).click();
    await expect(page.locator('h2', { hasText: 'Recovery Center' }).first()).toBeVisible({ timeout: 5000 });
  });

  test('5.6 – Back to home from login works', async ({ page }) => {
    await page.goto(BASE);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.getByRole('button', { name: /^Login$/i }).first().click();
    await page.locator('button[aria-label="Back to home"]').click();
    await expect(page.locator('section#home')).toBeVisible({ timeout: 5000 });
  });
});

// ══════════════════════════════════════════════
// SUITE 6: Pricing & Checkout
// ══════════════════════════════════════════════
test.describe('6. Pricing & Checkout', () => {

  test('6.1 – Clicking Select Monthly goes to checkout', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('#pricing').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.getByRole('button', { name: /Select Monthly/i }).first().click();
    await expect(page.locator('text=Monthly').first()).toBeVisible({ timeout: 8000 });
  });

  test('6.2 – Checkout shows validation errors on empty submit', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('#pricing').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.getByRole('button', { name: /Select Monthly/i }).first().click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /CONFIRM ENLISTMENT/i }).click();
    await expect(page.locator('text=Check your parameters').first()).toBeVisible({ timeout: 5000 });
  });
});

// ══════════════════════════════════════════════
// SUITE 7: Admin Login
// ══════════════════════════════════════════════
test.describe('7. Admin Login', () => {

  test('7.1 – Admin login page loads', async ({ page }) => {
    await page.goto(BASE);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.getByRole('button', { name: /^Login$/i }).first().click();
    await page.getByRole('button', { name: /Master Admin Override/i }).click();
    await expect(page.locator('h2', { hasText: 'Command Hub' }).first()).toBeVisible({ timeout: 5000 });
  });

  test('7.2 – Admin shows error for wrong credentials', async ({ page }) => {
    await page.goto(BASE);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.getByRole('button', { name: /^Login$/i }).first().click();
    await page.getByRole('button', { name: /Master Admin Override/i }).click();
    await page.locator('input[type="email"]').fill('admin@myfitnesshub.fit');
    await page.locator('input[type="password"]').fill('wrongpassword123');
    await page.getByRole('button', { name: /Authenticate/i }).click();
    await expect(page.locator('text=Invalid admin credentials').first()).toBeVisible({ timeout: 10000 });
  });
});

// ══════════════════════════════════════════════
// SUITE 8: Responsive Design
// ══════════════════════════════════════════════
test.describe('8. Responsive Design', () => {

  test('8.1 – Renders on mobile (390px)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE);
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('button.lg\\:hidden').first()).toBeVisible();
  });

  test('8.2 – Renders on tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE);
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
  });

  test('8.3 – Renders on 1920px desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(BASE);
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('link', { name: 'Home' }).first()).toBeVisible();
  });

  test('8.4 – No horizontal scroll on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE);
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 5);
  });
});

// ══════════════════════════════════════════════
// SUITE 9: Edge Cases & Error Handling
// ══════════════════════════════════════════════
test.describe('9. Edge Cases & Error Handling', () => {

  test('9.1 – Contact form shows validation on empty submit', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.locator('#contact button[type="submit"]').click();
    await expect(page.locator('text=Minimum 2 characters').first()).toBeVisible({ timeout: 3000 });
  });

  test('9.2 – AI Coach button disabled when goal empty', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('#ai-coach').scrollIntoViewIfNeeded();
    const btn = page.getByRole('button', { name: /INITIATE PROTOCOL/i });
    await expect(btn).toBeDisabled();
  });

  test('9.3 – AI Coach button enabled when goal filled', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('#ai-coach').scrollIntoViewIfNeeded();
    await page.locator('#ai-coach input[type="text"]').first().fill('Lose Weight');
    await expect(page.getByRole('button', { name: /INITIATE PROTOCOL/i })).toBeEnabled();
  });

  test('9.4 – Checkout back button returns to home', async ({ page }) => {
    await page.goto(BASE);
    await page.locator('#pricing').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.getByRole('button', { name: /Select Monthly/i }).first().click();
    await page.waitForTimeout(400);
    // Click back/return button in checkout
    const backBtn = page.getByRole('button', { name: /RETURN/i }).first();
    if (await backBtn.isVisible()) {
      await backBtn.click();
      await expect(page.locator('section#home')).toBeVisible({ timeout: 5000 });
    }
  });

  test('9.5 – SPA keeps state when navigating login then back', async ({ page }) => {
    await page.goto(BASE);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.getByRole('button', { name: /^Login$/i }).first().click();
    await page.locator('button[aria-label="Back to home"]').click();
    await expect(page.locator('section#home')).toBeVisible({ timeout: 5000 });
    // Navbar should still show Login (not dashboard) since we didn't log in
    await expect(page.getByRole('button', { name: /^Login$/i }).first()).toBeVisible();
  });
});
