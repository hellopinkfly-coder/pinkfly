/**
 * The logo artwork, cut from one supplied lockup.
 *
 * The file the brand supplies is drawn for a dark background: "Pink" in the
 * brand pink, "fly" and the tagline in cream. On the site's light background
 * that cream is invisible, so the light variant is the same artwork with the
 * cream re-inked in the heading colour. Nothing moves — both variants are cut
 * from identical pixels, so the two themes line up exactly.
 *
 * Four files come out of it: the full lockup and a compact cut without the
 * tagline (which is unreadable at phone-bar height), each on-light and
 * on-dark.
 *
 *   npm run build:logo
 */
import sharp from "sharp";

const SOURCE = "public/brand/pinkfly-lockup-source.png";

/**
 * Where things sit in the 2000×2000 source, measured from it rather than
 * guessed: the balloon occupies the first column block, the wordmark and the
 * tagline are separate row blocks to the right of it.
 */
const MARK_RIGHT_EDGE = 540; // everything past here is type, not the balloon
const TAGLINE_TOP = 1110; // first row of "Building Dreams"

/** The heading colour of each theme, which the cream type becomes. */
const INK = { light: [46, 42, 40], dark: null }; // dark keeps the cream as drawn

/**
 * Re-ink the type without touching the mark.
 *
 * Only near-white pixels to the right of the balloon are repainted, so the
 * pink stays pink, the balloon's grey fill and dark outline stay as drawn,
 * and the letterforms keep their antialiasing: a pixel that was 40% cream
 * becomes 40% ink, which is what stops the edges going ragged.
 */
function reink(data, width, height, channels, ink, { dropTagline = false } = {}) {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const a = data[i + 3];
      if (a < 6) continue;
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]];

      if (dropTagline && y >= TAGLINE_TOP && x >= MARK_RIGHT_EDGE) {
        data[i + 3] = 0;
        continue;
      }
      if (!ink || x < MARK_RIGHT_EDGE) continue;

      // Cream: bright and close to neutral. The pink is far from neutral and
      // the balloon's outline is far from bright, so neither matches.
      const bright = (r + g + b) / 3;
      const spread = Math.max(r, g, b) - Math.min(r, g, b);
      if (bright < 200 || spread > 40) continue;

      // The type is solid cream with its softness carried in the alpha
      // channel, not in the colour — so the colour is replaced outright and
      // the alpha left alone. Treating the cream as partial coverage instead
      // produced a grey barely darker than the paper.
      data[i] = ink[0];
      data[i + 1] = ink[1];
      data[i + 2] = ink[2];
    }
  }
}

async function cut({ ink, dropTagline, out }) {
  const { data, info } = await sharp(SOURCE)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  reink(data, width, height, channels, ink, { dropTagline });

  await sharp(data, { raw: { width, height, channels } })
    .trim({ threshold: 1 })
    .png()
    .toFile(out);

  const meta = await sharp(out).metadata();
  console.log(`${out}  ${meta.width}x${meta.height}`);
}

async function main() {
  await cut({ ink: INK.light, dropTagline: false, out: "public/brand/pinkfly-logo.png" });
  await cut({ ink: INK.dark, dropTagline: false, out: "public/brand/pinkfly-logo-dark.png" });
  await cut({ ink: INK.light, dropTagline: true, out: "public/brand/pinkfly-lockup.png" });
  await cut({ ink: INK.dark, dropTagline: true, out: "public/brand/pinkfly-lockup-dark.png" });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
