import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./');
});

test('loads without console errors and exposes the complete guided model', async ({ page }) => {
  const errors = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await expect(page.getByRole('heading', { name: 'Open the operations park' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Learning scenes' }).getByRole('button')).toHaveCount(12);
  await expect(page.getByText('Held', { exact: true })).toBeVisible();
  await expect(page.getByRole('slider', { name: 'Seek through the complete learning sequence' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('play, pause, hold, scene navigation, seek, and restart preserve state correctly', async ({ page }) => {
  const slider = page.getByRole('slider', { name: 'Seek through the complete learning sequence' });
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  await expect(page.getByText('Playing', { exact: true })).toBeVisible();
  await expect.poll(async () => Number(await slider.inputValue())).toBeGreaterThan(0);

  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  const pausedAt = await slider.inputValue();
  await page.waitForTimeout(250);
  expect(await slider.inputValue()).toBe(pausedAt);

  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Choose the certification profile' })).toBeVisible();
  await page.getByRole('button', { name: 'Previous', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Open the operations park' })).toBeVisible();

  await slider.evaluate((element) => {
    element.value = '650';
    element.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await expect(page.getByRole('heading', { name: 'Dispatch mitigation and remediation' })).toBeVisible();
  await page.getByRole('button', { name: 'Hold', exact: true }).click();
  await expect(page.getByText('Held', { exact: true })).toBeVisible();
  const heldAt = Number(await slider.inputValue());
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  await expect.poll(async () => Number(await slider.inputValue())).toBeGreaterThan(heldAt);
  await page.getByRole('button', { name: 'Hold', exact: true }).click();
  await page.getByRole('button', { name: 'Restart', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Open the operations park' })).toBeVisible();
  expect(await slider.inputValue()).toBe('0');
});

test('overview, library, sources, and deterministic calculators are interactive', async ({ page }) => {
  await page.getByRole('button', { name: 'Overview' }).click();
  await expect(page.getByRole('dialog').getByRole('heading', { name: 'The complete learning route' })).toBeVisible();
  await page.getByRole('dialog').getByRole('button', { name: /Scene 7:/ }).click();
  await expect(page.getByRole('heading', { name: 'Dispatch mitigation and remediation' })).toBeVisible();

  await page.getByRole('button', { name: 'D', exact: true }).first().click();
  await page.getByRole('button', { name: 'N5', exact: true }).click();
  await expect(page.getByText('12 hours', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Known Exploited Vulnerability/ }).click();
  await expect(page.getByText('CISA KEV due date', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Library' }).click();
  await expect(page.getByRole('dialog').getByText('Rulesets · 17', { exact: true })).toBeVisible();
  await page.getByRole('tab', { name: 'Explicit rules · 60' }).click();
  await expect(page.getByRole('dialog').getByText('VDR-CSO-DET', { exact: true }).first()).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();

  await page.getByRole('button', { name: 'Sources' }).click();
  await expect(page.getByRole('dialog').getByText('Five current outcomes restored', { exact: true })).toBeVisible();
});

test('keyboard controls and reduced-motion preference remain usable', async ({ page }) => {
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('heading', { name: 'Choose the certification profile' })).toBeVisible();
  await page.keyboard.press('Space');
  await expect(page.getByText('Playing', { exact: true })).toBeVisible();
  await page.keyboard.press('KeyH');
  await expect(page.getByText('Held', { exact: true })).toBeVisible();
  await page.keyboard.press('KeyR');
  await expect(page.getByRole('heading', { name: 'Open the operations park' })).toBeVisible();
  const motion = page.getByRole('button', { name: /motion/i });
  await motion.click();
  await expect(motion).toHaveAttribute('aria-pressed', /true|false/);
});

test('every scene and animation beat is reachable through sequence seeking', async ({ page }) => {
  const expectedHeadings = [
    'Open the operations park', 'Choose the certification profile', 'Power the evidence foundry',
    'Build the KSI neighborhoods', 'Switch on the detection grid', 'Route the finding through evaluation',
    'Dispatch mitigation and remediation', 'Relay the machine-readable trail', 'Raise the incident beacon',
    'Route work through the change yard', 'Keep authorization operations alive', 'Commission the full operating loop',
  ];
  const slider = page.getByRole('slider', { name: 'Seek through the complete learning sequence' });
  for (let index = 0; index < expectedHeadings.length; index += 1) {
    await slider.evaluate((element, value) => {
      element.value = String(value);
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }, index * 100 + 72);
    await expect(page.getByRole('heading', { name: expectedHeadings[index] })).toBeVisible();
    await expect(page.locator('#beat-title')).not.toHaveText('');
  }
});

test('deep links open the requested scene', async ({ page }) => {
  await page.goto('./#incident');
  await expect(page.getByRole('heading', { name: 'Raise the incident beacon' })).toBeVisible();
  await expect(page).toHaveURL(/#incident$/);
});

test('small screens avoid page-level horizontal overflow and retain controls', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('mobile'), 'Mobile-only layout assertion.');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.getByRole('button', { name: 'Play', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await expect(page.getByText('20x · Program · Class C')).toBeVisible();
});
