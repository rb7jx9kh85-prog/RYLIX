// Fabrique assets/photos/hero-paysage.jpg, la photo du hero sur bureau :
// image-1 intacte au centre, posée sur un décor de montagnes généré
// (assets/hero/fond-montagnes.jpg). Relancer ensuite `npm run images`.
//
// Fond généré, flou progressif : léger près de la photo, de plus en plus fort
// vers les bords. Photo d'origine au centre, bords fondus sur une large bande.
import sharp from 'sharp'
const plateP = 'assets/hero/fond-montagnes.jpg'
const photoP = 'assets/photos/image-1.jpg'
const out = 'assets/photos/hero-paysage.jpg'
const W = 2560,
  H = 1440
const base = sharp(plateP).resize(W, H, { fit: 'cover' })
const levels = [6, 14, 26, 40]
const raws = []
for (const b of levels) raws.push(await base.clone().blur(b).removeAlpha().raw().toBuffer())
const ph = await sharp(photoP)
  .resize({ height: H })
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })
const pw = ph.info.width,
  left = Math.round((W - pw) / 2)
const smooth = (t) => {
  t = Math.max(0, Math.min(1, t))
  return t * t * (3 - 2 * t)
}
const feather = 420 // largeur du fondu de chaque côté de la photo
const outBuf = Buffer.alloc(W * H * 3)
for (let x = 0; x < W; x++) {
  // distance au bord de la photo (0 au bord, croît vers l'extérieur)
  const dist = x < left ? left - x : x >= left + pw ? x - (left + pw - 1) : 0
  const t = smooth(dist / left) * (levels.length - 1) // niveau de flou continu
  const i0 = Math.floor(t),
    i1 = Math.min(levels.length - 1, i0 + 1),
    f = t - i0
  // opacité de la photo : pleine au centre, s'efface sur `feather` px vers l'intérieur
  const px = x - left
  const a = px < 0 || px >= pw ? 0 : smooth(Math.min(px, pw - 1 - px) / feather)
  for (let y = 0; y < H; y++) {
    const o = (y * W + x) * 3
    for (let c = 0; c < 3; c++) {
      const bg = raws[i0][o + c] * (1 - f) + raws[i1][o + c] * f
      const fg = a > 0 ? ph.data[(y * pw + px) * 3 + c] : 0
      outBuf[o + c] = Math.round(fg * a + bg * (1 - a))
    }
  }
}
await sharp(outBuf, { raw: { width: W, height: H, channels: 3 } })
  .jpeg({ quality: 90 })
  .toFile(out)
console.log('ok')
