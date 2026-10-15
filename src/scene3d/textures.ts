import * as THREE from 'three'

// Procedural canvas textures, so the 3D office ships without image or model files.
// Each texture is created once and cached.

const cache = new Map<string, THREE.Texture>()

function canvasTexture(key: string, width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void, repeat?: [number, number]): THREE.Texture {
  const cached = cache.get(key)
  if (cached) return cached
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (ctx) draw(ctx)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  if (repeat) {
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(...repeat)
  }
  cache.set(key, texture)
  return texture
}

/** Deterministic pseudo-random numbers so textures look the same on every load. */
function random(seed: number) {
  let value = seed
  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

/**
 * Light Scandinavian plywood — the clean, pale floor of a modern tech office (Googleplex lobby
 * feel). Very light oak planks with a faint grain.
 */
export function woodFloor(repeat: [number, number]) {
  return canvasTexture(`wood-${repeat.join('x')}`, 512, 512, (ctx) => {
    const rand = random(7)
    const tones = ['#e4cdb0', '#dbc2a4', '#e2c6a4', '#d9bd9c', '#d5b896']
    const plankH = 64
    for (let row = 0; row < 512 / plankH; row += 1) {
      let x = row % 2 === 0 ? 0 : -96
      while (x < 512) {
        const width = 128 + Math.floor(rand() * 96)
        ctx.fillStyle = tones[Math.floor(rand() * tones.length)]
        ctx.fillRect(x, row * plankH, width, plankH)
        ctx.strokeStyle = 'rgba(120,80,40,0.12)'
        for (let grain = 0; grain < 4; grain += 1) {
          const y = row * plankH + 10 + rand() * (plankH - 20)
          ctx.beginPath(); ctx.moveTo(x + 4, y); ctx.bezierCurveTo(x + width / 3, y + 2, x + (2 * width) / 3, y - 2, x + width - 4, y); ctx.stroke()
        }
        ctx.fillStyle = 'rgba(120,80,40,0.3)'
        ctx.fillRect(x, row * plankH, 2, plankH)
        x += width
      }
      ctx.fillStyle = 'rgba(120,80,40,0.28)'
      ctx.fillRect(0, row * plankH, 512, 2)
    }
  }, repeat)
}

/** Large-format polished light-grey porcelain tile — modern corridor/entrance floor. */
export function tileFloor(repeat: [number, number]) {
  return canvasTexture(`tile-${repeat.join('x')}`, 256, 256, (ctx) => {
    ctx.fillStyle = '#eef2f6'; ctx.fillRect(0, 0, 256, 256)
    ctx.strokeStyle = 'rgba(150,165,180,0.7)'
    ctx.lineWidth = 2
    for (let i = 0; i <= 256; i += 128) { ctx.strokeRect(i, 0, 128, 128); ctx.strokeRect(i, 128, 128, 256 - 128) }
  }, repeat)
}

export function carpet(color: string, repeat: [number, number]) {
  return canvasTexture(`carpet-${color}-${repeat.join('x')}`, 128, 128, (ctx) => {
    const rand = random(11)
    ctx.fillStyle = color; ctx.fillRect(0, 0, 128, 128)
    for (let i = 0; i < 700; i += 1) { ctx.fillStyle = `rgba(0,0,0,${rand() * 0.06})`; ctx.fillRect(rand() * 128, rand() * 128, 1, 1) }
  }, repeat)
}

/** Freshly mown, bright lawn — the garden of a modern Googleplex campus. */
export function grass(repeat: [number, number]) {
  return canvasTexture(`grass-${repeat.join('x')}`, 256, 256, (ctx) => {
    const rand = random(3)
    ctx.fillStyle = '#6cb355'; ctx.fillRect(0, 0, 256, 256)
    for (let i = 0; i < 3200; i += 1) {
      const shade = 80 + Math.floor(rand() * 70)
      ctx.fillStyle = `rgb(${shade - 25},${Math.min(235, shade + 65)},${shade - 40})`
      ctx.fillRect(rand() * 256, rand() * 256, 2, 3)
    }
    // The mowing stripes every other block.
    ctx.fillStyle = 'rgba(40,110,30,0.10)'
    for (let i = 0; i < 4; i += 1) ctx.fillRect(i * 128, 0, 64, 256)
  }, repeat)
}

/** Smooth warm-grey asphalt with a clean centre line. */
export function asphalt(repeat: [number, number]) {
  return canvasTexture(`asphalt-${repeat.join('x')}`, 256, 256, (ctx) => {
    const rand = random(5)
    ctx.fillStyle = '#4a4f54'; ctx.fillRect(0, 0, 256, 256)
    for (let i = 0; i < 2600; i += 1) { const g = 66 + Math.floor(rand() * 34); ctx.fillStyle = `rgb(${g},${g},${g + 4})`; ctx.fillRect(rand() * 256, rand() * 256, 1.5, 1.5) }
    ctx.fillStyle = '#e8dfa0'
    ctx.fillRect(0, 121, 256, 14)
  }, repeat)
}

/** Smooth charcoal-grey paving slabs for the modern plaza. */
export function pavingStones(repeat: [number, number]) {
  return canvasTexture(`paving-${repeat.join('x')}`, 256, 256, (ctx) => {
    ctx.fillStyle = '#d7dbe0'; ctx.fillRect(0, 0, 256, 256)
    ctx.strokeStyle = 'rgba(120,130,140,0.5)'
    ctx.lineWidth = 2
    for (let y = 0; y < 256; y += 64) {
      for (let x = (y / 64) % 2 === 0 ? 0 : 32; x < 256; x += 64) ctx.strokeRect(x, y, 32, 64)
    }
  }, repeat)
}

/** Painted brand sign: bold text on a coloured board. */
export function signTexture(text: string, background: string, foreground: string, subtitle?: string) {
  return canvasTexture(`sign-${text}-${background}-${subtitle ?? ''}`, 512, 160, (ctx) => {
    ctx.fillStyle = background; ctx.fillRect(0, 0, 512, 160)
    ctx.strokeStyle = foreground; ctx.lineWidth = 8; ctx.strokeRect(10, 10, 492, 140)
    ctx.fillStyle = foreground
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.font = 'bold 76px Georgia, "Times New Roman", serif'
    ctx.fillText(text, 256, subtitle ? 66 : 82)
    if (subtitle) { ctx.font = 'bold 30px Arial, sans-serif'; ctx.fillText(subtitle, 256, 124) }
  })
}

/** The Indonesian flag: red over white. */
export function merahPutih() {
  return canvasTexture('merah-putih', 96, 64, (ctx) => {
    ctx.fillStyle = '#ce1126'; ctx.fillRect(0, 0, 96, 32)
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 32, 96, 32)
  })
}

/** The multicoloured Google "G". Built from four coloured strokes, exactly like the logo. */
export function googleLogo() {
  return canvasTexture('google-g', 256, 256, (ctx) => {
    ctx.clearRect(0, 0, 256, 256)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    const stroke = (color: string, width: number) => { ctx.strokeStyle = color; ctx.lineWidth = width }
    const arc = (cx: number, cy: number, r: number, a0: number, a1: number, color: string, width: number) => { stroke(color, width); ctx.beginPath(); ctx.arc(cx, cy, r, a0, a1); ctx.stroke() }
    const line = (x0: number, y0: number, x1: number, y1: number, color: string, width: number) => { stroke(color, width); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke() }
    const BLUE = '#4285F4', RED = '#EA4335', YELLOW = '#FBBC05', GREEN = '#34A853'
    const cx = 150, cy = 142, R = 72, W = 44
    // Blue: the top curve (from ~108° to ~288° going clockwise) that becomes the vertical stroke.
    arc(cx, cy, R, Math.PI * 0.6, 0, BLUE, W)
    // Red: the right-hand curve.
    arc(cx, cy, R, 0, Math.PI * 0.78, RED, W)
    // Yellow: the bottom leg back toward the centre dot.
    arc(cx, cy, R, Math.PI * 1.32, Math.PI * 1.9, YELLOW, W)
    // Green: the lower-left stem joining blue.
    arc(cx, cy, R, Math.PI * 0.78, Math.PI * 1.2, GREEN, W)
    // Centre dot (the G's crossbar gap) in blue.
    ctx.fillStyle = BLUE
    ctx.beginPath(); ctx.arc(cx + 8, cy - 18, 34, 0, Math.PI * 2); ctx.fill()
    // A clean horizontal baseline so the mark reads as a sign.
    line(44, 214, 212, 214, '#c9d2da', 10)
  })
}

export function screenTexture(active: boolean) {
  return canvasTexture(`screen-${active}`, 128, 80, (ctx) => {
    ctx.fillStyle = active ? '#15313a' : '#0d1112'; ctx.fillRect(0, 0, 128, 80)
    if (!active) return
    const rand = random(13)
    for (let line = 0; line < 9; line += 1) {
      ctx.fillStyle = ['#7ee0c3', '#f2c58a', '#a9d4ff', '#e7e7e7'][line % 4]
      ctx.fillRect(8 + (line % 3) * 6, 8 + line * 7.5, 30 + rand() * 70, 3)
    }
  })
}

/** A retro game on the arcade screens: a grid of bricks, a paddle and a ball. */
export function arcadeScreen() {
  return canvasTexture('arcade-screen', 128, 100, (ctx) => {
    ctx.fillStyle = '#0b1026'; ctx.fillRect(0, 0, 128, 100)
    const colors = ['#e63946', '#f4a261', '#f4d35e', '#2a9d8f', '#3a86ff']
    colors.forEach((color, row) => { ctx.fillStyle = color; for (let col = 0; col < 8; col += 1) ctx.fillRect(6 + col * 15, 10 + row * 7, 13, 5) })
    ctx.fillStyle = '#ffffff'; ctx.fillRect(52, 88, 26, 4); ctx.fillRect(70, 64, 4, 4)
  })
}