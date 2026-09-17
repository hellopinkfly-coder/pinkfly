/**
 * Draw the Pinkfly lockups from the parts the repository already holds.
 *
 * The wordmark in the old artwork reads "PinkFly" — a capital F the site's
 * own copy never uses — and it is a raster, so correcting it meant waiting on
 * a designer. It is type, though, set in the same Space Mono the site ships,
 * beside a balloon that is already here as a transparent PNG. So it is drawn
 * rather than redrawn: the mark is composited, the words are the real font
 * converted to outlines, and the result is written at the sizes the Logo
 * component expects.
 *
 * Outlines rather than live text because an SVG rasterised outside a browser
 * has no access to a webfont, and a <img src="*.svg"> would not load one
 * either — a path always draws the same everywhere.
 *
 *   node scripts/build-logo.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import { Buffer } from "node:buffer";
import sharp from "sharp";
import opentype from "opentype.js";
import wawoff2 from "wawoff2";

const ACCENT = "#d8037d";
const INK_LIGHT = "#4a4441";
const INK_DARK = "#e8e1db";
const RULE_LIGHT = "#f3badb";
const RULE_DARK = "#7a3a5e";

/** Space Mono, decompressed from the woff2 the site serves. */
async function loadFont(file) {
  const woff2 = await readFile(file);
  const ttf = await wawoff2.decompress(woff2);
  return opentype.parse(Uint8Array.from(ttf).buffer);
}

/** A run of text as one path, positioned by its own measured width. */
function textPath(font, text, size, x, y, letterSpacing = 0) {
  const scale = size / font.unitsPerEm;
  let cursor = x;
  const parts = [];
  for (const char of text) {
    const glyph = font.charToGlyph(char);
    parts.push(glyph.getPath(cursor, y, size).toPathData(3));
    cursor += glyph.advanceWidth * scale + letterSpacing;
  }
  return { d: parts.join(" "), width: cursor - x };
}

function measure(font, text, size, letterSpacing = 0) {
  const scale = size / font.unitsPerEm;
  let width = 0;
  for (const char of text) {
    width += font.charToGlyph(char).advanceWidth * scale + letterSpacing;
  }
  return width - letterSpacing;
}

async function build({ height, withTagline, dark, out }) {
  const bold = await loadFont("public/fonts/SpaceMono-Bold.woff2");
  const regular = await loadFont("public/fonts/SpaceMono-Regular.woff2");

  const ink = dark ? INK_DARK : INK_LIGHT;
  const rule = dark ? RULE_DARK : RULE_LIGHT;
  const mark = await readFile(
    dark ? "public/brand/pinkfly-mark-dark.png" : "public/brand/pinkfly-mark.png"
  );
  const markMeta = await sharp(mark).metadata();

  // The balloon sets the lockup's height; the words sit beside it, optically
  // centred on the balloon's body rather than on the whole canvas.
  const markHeight = height * (withTagline ? 0.92 : 0.98);
  const markWidth = Math.round((markHeight * markMeta.width) / markMeta.height);
  const markX = 0;
  const markY = (height - markHeight) / 2;

  const gap = height * (withTagline ? 0.1 : 0.12);
  const wordSize = withTagline ? height * 0.42 : height * 0.62;
  const wordX = markX + markWidth + gap;
  const wordY = withTagline ? height * 0.52 : height * 0.72;
  const tracking = wordSize * 0.06;

  const word = textPath(bold, "Pinkfly", wordSize, wordX, wordY, tracking);

  let tagline = "";
  if (withTagline) {
    const text = "Building Dreams";
    // Sized to sit inside the wordmark rather than to a fixed height: the
    // hairlines run from the wordmark's edges to the words, so a tagline as
    // wide as the wordmark leaves them no room and they vanish. Two thirds
    // leaves a clear run on each side at any wordmark length.
    const trial = height * 0.17;
    const taglineSize = trial * ((word.width * 0.66) / measure(regular, text, trial, trial * 0.22));
    const taglineTracking = taglineSize * 0.22;
    const taglineWidth = measure(regular, text, taglineSize, taglineTracking);
    // Centred under the wordmark, with a hairline reaching out on each side.
    const taglineX = wordX + (word.width - taglineWidth) / 2;
    const taglineY = height * 0.88;
    const path = textPath(regular, text, taglineSize, taglineX, taglineY, taglineTracking);
    const ruleY = taglineY - taglineSize * 0.33;
    const ruleGap = taglineSize * 0.9;
    tagline = `
    <path d="${path.d}" fill="${ink}"/>
    <line x1="${wordX}" y1="${ruleY}" x2="${taglineX - ruleGap}" y2="${ruleY}"
          stroke="${rule}" stroke-width="${Math.max(1, height * 0.008)}"/>
    <line x1="${taglineX + taglineWidth + ruleGap}" y1="${ruleY}"
          x2="${wordX + word.width}" y2="${ruleY}"
          stroke="${rule}" stroke-width="${Math.max(1, height * 0.008)}"/>`;
  }

  // The canvas is the artwork's own width, plus the small overhang a glyph
  // draws past its advance — the tail of the "y" sits outside the width the
  // metrics report, and without this it was sliced off at the canvas edge.
  // Trailing space beyond that would be carried into every placement, since
  // the page derives the logo's width from the file's proportions.
  const overhang = wordSize * 0.12;
  const width = Math.ceil(wordX + word.width + overhang);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <image x="${markX}" y="${markY}" width="${markWidth}" height="${markHeight}"
         xlink:href="data:image/png;base64,${mark.toString("base64")}"/>
  <path d="${word.d}" fill="${ACCENT}"/>${tagline}
</svg>`;

  await sharp(Buffer.from(svg)).png().toFile(out);
  const meta = await sharp(out).metadata();
  console.log(`${out}  ${meta.width}x${meta.height}`);
}

/**
 * The share image: the lockup centred on the dark surface.
 *
 * It is what a link to the site unfurls as, and it carried the old wordmark
 * long after the site stopped using it — nobody sees it on the site itself,
 * which is exactly why it went unnoticed.
 */
async function buildShareImage({ width, height, out }) {
  const background = "#1e1a17";
  const lockup = await sharp("public/brand/pinkfly-logo-dark.png")
    .resize({ width: Math.round(width * 0.62) })
    .toBuffer();

  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background,
    },
  })
    .composite([{ input: lockup, gravity: "centre" }])
    .png()
    .toFile(out);

  const meta = await sharp(out).metadata();
  console.log(`${out}  ${meta.width}x${meta.height}`);
}

const FULL = { height: 366, withTagline: true };
const COMPACT = { height: 220, withTagline: false };

await build({ ...FULL, dark: false, out: "public/brand/pinkfly-logo.png" });
await build({ ...FULL, dark: true, out: "public/brand/pinkfly-logo-dark.png" });
await build({ ...COMPACT, dark: false, out: "public/brand/pinkfly-lockup.png" });
await build({ ...COMPACT, dark: true, out: "public/brand/pinkfly-lockup-dark.png" });

// The share image, and the copy Next serves by file convention.
await buildShareImage({ width: 1200, height: 630, out: "public/brand/og-image.png" });
await buildShareImage({ width: 1200, height: 630, out: "src/app/opengraph-image.png" });
