// Builds a multi-size favicon.ico from the blue "d" brand mark.
// sharp can't emit ICO, so this assembles the ICO container by hand with
// PNG-compressed entries (supported by all modern browsers/crawlers).
// Run: node scripts/make-favicon.mjs
import sharp from "sharp";

const SIZES = [16, 32, 48];
const pngs = [];
for (const size of SIZES) {
  const buf = await sharp("brand-src/d-mark.png")
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  pngs.push({ size, buf });
}

// ICO header: reserved(2) type=1(2) count(2)
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(pngs.length, 4);

const directory = Buffer.alloc(16 * pngs.length);
let offset = 6 + 16 * pngs.length;
pngs.forEach(({ size, buf }, i) => {
  const e = i * 16;
  directory.writeUInt8(size === 256 ? 0 : size, e); // width
  directory.writeUInt8(size === 256 ? 0 : size, e + 1); // height
  directory.writeUInt8(0, e + 2); // palette
  directory.writeUInt8(0, e + 3); // reserved
  directory.writeUInt16LE(1, e + 4); // planes
  directory.writeUInt16LE(32, e + 6); // bpp
  directory.writeUInt32LE(buf.length, e + 8); // data size
  directory.writeUInt32LE(offset, e + 12); // data offset
  offset += buf.length;
});

const ico = Buffer.concat([header, directory, ...pngs.map((p) => p.buf)]);
await sharp; // keep import meaningful for future direct use
const { writeFile } = await import("fs/promises");
await writeFile("src/app/favicon.ico", ico);
console.log(`favicon.ico written: ${ico.length} bytes, sizes ${SIZES.join("/")}`);
