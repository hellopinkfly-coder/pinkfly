/**
 * The icon set, drawn from one square of artwork.
 *
 * A favicon is a file the browser fetches from a fixed path, so it cannot be
 * uploaded in the Studio like the header logo — it is generated here and
 * committed. Five sizes are needed, and they have to agree with each other,
 * which is why one command makes all of them from a single source.
 *
 * Only the balloon is used. The tab icon is drawn at 16 pixels, where the
 * wordmark below it would be a grey smear, so the mark is cropped out of the
 * full lockup and centred on its own square with room to breathe.
 *
 *   npm run build:icons
 */
import sharp from "sharp";

const SOURCE = "public/brand/pinkfly-icon-source.png";

/** The mark's bounding box within the source, in pixels. */
const MARK = { left: 722, top: 352, width: 476, height: 739 };

/** White, as the artwork was supplied — the mark's navy reads on it. */
const BACKGROUND = { r: 255, g: 255, b: 255, alpha: 1 };

/**
 * A square of the mark with a margin.
 *
 * Icons are masked to a circle on Android and a rounded square on iOS, so
 * artwork that touches the edge loses its corners. The margin is what keeps
 * the balloon whole under every mask.
 */
async function squareMark() {
  const side = Math.round(Math.max(MARK.width, MARK.height) * 1.18);
  const mark = await sharp(SOURCE).extract(MARK).toBuffer();
  return sharp({
    create: { width: side, height: side, channels: 4, background: BACKGROUND },
  })
    .composite([{ input: mark, gravity: "centre" }])
    .png()
    .toBuffer();
}

const OUTPUTS = [
  ["public/brand/favicon-32.png", 32],
  ["public/brand/icon-192.png", 192],
  ["public/brand/icon-512.png", 512],
  ["public/brand/apple-icon.png", 180],
  ["src/app/icon.png", 192],
  ["src/app/apple-icon.png", 180],
];

async function main() {
  const square = await squareMark();
  for (const [out, size] of OUTPUTS) {
    await sharp(square)
      .resize(size, size, { fit: "contain", background: BACKGROUND })
      .flatten({ background: BACKGROUND })
      .png()
      .toFile(out);
    console.log(`${out}  ${size}x${size}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
