/**
 * Compose full-bleed splash at iPhone XS native @3x (1125×2436).
 * Scene art + crisp Plus Jakarta Sans text via @napi-rs/canvas.
 *
 * Usage: node scripts/compose-splash.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createCanvas, GlobalFonts, loadImage } from "@napi-rs/canvas";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

/** iPhone XS logical 375×812 @3x */
const W = 1125;
const H = 2436;

const COLORS = {
  brand: "#243B53",
  guide: "#4F84E0",
  tagline: "#7B8FA6",
};

const fontDir = path.join(root, "node_modules/@expo-google-fonts/plus-jakarta-sans");

GlobalFonts.registerFromPath(
  path.join(fontDir, "800ExtraBold/PlusJakartaSans_800ExtraBold.ttf"),
  "PlusJakartaExtraBold"
);
GlobalFonts.registerFromPath(
  path.join(fontDir, "600SemiBold/PlusJakartaSans_600SemiBold.ttf"),
  "PlusJakartaSemiBold"
);
GlobalFonts.registerFromPath(
  path.join(fontDir, "400Regular/PlusJakartaSans_400Regular.ttf"),
  "PlusJakartaRegular"
);

async function main() {
  const sceneCandidates = [
    path.join(root, "assets/images/splash-scene.png"),
    path.join(root, "assets/images/_splash-scene-raw.png"),
    path.join(
      "/Users/mysterym1/.cursor/projects/Volumes-Extend-Projects-KSalaryInsights/assets/splash-scene.png"
    ),
  ];
  const sceneSrc = sceneCandidates.find((p) => fs.existsSync(p));
  if (!sceneSrc) throw new Error("Missing splash scene image");

  // Cover-fit scene to XS resolution (Lanczos via sharp for quality)
  const sceneBuf = await sharp(sceneSrc)
    .resize(W, H, { fit: "cover", position: "centre", kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer();

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(await loadImage(sceneBuf), 0, 0, W, H);

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  // Calm mid sizes for XS: ~20 / 12 / 11 pt @3x.
  const brandSize = 60;
  const guideSize = 36;
  const taglineSize = 33;
  const gap1 = 20;
  const gap2 = 12;

  const brandBox = brandSize * 1.15;
  const guideBox = guideSize * 1.2;
  const taglineBox = taglineSize * 1.2;
  const blockH = brandBox + gap1 + guideBox + gap2 + taglineBox;
  // Center the text block in the upper sky band above the mascot
  const skyBandTop = Math.round(H * 0.14);
  const skyBandBottom = Math.round(H * 0.42);
  const blockTop = Math.round(
    skyBandTop + (skyBandBottom - skyBandTop - blockH) / 2
  );
  const cx = W / 2;

  ctx.fillStyle = COLORS.brand;
  ctx.font = `${brandSize}px PlusJakartaExtraBold`;
  const brandBaseline = blockTop + brandSize;
  ctx.fillText("KSalaryInsights", cx, brandBaseline);

  ctx.fillStyle = COLORS.guide;
  ctx.font = `${guideSize}px PlusJakartaSemiBold`;
  const guideBaseline = blockTop + brandBox + gap1 + guideSize;
  ctx.fillText("Xin chào, tôi là Ngài Miu", cx, guideBaseline);

  ctx.fillStyle = COLORS.tagline;
  ctx.font = `${taglineSize}px PlusJakartaRegular`;
  const taglineBaseline = blockTop + brandBox + gap1 + guideBox + gap2 + taglineSize;
  ctx.fillText("Ước tính lương · thuế · bảo hiểm", cx, taglineBaseline);

  const outPath = path.join(root, "assets/images/splash-full.png");
  const png = canvas.toBuffer("image/png");
  // Re-encode with sharp for smaller file; keep full resolution
  await sharp(png).png({ compressionLevel: 9 }).toFile(outPath);

  const meta = await sharp(outPath).metadata();
  console.log(
    `Wrote ${outPath} (${meta.width}×${meta.height}, text @ y≈${blockTop}, block≈${Math.round(blockH)}px)`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
