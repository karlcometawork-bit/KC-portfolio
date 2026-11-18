import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
const base = process.env.TEST_URL || 'http://127.0.0.1:8000/KC-portfolio/';
const browser = await chromium.launch();
mkdirSync('test-results', {recursive: true});
try {
  for (const width of [360, 768, 1440]) {
    const page = await browser.newPage({viewport:{width,height:900}, reducedMotion:'reduce'});
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    const response = await page.goto(base);
    assert.equal(response.status(), 200);
    await page.getByRole('heading', {level:1}).waitFor();
    assert.match(await page.locator('h1').innerText(), /Growth Systems Specialist/);
    assert.equal(await page.locator('.case-study').count(), 4);
    assert.equal(await page.locator('.portfolio-item').count(),15);
    assert.equal(await page.locator('.highlight-tile').count(),3);
    assert.equal(await page.locator('.highlight-tile strong').first().innerText(),'196.4K');
    assert.match(await page.locator('.highlights-note').innerText(),/team\/account activity/);
    assert.equal(await page.locator('#wingman-results').count(),1);
    assert.equal(await page.locator('#nextwave-results').count(),1);
    assert.equal(await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(9, 9, 11)');
    assert(!(await page.locator('h1 span').evaluate(el=>getComputedStyle(el).fontFamily)).includes('Georgia'));
    await page.locator('[data-wing-metric="interactions"]').click();
    assert.equal(await page.locator('[data-wing-total]').innerText(),'4,517');
    assert.equal(await page.locator('[data-wing-value="1"]').innerText(),'1,107');
    assert.match(await page.locator('[data-wing-chart]').getAttribute('aria-label'),/interactions/);
    await page.locator('[data-wing-metric="views"]').click();
    assert.equal(await page.locator('[data-wing-total]').innerText(),'196,419');
    await page.locator('[data-next-metric="spend"]').click();
    assert.equal(await page.locator('[data-next-highlight]').innerText(),'$120.63');
    assert.equal(await page.locator('[data-next-value="0"]').innerText(),'$231.09');
    await page.locator('[data-next-metric="cost"]').click();
    assert.equal(await page.locator('[data-next-highlight]').innerText(),'$0.256');
    assert.match(await page.locator('[data-next-note]').innerText(),/not a conversion-lift claim/);
    await page.locator('[data-next-metric="conversations"]').click();
    assert.equal(await page.locator('[data-next-highlight]').innerText(),'472');
    await page.locator('[data-chart-mode="share"]').click();
    assert.equal(await page.locator('[data-chart-value="new"]').innerText(),'44.9%');
    assert.equal(await page.locator('[data-chart-value="returning"]').innerText(),'55.1%');
    await page.locator('[data-chart-mode="count"]').click();
    assert.equal(await page.locator('[data-chart-value="new"]').innerText(),'162');
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Horizontal overflow at '+width);
    for (const img of await page.locator('img[src]').all()) {
      await img.scrollIntoViewIfNeeded();
      await img.evaluate(el => el.decode());
    }
    for (const link of await page.locator('a[href^="#"]').all()) {
      const id = (await link.getAttribute('href')).slice(1);
      assert.equal(await page.locator('[id="'+id+'"]').count(),1);
    }
    if(width <= 980) {
      await page.locator('.menu-toggle').click();
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');
      await page.locator('.nav-links a').first().click();
      assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
    }
    await page.locator('[data-filter="hospitality"]').click();
    assert.equal(await page.locator('.portfolio-item:visible').count(),4);
    assert.equal(await page.locator('.gallery-count').innerText(),'4 pieces');
    await page.locator('[data-filter="all"]').click();
    const art = page.locator('.portfolio-item').first();
    await art.click();
    assert.equal(await page.locator('.lightbox').getAttribute('aria-hidden'),'false');
    await page.keyboard.press('Tab');
    assert(await page.locator('.lightbox').evaluate(el=>el.contains(document.activeElement)));
    const initialImage = await page.locator('.lightbox img').getAttribute('src');
    await page.keyboard.press('ArrowRight');
    assert.notEqual(await page.locator('.lightbox img').getAttribute('src'), initialImage);
    assert((await page.locator('#lightbox-caption').innerText()).length > 20);
    await page.keyboard.press('ArrowLeft');
    assert.equal(await page.locator('.lightbox img').getAttribute('src'), initialImage);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.lightbox').getAttribute('aria-hidden'),'true');
    assert(await art.evaluate(el=>el===document.activeElement));
    const cv=await page.request.get(new URL('Karl_Cometa_CV.pdf',base).href);
    assert.equal(cv.status(),200); assert((await cv.body()).subarray(0,5).equals(Buffer.from('%PDF-')));
    assert.equal(errors.length,0,errors.join('\n'));
    await page.goto(base); await page.screenshot({path:'test-results/'+width+'.png',fullPage:true});
    await page.close();
  }
  const page=await browser.newPage({javaScriptEnabled:false});
  await page.goto(base);
  assert(await page.locator('h1').isVisible());
  assert(await page.locator('#featured').isVisible());
  console.log('PASS: black theme, sans-serif type, Wingman/Next Wave chart metrics, 15 artworks, chart modes, captioned modal navigation, 360/768/1440 widths, media, anchors, menu, filters, lightbox keyboard, CV, no-JS content.');
} finally { await browser.close(); }
