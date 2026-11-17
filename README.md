# Karl Cometa — Portfolio V2

Static HTML/CSS/JavaScript portfolio. Work only in karlcometawork-bit/KC-portfolio.
Original repository karlcometa/KC-portfolio is preserved.

## Update
- Edit index.html for content, style.css for design, script.js for interactions.
- Use the canonical CV path Karl_Cometa_CV.pdf. The alternate CV filename is an identical existing blob.
- Add approved promotional artwork, a descriptive alt text and a gallery category.
- Preserve reporting periods and distinguish team outcomes, personal contributions and activity metrics.
- Before adding results, record the source, period, metric definition, attribution and publication permission in docs/EVIDENCE.md.
- Never embed private chats, customer photos, unredacted trackers or account identifiers.

## Preview and test
Python 3.12 and Node 22:
1. python scripts/build.py
2. npm install
3. npx playwright install chromium
4. Serve _site under /KC-portfolio/ on port 8000.
5. npm test (or set TEST_URL to a deployed URL ending in /).

The build copies only referenced site files plus SEO metadata. ZIP archives, unused PDFs, internal screenshots, source documentation and unreviewed videos stay out of the Pages artifact. Existing files remain in git for history/access; the repository itself is public.

## Publish
In this repository only, Settings → Pages → Build and deployment → Source: GitHub Actions.
Forks may also require enabling Actions in the Actions tab.
Merge a tested PR into main. Portfolio checks and Pages validates subpath links, mobile/desktop overflow, images, CV, filters, menu, keyboard lightbox and no-JavaScript content before deployment.
Expected address: https://karlcometawork-bit.github.io/KC-portfolio/
Confirm /version.json commit matches the deployed commit. Inspect browser-checks artifacts at 360, 768 and 1440 pixels. Do not call a deployment verified until the workflow passes and the live version is checked.

## Content limitations
See docs/EVIDENCE.md and docs/AUDIT.md. No aggregate PROHUB revenue/order verification, approved Next Wave/Wingman artifacts, or independent AOP export validation is claimed. Existing CV is retained; its detailed claims need a separate document review.
