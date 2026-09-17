/**
 * What is the site actually drawing the logo from?
 *
 * The header logo comes from Sanity when one has been uploaded, so a logo
 * that looks cropped can be the upload, the crop dragged in the Studio, or
 * the frame the site derives from them. This prints all three: the asset's
 * own pixel size, the crop rectangle, the ratio the site computes, the URL
 * it builds, and the pixel size of the image that URL actually returns.
 *
 *   npm run check:logo
 */
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "5t0hmzzq";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-10-01",
  useCdn: false,
});
const builder = imageUrlBuilder({ projectId, dataset });

/** PNG and JPEG carry their dimensions in the first few hundred bytes. */
function pixelSize(buffer: Buffer): string {
  if (buffer.subarray(0, 8).toString("hex") === "89504e470d0a1a0a") {
    return `${buffer.readUInt32BE(16)}x${buffer.readUInt32BE(20)}`;
  }
  for (let i = 2; i + 9 < buffer.length; ) {
    if (buffer[i] !== 0xff) break;
    const marker = buffer[i + 1];
    const length = buffer.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return `${buffer.readUInt16BE(i + 7)}x${buffer.readUInt16BE(i + 5)}`;
    }
    i += 2 + length;
  }
  return "unknown";
}

async function main() {
  const settings = await client.fetch(
    `*[_type == "siteSettings"][0]{logo, logoDark, logoHeight}`
  );
  if (!settings) {
    console.log("No siteSettings document — the site is drawing the shipped artwork.");
    return;
  }
  console.log("logoHeight:", settings.logoHeight ?? "(unset, defaults to 48)");

  for (const field of ["logo", "logoDark"] as const) {
    const figure = settings[field];
    const image = figure?.asset;
    const ref: string | undefined = image?.asset?._ref ?? image?._ref;
    console.log(`\n--- ${field} ---`);
    if (!ref) {
      console.log("no upload", JSON.stringify(figure ?? null));
      continue;
    }
    console.log("ref:", ref);
    console.log("crop:", JSON.stringify(image?.crop ?? null));
    console.log("hotspot:", JSON.stringify(image?.hotspot ?? null));

    const match = /-(\d+)x(\d+)-[a-z]+$/.exec(ref);
    if (match) {
      const w = Number(match[1]);
      const h = Number(match[2]);
      console.log(`file: ${w}x${h} (ratio ${(w / h).toFixed(3)})`);
      const crop = image?.crop;
      if (crop) {
        const kw = 1 - (crop.left ?? 0) - (crop.right ?? 0);
        const kh = 1 - (crop.top ?? 0) - (crop.bottom ?? 0);
        console.log(
          `cropped: ${Math.round(w * kw)}x${Math.round(h * kh)} (ratio ${((w * kw) / (h * kh)).toFixed(3)})`
        );
      }
    }

    const url = builder.image(image).auto("format").fit("crop").width(2000).quality(85).url();
    console.log("url:", url);
    const response = await fetch(url);
    const body = Buffer.from(await response.arrayBuffer());
    console.log("served:", response.status, pixelSize(body), `${body.length} bytes`);
  }

  await checkLive();
}

/**
 * What the live site serves: the logo tag in the HTML, and the image behind
 * it. A frame narrower than the artwork's proportions is what crops a logo,
 * so both numbers have to be read from production rather than from a local
 * render, which has been correct throughout.
 */
async function checkLive() {
  const site = process.env.SITE_URL ?? "https://pinkfly.vercel.app";
  console.log(`\n=== ${site} ===`);
  const response = await fetch(site, { headers: { "user-agent": "pinkfly-check-logo" } });
  console.log("page:", response.status, "age:", response.headers.get("age"), response.headers.get("x-vercel-cache"));
  const html = await response.text();

  const tags = html.match(/<img[^>]*pf-logo[^>]*>/g) ?? [];
  if (tags.length === 0) {
    console.log("no logo tag found in the HTML");
    return;
  }
  for (const tag of tags) {
    const width = /\bwidth="(\d+)"/.exec(tag)?.[1];
    const height = /\bheight="(\d+)"/.exec(tag)?.[1];
    const src = /\bsrc="([^"]+)"/.exec(tag)?.[1]?.replace(/&amp;/g, "&");
    const style = /\bstyle="([^"]*)"/.exec(tag)?.[1];
    console.log(`\nframe: ${width}x${height}  style: ${style}`);
    console.log("src:", src);
    if (!src) continue;
    const image = await fetch(new URL(src, site).toString());
    const body = Buffer.from(await image.arrayBuffer());
    const served = pixelSize(body);
    console.log("served:", image.status, served, `${body.length} bytes`);
    const [sw, sh] = served.split("x").map(Number);
    if (sw && sh && width && height) {
      const frameRatio = Number(width) / Number(height);
      console.log(
        `ratios — frame ${frameRatio.toFixed(3)}, image ${(sw / sh).toFixed(3)}`,
        Math.abs(frameRatio - sw / sh) > 0.05 ? "  <-- MISMATCH, this is what crops it" : ""
      );
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
