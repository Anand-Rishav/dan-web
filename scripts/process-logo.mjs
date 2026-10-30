// One-off brand asset pipeline: turns dan_instagram_dp.png (white bg) into
// the site's logo set. Run: node scripts/process-logo.mjs
import sharp from "sharp";

const SRC = "public/brand/src-original.png";

// 1. Load raw pixels, trim white border, map colors.
const base = sharp(SRC).flatten({ background: "#ffffff" }).ensureAlpha();
const { data, info } = await base.raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;
console.log(`input: ${W}x${H} channels=${C}`);
const px = (x, y) => {
  const i = (y * W + x) * C;
  return [data[i], data[i + 1], data[i + 2]];
};
console.log("corner colors:", px(0, 0), px(W - 1, H - 1), "edge-mid:", px(Math.floor(W / 2), 2));

const near = (v, t, f = 18) => Math.abs(v - t) <= f;
const isWhiteish = (r, g, b) => r > 230 && g > 230 && b > 230 && Math.max(r, g, b) - Math.min(r, g, b) < 14;
const isCharcoal = (r, g, b) => near(r, 45, 30) && near(g, 55, 30) && near(b, 70, 35) && b > r; // dark navy "a"
const isMidGray = (r, g, b) => near(r, 110, 45) && near(g, 120, 45) && near(b, 135, 45); // gray "n"

// Pass 1: white -> transparent + collect bounds of visible pixels
let minX = W, minY = H, maxX = 0, maxY = 0;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * C;
    if (isWhiteish(data[i], data[i + 1], data[i + 2])) {
      data[i + 3] = 0;
    } else if (data[i + 3] > 0) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
}
const tw = maxX - minX + 1;
const th = maxY - minY + 1;
console.log(`trimmed bounds: ${tw}x${th} at (${minX},${minY})`);

const makeSharpWithAlpha = () =>
  sharp(data, { raw: { width: W, height: H, channels: 4 } }).extract({ left: minX, top: minY, width: tw, height: th });

// 2. Light-background variant: colors unchanged, just transparency.
await makeSharpWithAlpha().png().toFile("public/brand/dan-light-bg.png");

// 3. Dark-background variant: charcoal "a" -> white, gray "n" -> light gray.
const dark = Buffer.from(data);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * C;
    if (data[i + 3] === 0) continue;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (isCharcoal(r, g, b)) {
      dark[i] = 255; dark[i + 1] = 255; dark[i + 2] = 255;
    } else if (isMidGray(r, g, b)) {
      dark[i] = 156; dark[i + 1] = 163; dark[i + 2] = 175; // gray-400
    }
  }
}
await sharp(dark, { raw: { width: W, height: H, channels: 4 } })
  .extract({ left: minX, top: minY, width: tw, height: th })
  .png()
  .toFile("public/brand/dan-dark.png");

// 4. Navbar + footer web size (h=72 retina -> 2x of 36px) — ORIGINAL colors,
// unchanged from the file the client sent (transparent background only).
// New filename per iteration: the dev/prod image optimizer caches transforms
// by URL, so re-using a name after changing file content serves stale pixels.
await sharp("public/brand/dan-light-bg.png").resize({ height: 72 }).png().toFile("public/brand/dan-logo.png");

// 5. Favicon "d" mark: find the right edge of the blue "d" (blue-dominant
// pixels) instead of guessing a fraction of the wordmark width.
let dRight = 0;
for (let x = 0; x < W; x++) {
  for (let y = 0; y < H; y++) {
    const i = (y * W + x) * C;
    if (data[i + 3] > 0 && data[i + 2] - data[i] > 40) { // blue-dominant
      if (x > dRight) dRight = x;
    }
  }
}
const markW = Math.min(tw, dRight - minX + 1 + Math.round(th * 0.04));
console.log(`d-mark right edge at x=${dRight}, crop width=${markW}`);
const markBuf = await sharp("public/brand/dan-dark.png")
  .extract({ left: 0, top: 0, width: markW, height: th })
  .raw()
  .toBuffer({ resolveWithObject: true });
// Keep only blue-ish pixels (the "d" and its anti-aliased edges); erase any
// white/gray remnants of neighboring letters.
const md = markBuf.data;
for (let i = 0; i < md.length; i += 4) {
  if (md[i + 3] > 0 && md[i + 2] - md[i] <= 12) md[i + 3] = 0; // not blue-dominant
}
await sharp(md, { raw: { width: markBuf.info.width, height: markBuf.info.height, channels: 4 } })
  .png()
  .toFile("public/brand/d-mark.png");
const m = await sharp("public/brand/d-mark.png").png().toBuffer({ resolveWithObject: true });
console.log("d-mark:", m.info.width, "x", m.info.height);

// 6. App icon (32px tab) and apple icon (180px, iOS needs opaque bg).
await sharp("public/brand/d-mark.png").resize(64, 64, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile("src/app/icon.png");

const pad = Math.round(180 * 0.16);
const mark = await sharp("public/brand/d-mark.png").resize(180 - pad * 2, 180 - pad * 2, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
const gradientBg = Buffer.from(
  `<svg width="180" height="180"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050505"/><stop offset="0.6" stop-color="#062a30"/><stop offset="1" stop-color="#1b0a20"/></linearGradient></defs><rect width="180" height="180" fill="url(#g)"/></svg>`
);
await sharp(gradientBg).composite([{ input: mark }]).png().toFile("src/app/apple-icon.png");

// 7. OG card logo (2x for crispness) — original colors, shown inside a
// white rounded card by opengraph-image.tsx.
await sharp("public/brand/dan-light-bg.png").resize({ height: 160 }).png().toFile("public/brand/dan-og.png");

console.log("done: brand assets generated");
