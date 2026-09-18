/**
 * The logo artwork, cut from the two supplied lockups.
 *
 * The brand supplies one file per theme, and each is used as drawn — no
 * recolouring. The light file carries a pink wordmark, a charcoal balloon and
 * a grey tagline; the dark one carries cream type over the same mark. Cutting
 * rather than re-inking means each theme gets the colours the brand chose for
 * it, instead of one file approximated into the other.
 *
 * Both files are drawn on the same 2000×2000 canvas with the lockup in the
 * same place, so the two themes line up exactly and nothing shifts when the
 * theme changes.
 *
 * Four files come out: the full lockup and a compact cut without the tagline
 * (which is unreadable at phone-bar height), each on-light and on-dark.
 *
 *   npm run build:logo
 */
import sharp from "sharp";

const SOURCE = {
  light: "public/brand/pinkfly-lockup-light-source.png",
  dark: "public/brand/pinkfly-lockup-source.png",
};

/**
 * Where things sit in the source, measured from it rather than guessed.
 *
 * The balloon ends before column 540 in both files (the clear band runs
 * 512–573), and the tagline's first row is just past 1110 in both (the band
 * between wordmark and tagline runs 1093–1120). Dropping the tagline is the
 * only edit either file gets.
 */
const MARK_RIGHT_EDGE = 540; // everything past here is type, not the balloon
const TAGLINE_TOP = 1110; // first row of "Building Dreams"

/** Erase the tagline, leaving the mark and the wordmark untouched. */
function dropTagline(data, width, height, channels) {
  for (let y = TAGLINE_TOP; y < height; y++) {
    for (let x = MARK_RIGHT_EDGE; x < width; x++) {
      data[(y * width + x) * channels + 3] = 0;
    }
  }
}

async function cut({ theme, compact, out }) {
  const { data, info } = await sharp(SOURCE[theme])
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  if (compact) dropTagline(data, width, height, channels);

  await sharp(data, { raw: { width, height, channels } })
    .trim({ threshold: 1 })
    .png()
    .toFile(out);

  const meta = await sharp(out).metadata();
  console.log(`${out}  ${meta.width}x${meta.height}`);
}

async function main() {
  await cut({ theme: "light", compact: false, out: "public/brand/pinkfly-logo.png" });
  await cut({ theme: "dark", compact: false, out: "public/brand/pinkfly-logo-dark.png" });
  await cut({ theme: "light", compact: true, out: "public/brand/pinkfly-lockup.png" });
  await cut({ theme: "dark", compact: true, out: "public/brand/pinkfly-lockup-dark.png" });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
