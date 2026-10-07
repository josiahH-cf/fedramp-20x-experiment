import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./');
  await page.evaluate(() => window.localStorage.clear());
  await page.goto('./');
});

async function startTour(page) {
  await page.getByRole('button', { name: 'Start guided tour' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Meet the four actors' })).toBeVisible();
}

async function enterModule(page, name) {
  await page.getByRole('button', { name: 'Journey' }).click();
  await page.getByRole('dialog').getByRole('button', { name: new RegExp(name) }).click();
}

test('first-time state makes purpose and one primary start action obvious', async ({ page }) => {
  const errors = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.reload();
  await expect(page).toHaveTitle('FedRAMP 20x, Explained · Operations Park');
  await expect(page.getByRole('heading', { name: 'Follow one cloud service through FedRAMP 20x.' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start guided tour' })).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Explore modules' })).toBeVisible();
  await expect(page.getByText('By the end, you can explain:')).toBeVisible();
  expect(errors).toEqual([]);

  await startTour(page);
  await expect(page.locator('.module-route-button')).toHaveCount(5);
  await expect(page.locator('.scene-subroute button')).toHaveCount(2);
  await expect(page.getByText('Reading', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Northstar Cloud', { exact: true })).toBeVisible();
});

test('resume flow and versioned local progress survive a return visit', async ({ page }) => {
  await startTour(page);
  await enterModule(page, 'How a security claim becomes proof');
  await expect(page.getByRole('heading', { level: 1, name: 'Build an evidence chain' })).toBeVisible();
  await page.getByRole('link', { name: /FedRAMP 20x, Explained/ }).click();
  await expect(page.getByRole('button', { name: /Resume learning/ })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: /Resume learning/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Build an evidence chain' })).toBeVisible();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('fedramp-20x-learning-progress')));
  expect(saved.version).toBe(2);
  expect(saved.introComplete).toBe(true);
  expect(saved.lastSceneId).toBe('evidence');
});

test('training songs are optional homepage companions with the published titles and destinations', async ({ page }) => {
  const songs = page.getByRole('region', { name: 'Training songs', exact: true });
  await expect(songs.getByRole('heading', { name: 'Training songs', level: 2 })).toBeVisible();
  await expect(songs.getByText('These owner-published songs are optional companions to this learning resource. They are supplemental training aids, not authoritative FedRAMP guidance.')).toBeVisible();
  await expect(songs.getByRole('link', { name: /FedRAMP 20x Rap/ })).toHaveAttribute('href', 'https://suno.com/s/VY1YhApD3HSBITsO');
  await expect(songs.getByRole('link', { name: /PAIN Rating Country Mix/ })).toHaveAttribute('href', 'https://suno.com/song/8ed88711-1ca6-495b-bd83-7b1358bb8a26?sh=cGOHlOnIjoOKmoED');
  await expect(songs.getByText('A rap about FedRAMP 20x roles, security claims, and evidence.')).toBeVisible();
  await expect(songs.getByText('A country song about evaluating vulnerabilities and potential agency impact.')).toBeVisible();
  await expect(songs.getByRole('link')).toHaveCount(2);
  for (const link of await songs.getByRole('link').all()) {
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /\bnoopener\b/);
    await expect(link).toHaveAttribute('rel', /\bnoreferrer\b/);
    await expect(link).toContainText('Listen on Suno — opens in a new tab');
  }
  await expect(page.getByRole('button', { name: 'Start guided tour' })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Explore modules' })).toBeEnabled();
  expect(await page.evaluate(() => localStorage.getItem('fedramp-20x-learning-progress'))).toBeNull();
});

test('training songs support keyboard access, visible focus, and labelled external tabs', async ({ page, context }) => {
  // Test the site's navigation without depending on Suno's availability or redirects.
  await context.route('https://suno.com/**', (route) => route.fulfill({
    status: 200, contentType: 'text/html', body: '<title>External song destination</title>',
  }));
  await page.getByRole('button', { name: 'Explore modules' }).focus();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Training songs', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#training-songs$/);
  const songs = page.locator('#training-songs');
  await expect(songs).toBeFocused();
  const headerBottom = await page.locator('.app-header').evaluate((element) => element.getBoundingClientRect().bottom);
  await expect.poll(() => songs.evaluate((element) => element.getBoundingClientRect().top)).toBeGreaterThanOrEqual(headerBottom);
  for (const destination of ['https://suno.com/s/VY1YhApD3HSBITsO', 'https://suno.com/song/8ed88711-1ca6-495b-bd83-7b1358bb8a26?sh=cGOHlOnIjoOKmoED']) {
    await page.keyboard.press('Tab');
    const link = songs.locator(`a[href="${destination}"]`);
    await expect(link).toBeFocused();
    await expect(link).toBeInViewport({ ratio: 1 });
    const focusStyle = await link.evaluate((element) => ({ style: getComputedStyle(element).outlineStyle, width: getComputedStyle(element).outlineWidth }));
    expect(focusStyle).toEqual({ style: 'solid', width: '3px' });
    const popupPromise = page.waitForEvent('popup');
    await page.keyboard.press('Enter');
    const popup = await popupPromise;
    await expect(popup).toHaveURL(destination);
    await popup.close();
  }
});

test('training songs deep links preserve saved learning and resume the last scene', async ({ page }) => {
  await page.goto('./#training-songs');
  await expect(page.locator('#training-songs')).toBeFocused();
  await expect(page.getByRole('button', { name: 'Start guided tour' })).toBeEnabled();
  await startTour(page);
  await enterModule(page, 'How a security claim becomes proof');
  const saved = await page.evaluate(() => localStorage.getItem('fedramp-20x-learning-progress'));
  await page.goto('./#training-songs');
  await expect(page.locator('.workspace')).toHaveCount(0);
  await expect(page.locator('#training-songs')).toBeFocused();
  await expect(page.getByRole('button', { name: /Resume learning/ })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Start guided tour' })).toBeEnabled();
  expect(await page.evaluate(() => localStorage.getItem('fedramp-20x-learning-progress'))).toBe(saved);
  await page.reload();
  await expect(page.locator('#training-songs')).toBeFocused();
  expect(await page.evaluate(() => localStorage.getItem('fedramp-20x-learning-progress'))).toBe(saved);
  await page.getByRole('button', { name: /Resume learning/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Build an evidence chain' })).toBeVisible();
});

test('five-module journey preserves open navigation and scene/module deep links', async ({ page }) => {
  await startTour(page);
  await expect(page.locator('.module-route-button')).toHaveCount(5);
  await enterModule(page, 'What happens when a vulnerability appears');
  await expect(page.getByRole('heading', { level: 1, name: 'Watch more than scanner output' })).toBeVisible();
  await expect(page.locator('.scene-subroute button')).toHaveCount(4);
  await expect(page).toHaveURL(/#module-vulnerability$/);

  await page.goto('./#incident');
  await expect(page.getByRole('heading', { level: 1, name: 'Start communication clocks when federal customer data is at risk' })).toBeVisible();
  await expect(page).toHaveURL(/#incident$/);

  await page.goto('./#module-continuity');
  await expect(page.getByRole('heading', { level: 1, name: 'Keep the evidence and conversation moving' })).toBeVisible();
  await expect(page.locator('.scene-subroute button')).toHaveCount(2);
});

test('play/pause, reading progress, previous/next, speed, and manual mode preserve learner control', async ({ page }) => {
  await startTour(page);
  const reading = page.getByRole('progressbar', { name: 'Reading progress for this explanation' });
  await expect.poll(async () => Number(await reading.getAttribute('aria-valuenow'))).toBeGreaterThan(0);
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  const pausedAt = await reading.getAttribute('aria-valuenow');
  await page.waitForTimeout(300);
  expect(await reading.getAttribute('aria-valuenow')).toBe(pausedAt);

  await page.getByRole('button', { name: 'Next step' }).click();
  await expect(page.getByText('Evidence must be objective', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Previous step' }).click();
  await expect(page.getByText('Your service is the park', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('button', { name: 'Manual reading mode' }).click();
  await page.getByRole('button', { name: 'Brisk' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'Play', exact: true }).click();
  const manualAt = await reading.getAttribute('aria-valuenow');
  await page.waitForTimeout(300);
  expect(await reading.getAttribute('aria-valuenow')).toBe(manualAt);
  await expect(page.getByText('Guided tour · manual', { exact: true }).first()).toBeVisible();
  const preference = await page.evaluate(() => JSON.parse(localStorage.getItem('fedramp-20x-learning-progress')).preferences);
  expect(preference.manualReading).toBe(true);
  expect(preference.speed).toBe(1.5);
});

test('landmarks, tracked service, and deterministic camera controls are directly inspectable', async ({ page }) => {
  await startTour(page);
  const world = page.locator('#campus-world');
  const initialView = (await world.getAttribute('viewBox')).split(' ').map(Number);
  await page.getByRole('button', { name: 'Zoom in' }).click();
  const zoomedView = (await world.getAttribute('viewBox')).split(' ').map(Number);
  expect(zoomedView[2]).toBeLessThan(initialView[2]);
  await page.getByRole('button', { name: 'Fit whole campus' }).click();
  await expect(world).toHaveAttribute('viewBox', '0 0 1000 620');
  await page.getByRole('button', { name: 'Follow the tracked service' }).click();
  await expect(page.getByRole('button', { name: 'Follow the tracked service' })).toHaveAttribute('aria-pressed', 'true');

  const landmark = page.getByRole('button', { name: /Inspect module 01/ });
  await landmark.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { name: 'Decision Gate' })).toBeVisible();
  expect(await page.evaluate(() => document.activeElement.closest('dialog')?.id)).toBe('inspector-dialog');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();

  await page.getByRole('button', { name: 'Inspect tracked service details' }).click();
  await expect(page.getByRole('dialog').getByRole('heading', { name: 'One service, one continuous evidence trail' })).toBeVisible();
});

test('role routing, evidence assembly, and module checks give explanatory retry feedback', async ({ page }) => {
  await startTour(page);
  await page.getByRole('button', { name: 'Cloud provider', exact: true }).click();
  await expect(page.getByText('Try another handoff', { exact: true })).toBeVisible();
  await expect(page.getByText('Paused', { exact: true }).first()).toBeVisible();
  await page.getByRole('button', { name: 'Independent assessor', exact: true }).click();
  await expect(page.getByText('Evidence routed correctly', { exact: true })).toBeVisible();

  await page.goto('./#evidence');
  await page.getByRole('button', { name: /Validate that it works/ }).click();
  await expect(page.getByText('That step comes later', { exact: true })).toBeVisible();
  for (const label of ['Explain the security decision', 'Define a measure and operating cycle', 'Collect objective evidence', 'Verify that the requirement was fulfilled', 'Validate that it works and is fit for use']) {
    await page.getByRole('button', { name: label, exact: true }).click();
  }
  await expect(page.getByText('Claim became reviewable proof', { exact: true })).toBeVisible();
  await expect(page.getByText('Evidence chain assembled', { exact: true })).toBeVisible();

  await page.goto('./#profile');
  await page.getByRole('button', { name: 'FedRAMP', exact: true }).click();
  await expect(page.getByText('Review this idea and retry', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'The federal agency', exact: true }).click();
  await expect(page.getByText('Understood', { exact: true })).toBeVisible();
  await expect(page.getByText('Module 01 complete', { exact: false })).toBeVisible();
});

test('profile and vulnerability decisions visibly alter the tracked system state', async ({ page }) => {
  await page.goto('./#profile');
  await page.getByRole('button', { name: 'D', exact: true }).click();
  await expect(page.getByText('Class D applied to the service', { exact: true })).toBeVisible();
  await expect(page.getByText('Future phase—planning context only', { exact: true })).toBeVisible();

  await page.goto('./#detect');
  await page.getByRole('button', { name: 'Detect a service weakness' }).click();
  await expect(page.getByText('Finding V-204 entered the shared queue', { exact: true })).toBeVisible();
  await expect(page.locator('#campus-world')).toHaveAttribute('data-finding', 'detected');

  await page.goto('./#evaluate');
  await page.getByRole('button', { name: 'D', exact: true }).first().click();
  await page.getByRole('button', { name: 'N5', exact: true }).click();
  await page.getByRole('button', { name: 'Reveal the response path' }).click();
  await expect(page.getByText('12 hours', { exact: true })).toBeVisible();

  await page.goto('./#respond');
  await page.getByRole('button', { name: /Partially mitigated/ }).click();
  await expect(page.getByText('Finding remains visibly open', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: /Remediated/ }).click();
  await expect(page.getByText('Finding closed by remediation', { exact: true })).toBeVisible();
  await expect(page.locator('#campus-world')).toHaveAttribute('data-finding', 'remediated');

  await page.goto('./#report');
  for (const label of [
    'What changed and when',
    'Agency-relevant impact and current state',
    'Next risk-reduction action and target',
    'Enough detail for a decision without exploit-enabling secrets',
    'A valid machine-readable record',
  ]) {
    await page.getByRole('button', { name: label, exact: true }).click();
  }
  await page.getByRole('button', { name: 'Publish to the trust center', exact: true }).click();
  await expect(page.getByText('Human and machine-readable trail published', { exact: true })).toBeVisible();
});

test('incident, change, and ongoing-monitoring interactions expose parallel paths and causal state', async ({ page }) => {
  await page.goto('./#incident');
  await page.getByRole('button', { name: 'Yes', exact: true }).click();
  await page.getByRole('button', { name: 'D', exact: true }).click();
  await page.getByRole('button', { name: 'N5', exact: true }).click();
  await expect(page.getByText('15 minutes', { exact: true })).toBeVisible();
  await expect(page.getByText('Incident communication runs in parallel', { exact: true })).toBeVisible();

  await page.goto('./#change');
  await page.getByRole('button', { name: /Replace the identity plane/ }).click();
  await expect(page.getByText('Transformative', { exact: true }).first()).toBeVisible();
  await expect(page.locator('#campus-world')).toHaveAttribute('data-change', 'transformative');
  await page.getByRole('button', { name: /Contain an active compromise/ }).click();
  await expect(page.locator('.change-route-result > strong')).toHaveText('Emergency');
  await expect(page.locator('.change-route-result > p')).toContainText('MAY execute first');

  await page.goto('./#monitor');
  for (const label of ['Release the Ongoing Certification Report', 'Hold the Quarterly Review 3–10 business days later', 'Keep trust-center and feedback access open', 'Begin the next three-month cycle']) {
    await page.getByRole('button', { name: label, exact: true }).click();
  }
  await expect(page.getByText('Ongoing trust loop assembled', { exact: true })).toBeVisible();
  await expect(page.getByText('assembled', { exact: true })).toBeVisible();
});

test('capstone connects the full process and permits respectful retry', async ({ page }) => {
  await page.goto('./#recap');
  await page.getByRole('button', { name: 'Close it because the scanner already found it' }).click();
  await expect(page.getByText('Try again', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Review the relevant step' })).toBeVisible();
  await page.getByRole('button', { name: /Evaluate reachability/ }).click();
  await expect(page.getByText('Correct route', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: /Run initial, ongoing/ })).toBeVisible();
  await page.getByRole('button', { name: /Run initial, ongoing/ }).click();
  await page.getByRole('button', { name: /Update evidence and reports/ }).click();
  await expect(page.getByText('3 of 3 decisions understood', { exact: true })).toBeVisible();
});

test('reference layer retains searchable rules, KSI outcomes, matrices, schemas, and accuracy boundaries', async ({ page }) => {
  await page.getByRole('button', { name: 'Reference' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { name: 'Exact detail without crowding the tour' })).toBeVisible();
  await expect(dialog.getByRole('tab', { name: 'Glossary · 75' })).toBeVisible();
  await dialog.getByRole('tab', { name: 'Rules · 60' }).click();
  await expect(dialog.getByRole('heading', { name: 'What MUST, SHOULD, and MAY mean' })).toBeVisible();
  await expect(dialog.getByText('17 of 17 rulesets', { exact: true })).toBeVisible();
  await dialog.getByPlaceholder('Search this section').fill('VDR-CSO-DET');
  await expect(dialog.getByText('VDR-CSO-DET', { exact: true })).toBeVisible();
  await dialog.getByRole('tab', { name: 'KSI outcomes · 46' }).click();
  await expect(dialog.getByText('official outcome restored', { exact: true }).first()).toBeVisible();
  await dialog.getByRole('tab', { name: 'Matrices & schemas' }).click();
  await expect(dialog.getByText('Eight supplied JSON schemas', { exact: true })).toBeVisible();
  await dialog.getByRole('tab', { name: 'Sources & accuracy' }).click();
  await expect(dialog.getByRole('heading', { name: 'About this simulation and its accuracy' })).toBeVisible();
  for (const heading of ['Directly represented from the rules', 'Simplified for learning', 'Illustrative visual metaphor', 'Where to verify the official requirement', 'Last content verification date']) {
    await expect(dialog.getByRole('heading', { name: heading })).toBeVisible();
  }
});

test('all twelve deterministic scene deep links resolve to their novice-facing destination', async ({ page }) => {
  const destinations = {
    arrival: 'Meet the four actors',
    profile: 'Choose the service’s certification profile',
    evidence: 'Build an evidence chain',
    ksi: 'Explore measurable security outcomes',
    detect: 'Watch more than scanner output',
    evaluate: 'Prioritize the finding in service context',
    respond: 'Reduce risk without hiding what remains',
    report: 'Publish a safe, reviewable activity trail',
    incident: 'Start communication clocks when federal customer data is at risk',
    change: 'Route routine, adaptive, transformative, or emergency work',
    monitor: 'Keep the evidence and conversation moving',
    recap: 'Put the full process together',
  };

  for (const [id, heading] of Object.entries(destinations)) {
    await page.goto(`./#${id}`);
    await expect(page.locator('#scene-title')).toHaveText(heading);
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
  }
});

test('keyboard controls, reduced motion, and reset preserve accessible user control', async ({ page }) => {
  await startTour(page);
  await page.keyboard.press('Space');
  await expect(page.getByText('Paused', { exact: true }).first()).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByText('Evidence must be objective', { exact: true })).toBeVisible();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByText('Your service is the park', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('button', { name: 'Reduced motion' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.locator('.app-shell')).toHaveAttribute('data-motion', 'reduced');
  await page.reload();
  await expect(page.locator('.app-shell')).toHaveAttribute('data-motion', 'reduced');

  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('button', { name: 'Reset progress' }).click();
  await page.getByRole('button', { name: 'Confirm reset progress' }).click();
  await expect(page.getByRole('button', { name: 'Start guided tour' })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('fedramp-20x-learning-progress'))).toBeNull();
});

test('mobile composition is readable, touch-friendly, overflow-free, and uses a bottom-sheet inspector', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('mobile'), 'Mobile-specific composition assertion.');
  await page.setViewportSize({ width: 320, height: 700 });
  await page.reload();
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  expect(await page.locator('.welcome-lede').evaluate((element) => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(16);
  await page.getByRole('link', { name: 'Training songs', exact: true }).click();
  for (const link of await page.locator('#training-songs a').all()) {
    await expect(link).toBeInViewport({ ratio: 1 });
    const box = await link.boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(320);
  }
  await startTour(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  for (const name of ['Previous step', 'Pause', 'Next step']) {
    const box = await page.getByRole('button', { name }).boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.width).toBeGreaterThanOrEqual(44);
  }
  await page.getByRole('button', { name: /Inspect module 01/ }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const style = await dialog.evaluate((element) => ({ position: getComputedStyle(element).position, radius: getComputedStyle(element).borderTopLeftRadius }));
  expect(style.position).toBe('fixed');
  expect(parseFloat(style.radius)).toBeGreaterThan(0);
  expect(await page.evaluate(() => Boolean(document.activeElement.closest('dialog')))).toBe(true);
});

test('production preview uses repository-relative assets without failed requests or unlabeled controls', async ({ page }) => {
  const failed = [];
  const errors = [];
  page.on('requestfailed', (request) => failed.push(request.url()));
  page.on('response', (response) => { if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`); });
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.reload({ waitUntil: 'networkidle' });
  const script = await page.locator('script[type="module"]').getAttribute('src');
  const stylesheet = await page.locator('link[rel="stylesheet"]').getAttribute('href');
  expect(script).toMatch(/^\.\/assets\//);
  expect(stylesheet).toMatch(/^\.\/assets\//);
  const unlabeled = await page.evaluate(() => [...document.querySelectorAll('button')].filter((button) => button.offsetParent !== null && !(button.getAttribute('aria-label') || button.innerText.trim())).length);
  expect(unlabeled).toBe(0);
  expect(failed).toEqual([]);
  expect(errors).toEqual([]);
});
