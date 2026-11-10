import sharp from "sharp"

/**
 * Builds app/images/hero-globe.png from app/images/globe.png by:
 * 1. Removing the magenta haze band in the sky (pink glow, semi-transparent)
 * 2. Auto-detecting the planet's apex and radius
 * 3. Cropping to the glowing top arc so it can sit at the bottom of the hero
 */
const INPUT = "./app/images/globe.png"
const OUTPUT = "./app/images/hero-globe.png"
const ARC_ABOVE = 360 // px of sky above the apex to keep
const ARC_BELOW = 720 // px of planet below the apex to keep

const { data, info } = await sharp(INPUT)
  .raw()
  .toBuffer({ resolveWithObject: true })

const { width: w, height: h, channels: c } = info
const idx = (x, y) => Math.round(y) * w + Math.round(x)

// 1. Kill the magenta haze: strong R-G separation on a transparent pixel
for (let i = 0; i < w * h; i++) {
  const o = i * c
  const r = data[o]
  const g = data[o + 1]
  const a = data[o + 3]
  if (r - g > 120 && a < 240) {
    data[o] = 0
    data[o + 1] = 0
    data[o + 2] = 0
    data[o + 3] = 0
  }
}

// 2. Detect geometry --------------------------------------------------------
const apexY = (() => {
  for (let y = 0; y < h; y++) {
    if (data[idx(w / 2, y) * c + 3] >= 250) return y
  }
  throw new Error("Could not find the planet apex")
})()

const probeY = Math.min(h - 1, apexY + 100)
let x0 = 0
let x1 = w - 1
for (let x = 0; x < w; x++) {
  if (data[idx(x, probeY) * c + 3] >= 250) {
    x0 = x
    break
  }
}
for (let x = w - 1; x >= 0; x--) {
  if (data[idx(x, probeY) * c + 3] >= 250) {
    x1 = x
    break
  }
}
console.log(`detected: apexY=${apexY} left=${x0} right=${x1}`)

// 3. Crop -------------------------------------------------------------------
const top = Math.max(0, apexY - ARC_ABOVE)
const bottom = Math.min(h, apexY + ARC_BELOW)

await sharp(data, {
  raw: { width: w, height: h, channels: c },
})
  .extract({
    left: 0,
    top,
    width: w,
    height: bottom - top,
  })
  .png()
  .toFile(OUTPUT)

console.log(`wrote ${OUTPUT}`)
