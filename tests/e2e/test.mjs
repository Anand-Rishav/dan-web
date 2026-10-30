// DAN SERVICES end-to-end regression suite.
// Usage:
//   1. Start the dev server:  npm run dev
//   2. Run:                   npm run test:e2e
// Against another target:     BASE_URL=https://www.danservices.in npm run test:e2e
// NOTE: form submissions are route-mocked (never hit the real lead APIs), so
// this suite is safe to run against production.
import { firefox } from "playwright";
import fs from "node:fs";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const SHOTS = process.cwd() + "/gui-test-screenshots";
fs.mkdirSync(SHOTS, { recursive: true });

const results = [];
const shot = async (page, name) => {
  await page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: false });
};

const check = (id, pass, detail = "") => {
  results.push({ id, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${id}${detail ? ` — ${detail}` : ""}`);
};

const browser = await firefox.launch({ headless: true });

// ---------- Desktop context ----------
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await context.newPage();
page.setDefaultTimeout(60000);

const consoleErrors = [];
const pageErrors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text().slice(0, 300));
});
page.on("pageerror", (err) => pageErrors.push(String(err).slice(0, 300)));

// Mock the brand API so submissions never reach the real backend.
let brandMockStatus = 201;
const capturedBrandPosts = [];
await context.route("**/api/leads/brand", async (route) => {
  capturedBrandPosts.push(route.request().postData());
  await route.fulfill({
    status: brandMockStatus,
    contentType: "application/json",
    body: JSON.stringify(
      brandMockStatus === 201
        ? { success: true, message: "Inquiry received successfully." }
        : { error: "Request failed" },
    ),
  });
});

// T1 — homepage loads
await page.goto(BASE, { timeout: 60000 });
await page.waitForLoadState("domcontentloaded");
await page.getByRole("button", { name: "Launch Campaign →", exact: true }).waitFor();
await check("T1 home loads, hero CTA visible", true);
await shot(page, "t1_home_desktop");

// T2 — navbar + footer
const navCount = await page.locator('nav[aria-label="Main navigation"]').count();
const footerPrivacy = await page.locator('footer a[href="/privacy"]').count();
const footerTerms = await page.locator('footer a[href="/terms"]').count();
const footerFtc = await page.locator('footer a[href="/ftc-disclosure"]').count();
check(
  "T2 navbar + footer legal links",
  navCount === 1 && footerPrivacy === 1 && footerTerms === 1 && footerFtc === 1,
  `nav=${navCount} privacy=${footerPrivacy} terms=${footerTerms} ftc=${footerFtc}`,
);

// Lenis conflict fix: html must not use CSS smooth scrolling
const scrollBehavior = await page.evaluate(
  () => getComputedStyle(document.documentElement).scrollBehavior,
);
check("T2b html scroll-behavior is auto (Lenis owns scrolling)", scrollBehavior === "auto", `got "${scrollBehavior}"`);

// T2c — canonical domain must be www.danservices.in (not the unused .com)
const canonical = await page.locator('meta[property="og:url"]').getAttribute("content").catch(() => null);
check(
  "T2c og:url points at www.danservices.in",
  !!canonical && canonical.startsWith("https://www.danservices.in"),
  canonical || "missing",
);

// T3 — hero CTA opens brand modal; Escape closes it
await page.getByRole("button", { name: "Launch Campaign →", exact: true }).click();
await page.getByText("Agency Brand Strategy Intake").waitFor();
check("T3a hero CTA opens brand modal", true);
await shot(page, "t3a_brand_modal_open");
await page.keyboard.press("Escape");
await page.waitForTimeout(400);
const dialogAfterEsc = await page.getByRole("dialog").count();
check("T3b Escape closes brand modal", dialogAfterEsc === 0, `dialogs=${dialogAfterEsc}`);

// T4 — full brand flow, verify payload carries website
await page.getByRole("button", { name: "Launch Campaign →", exact: true }).click();
await page.getByText("Agency Brand Strategy Intake").waitFor();
const dlg = page.getByRole("dialog");
await dlg.locator("#brand-company").fill("Acme Corp");
await dlg.locator("#brand-website").fill("https://acme.com");
await dlg.locator("#brand-contact").fill("Jane Doe");
await dlg.locator("#brand-email").fill("jane@acme.com");
await dlg.getByRole("button", { name: "Continue to Platforms & Budget →" }).click();
await dlg.locator("#brand-timeline").selectOption("Next 30 days");
await dlg.getByRole("button", { name: "Next: Goals & Finalize →" }).click();
await dlg.getByRole("button", { name: "Submit Campaign Strategy" }).click();
await dlg.getByText("Campaign Strategy Inbound Confirmed").waitFor();
await shot(page, "t4_brand_success");
const payload4 = JSON.parse(capturedBrandPosts.at(-1));
check(
  "T4 payload has website, no interestedCreator",
  payload4.website === "https://acme.com" && payload4.interestedCreator === undefined,
  JSON.stringify({ website: payload4.website, interestedCreator: payload4.interestedCreator }),
);
check(
  "T4b payload core fields",
  payload4.companyName === "Acme Corp" && payload4.timeline === "Next 30 days",
  JSON.stringify({ companyName: payload4.companyName, timeline: payload4.timeline }),
);
await dlg.getByRole("button", { name: "Done & Return to Site" }).click();
await page.waitForTimeout(400);

// T5 — API failure shows real error state (was: fake success)
brandMockStatus = 500;
await page.getByRole("button", { name: "Launch Campaign →", exact: true }).click();
await page.getByText("Agency Brand Strategy Intake").waitFor();
const dlg5 = page.getByRole("dialog");
await dlg5.locator("#brand-company").fill("Fail Corp");
await dlg5.locator("#brand-contact").fill("Bad Luck");
await dlg5.locator("#brand-email").fill("bad@fail.com");
await dlg5.getByRole("button", { name: "Continue to Platforms & Budget →" }).click();
await dlg5.getByRole("button", { name: "Next: Goals & Finalize →" }).click();
await dlg5.getByRole("button", { name: "Submit Campaign Strategy" }).click();
await dlg5.getByText("Submission Failed").waitFor();
const tryAgain = await dlg5.getByRole("button", { name: "Try Again" }).count();
check("T5 API 500 shows Submission Failed + Try Again", tryAgain === 1);
await shot(page, "t5_error_state");

// T5b — rate-limited response shows the specific "Too Many Attempts" state
brandMockStatus = 429;
await dlg5.getByRole("button", { name: "Try Again" }).click();
await page.waitForTimeout(200);
await dlg5.getByRole("button", { name: "Submit Campaign Strategy" }).click();
await dlg5.getByText("Too Many Attempts").waitFor();
const rateMsg = await dlg5.getByText(/short window/).count();
check("T5b 429 shows 'Too Many Attempts' + wait message", rateMsg === 1);
await shot(page, "t5b_rate_limited");
await dlg5.getByRole("button", { name: "Close", exact: true }).click();
brandMockStatus = 201;
await page.waitForTimeout(400);

// T6 — ROI calculator Lock In prefills budget bucket
await page.locator("#roi-calculator").scrollIntoViewIfNeeded();
const slider = page.locator('#roi-calculator input[type="range"]');
await slider.fill("150000");
await page.waitForTimeout(200);
await page.getByRole("button", { name: "Lock In This Campaign Strategy" }).click();
await page.getByText("Agency Brand Strategy Intake").waitFor();
const dlg6 = page.getByRole("dialog");
await dlg6.locator("#brand-company").fill("ROI Corp");
await dlg6.locator("#brand-contact").fill("Jane ROI");
await dlg6.locator("#brand-email").fill("roi@corp.com");
await dlg6.getByRole("button", { name: "Continue to Platforms & Budget →" }).click();
const budgetVal = await page.locator("#brand-budget").inputValue();
check(
  "T6 Lock In prefills budget $150k → $50k-$150k",
  budgetVal === "$50k-$150k",
  `select="${budgetVal}"`,
);
await shot(page, "t6_roi_prefill");
await page.keyboard.press("Escape");
await page.waitForTimeout(400);

// T7 — Book Creator prefills creator chip + platforms
const alexCard = page.locator("div", { has: page.getByRole("heading", { name: "Alex Chen" }) }).filter({ hasText: "Book Creator" }).last();
await alexCard.getByRole("button", { name: "Book Creator" }).scrollIntoViewIfNeeded();
await alexCard.getByRole("button", { name: "Book Creator" }).click();
await page.getByText("Agency Brand Strategy Intake").waitFor();
const dlg7 = page.getByRole("dialog");
const chip = await dlg7.getByText("Re: Booking Alex Chen").count();
check("T7a Book Creator shows 'Re: Booking Alex Chen' chip", chip === 1);
await shot(page, "t7_booking_prefill");
await dlg7.locator("#brand-company").fill("Brand X");
await dlg7.locator("#brand-contact").fill("Recruiter");
await dlg7.locator("#brand-email").fill("x@brand.com");
await dlg7.getByRole("button", { name: "Continue to Platforms & Budget →" }).click();
const pressed = {};
for (const label of ["YouTube", "TikTok", "Instagram", "X / Twitter", "LinkedIn"]) {
  pressed[label] = await dlg7.getByRole("button", { name: label, exact: true }).getAttribute("aria-pressed");
}
check(
  "T7b creator platforms preselected (YouTube + X)",
  pressed["YouTube"] === "true" && pressed["X / Twitter"] === "true" && pressed["TikTok"] === "false" && pressed["Instagram"] === "false" && pressed["LinkedIn"] === "false",
  JSON.stringify(pressed),
);
await dlg7.getByRole("button", { name: "Next: Goals & Finalize →" }).click();
await dlg7.getByRole("button", { name: "Submit Campaign Strategy" }).click();
await dlg7.getByText("Campaign Strategy Inbound Confirmed").waitFor();
const payload7 = JSON.parse(capturedBrandPosts.at(-1));
check(
  "T7c payload carries interestedCreator + creator platforms",
  payload7.interestedCreator === "Alex Chen" && payload7.platforms.includes("youtube") && payload7.platforms.includes("x"),
  JSON.stringify({ interestedCreator: payload7.interestedCreator, platforms: payload7.platforms }),
);
await dlg7.getByRole("button", { name: "Done & Return to Site" }).click();
await page.waitForTimeout(400);

// T12 — marquee structure (flat 2x items, second half aria-hidden)
const marquee = await page.evaluate(() => {
  const track = document.querySelector(".animate-marquee");
  if (!track) return null;
  const kids = [...track.children];
  const half = kids.length / 2;
  const firstHalfVisible = kids.slice(0, half).every((k) => k.getAttribute("aria-hidden") !== "true");
  const secondHalfHidden = kids.slice(half).every((k) => k.getAttribute("aria-hidden") === "true");
  return { items: kids.length, even: kids.length % 2 === 0, firstHalfVisible, secondHalfHidden };
});
check(
  "T12 marquee: exactly 2 copies, second half aria-hidden",
  !!marquee && marquee.even && marquee.items >= 4 && marquee.firstHalfVisible && marquee.secondHalfHidden,
  JSON.stringify(marquee),
);

// OG image meta
const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content").catch(() => null);
check("T12b og:image meta present", !!ogImage, ogImage);

// T9 — /roi-calculator sub-page: shell + Lock In works
await page.goto(`${BASE}/roi-calculator`, { timeout: 60000 });
await page.getByRole("button", { name: "Lock In This Campaign Strategy" }).first().waitFor();
const subNav = await page.locator('nav[aria-label="Main navigation"]').count();
const subFooter = await page.locator("footer").count();
check("T9a /roi-calculator has navbar + footer", subNav === 1 && subFooter === 1, `nav=${subNav} footer=${subFooter}`);
await shot(page, "t9_roi_subpage");
await page.getByRole("button", { name: "Lock In This Campaign Strategy" }).first().click();
await page.getByText("Agency Brand Strategy Intake").waitFor();
check("T9b sub-page Lock In opens modal", true);
await page.keyboard.press("Escape");
await page.waitForTimeout(300);

// T10 — other sub-pages: title, h1, shell
const pageMeta = [
  "/about",
  "/services",
  "/case-studies",
  "/talent-roster",
  "/privacy",
  "/terms",
  "/ftc-disclosure",
];
for (const path of pageMeta) {
  await page.goto(`${BASE}${path}`, { timeout: 60000 });
  const title = await page.title();
  const h1 = await page.locator("h1").first().textContent().catch(() => null);
  const nav = await page.locator('nav[aria-label="Main navigation"]').count();
  const footer = await page.locator("footer").count();
  check(
    `T10 ${path}`,
    !!title && title.includes("DAN") && !!h1 && nav === 1 && footer === 1,
    `title="${title}" h1="${(h1 || "").trim().slice(0, 40)}" nav=${nav} footer=${footer}`,
  );
}

// ---------- Mobile context ----------
const mctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});
const mp = await mctx.newPage();
mp.setDefaultTimeout(60000);
const mobileErrors = [];
mp.on("pageerror", (e) => mobileErrors.push(String(e).slice(0, 200)));

await mp.goto(BASE, { timeout: 60000 });
await mp.getByRole("button", { name: "Launch Campaign →", exact: true }).waitFor();
const overflow = await mp.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check("T11a mobile 390px: no horizontal overflow", overflow <= 1, `overflow=${overflow}px`);
await shot(mp, "t11_mobile_home");
const burger = mp.locator('button[aria-label="Toggle navigation menu"]');
const burgerVisible = await burger.isVisible();
await burger.click();
await mp.waitForTimeout(400);
const expanded = await burger.getAttribute("aria-expanded");
check(
  "T11b hamburger menu opens",
  burgerVisible && expanded === "true",
  `visible=${burgerVisible} expanded=${expanded}`,
);
await shot(mp, "t11b_mobile_menu");

// mobile modal spot check
await mp.getByRole("button", { name: "Launch Campaign →", exact: true }).click();
await mp.getByText("Agency Brand Strategy Intake").waitFor();
const mOverflow = await mp.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check("T11c mobile modal opens without overflow", mOverflow <= 1, `overflow=${mOverflow}px`);
await shot(mp, "t11c_mobile_modal");
await mp.keyboard.press("Escape");

// T14 — branded 404 page + icon set
const notFound = await page.request.get(`${BASE}/this-page-does-not-exist`);
const nfStatus = notFound.status();
const nfBody = await notFound.text();
check(
  "T14a unknown URL returns 404 status",
  nfStatus === 404,
  `status=${nfStatus}`,
);
check(
  "T14b 404 page is branded (nav + copy + CTA)",
  nfBody.includes("This Campaign Didn&#x27;t Convert") && nfBody.includes("Return to Homepage") && nfBody.includes("Main navigation"),
  "",
);
const iconResp = await page.request.get(`${BASE}/icon.png`);
const appleResp = await page.request.get(`${BASE}/apple-icon.png`);
check(
  "T14c generated favicon + apple-touch-icon served",
  iconResp.status() === 200 && appleResp.status() === 200,
  `icon=${iconResp.status()} apple-icon=${appleResp.status()}`,
);

// ---------- Console error audit ----------
const realErrors = [...consoleErrors, ...pageErrors, ...mobileErrors].filter(
  (t) => !/favicon|net::ERR|Failed to load resource.*(404|500)/i.test(t),
);
check("T13 zero console/page errors across all pages", realErrors.length === 0, realErrors.slice(0, 5).join(" | ") || "none");

await browser.close();

const failed = results.filter((r) => !r.pass);
console.log(`\n==== ${results.length - failed.length}/${results.length} passed ====`);
fs.writeFileSync(
  process.cwd() + "/tests/e2e/results.json",
  JSON.stringify({ results, rawErrors: { consoleErrors, pageErrors, mobileErrors } }, null, 2),
);
process.exit(failed.length ? 1 : 0);
