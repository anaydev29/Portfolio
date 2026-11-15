import { useEffect, useRef } from 'react'
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  SphereGeometry,
  MeshPhysicalMaterial,
  Mesh,
  HemisphereLight,
  DirectionalLight,
  PointLight,
  MathUtils,
} from 'three'

/*
  Glossy red balls that float, shift with the cursor (parallax) and
  get pushed away when the cursor comes close.

  Written with plain three.js (no React Three Fiber / drei) to keep the
  JavaScript small. Only the pieces we use are imported, so the bundler
  can drop the rest of three.
*/

const FOV = 45
const TAN = Math.tan(MathUtils.degToRad(FOV / 2))
// The area that should always stay visible, whatever the screen shape
const HALF_W = 3.7
const HALF_H = 3.1

// x, y, z, radius, colour, float amount, float speed, phase
const BALLS = [
  [1.95, 1.35, 0.6, 0.52, 0xc93c3c, 0.18, 0.9, 0.0],
  [-2.25, 0.85, 0.2, 0.34, 0xd9534f, 0.22, 1.1, 1.3],
  [2.3, -1.2, 0.9, 0.68, 0xb83232, 0.15, 0.7, 2.1],
  [-1.75, -1.65, 0.7, 0.5, 0xc93c3c, 0.2, 0.8, 3.4],
  [0.35, 2.25, -0.4, 0.28, 0xe06060, 0.25, 1.2, 4.2],
  [-0.3, -2.35, 1.1, 0.22, 0xd9534f, 0.2, 1.0, 5.0],
  [2.85, 0.15, -0.8, 0.24, 0xa82d2d, 0.2, 1.3, 0.7],
  [-2.8, -0.35, -1.0, 0.3, 0xb83232, 0.18, 0.9, 2.8],
]

const clamp = MathUtils.clamp

// Corner roundness of the photo frame in pixels (matches the CSS)
const PHOTO_RADIUS_PX = 64

/*
  Pushes a ball out of the photo's on-screen rounded rectangle.
  Everything is in world units at the ball's own depth.
  - hard rule: the ball may overlap the photo edge by at most 30% of its radius
  - soft rule: a gentle force field around the photo nudges nearby balls away,
    so they slide aside as the photo floats, shifts and tilts
*/
function pushFromPhoto(b, x, y, view) {
  const { u, ccx, ccy, photo } = view
  const rl = (photo.left - ccx) * u
  const rr = (photo.right - ccx) * u
  const rt = -(photo.top - ccy) * u
  const rb = -(photo.bottom - ccy) * u
  const rad = Math.min(PHOTO_RADIUS_PX * u, (rr - rl) / 2, (rt - rb) / 2)

  // Closest point on the inner rectangle (the photo shrunk by its corner radius)
  const qx = clamp(x, rl + rad, rr - rad)
  const qy = clamp(y, rb + rad, rt - rad)
  let dx = x - qx
  let dy = y - qy
  let dist = Math.hypot(dx, dy)
  let sd // signed distance from the photo's surface (negative = inside)

  if (dist < 1e-4) {
    // Centre is inside the photo: leave through the nearest edge
    const toL = x - rl
    const toR = rr - x
    const toB = y - rb
    const toT = rt - y
    const m = Math.min(toL, toR, toB, toT)
    if (m === toL) [dx, dy] = [-1, 0]
    else if (m === toR) [dx, dy] = [1, 0]
    else if (m === toB) [dx, dy] = [0, -1]
    else [dx, dy] = [0, 1]
    sd = -m
  } else {
    dx /= dist
    dy /= dist
    sd = dist - rad
  }

  const minGap = b.r * 0.7
  const push = Math.max(minGap - sd, (minGap + 0.9 - sd) * 0.45)
  return push > 0 ? [x + dx * push, y + dy * push] : [x, y]
}

export default function HeroScene({ onReady, obstacle }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current

    let renderer
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    } catch {
      return // No WebGL: the CSS orbs stay in place instead
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    mount.appendChild(renderer.domElement)

    const scene = new Scene()
    const camera = new PerspectiveCamera(FOV, 1, 0.1, 50)

    // Sage-tinted ambient light keeps the reds feeling part of the palette
    scene.add(new HemisphereLight(0xffffff, 0x9caf88, 1.4))
    const key = new DirectionalLight(0xffffff, 2.6)
    key.position.set(3, 4, 5)
    scene.add(key)
    const rim = new PointLight(0xffd0c0, 30, 0, 2)
    rim.position.set(-4, 2, 3)
    scene.add(rim)

    const geometry = new SphereGeometry(1, 48, 32)
    const materials = new Map()
    const balls = BALLS.map(([x, y, z, r, color, amp, speed, phase]) => {
      if (!materials.has(color)) {
        materials.set(
          color,
          new MeshPhysicalMaterial({
            color,
            roughness: 0.22,
            metalness: 0,
            clearcoat: 1,
            clearcoatRoughness: 0.12,
          }),
        )
      }
      const mesh = new Mesh(geometry, materials.get(color))
      mesh.scale.setScalar(r)
      mesh.position.set(x, y, z)
      scene.add(mesh)
      return { mesh, r, x, y, z, amp, speed, phase, cx: x, cy: y }
    })

    // Fit the scene to the container (portrait phones and wide desktops)
    let halfW = HALF_W
    let halfH = HALF_H
    const resize = () => {
      const w = mount.clientWidth || 1
      const h = mount.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.position.z = Math.max(HALF_H / TAN, HALF_W / (TAN * camera.aspect))
      camera.updateProjectionMatrix()
      halfH = TAN * camera.position.z
      halfW = halfH * camera.aspect
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(mount)

    // Pointer position relative to the scene (-1..1), smoothed every frame
    const ptr = { x: 0, y: 0, active: false }
    let tx = 0
    let ty = 0
    const onMove = (e) => {
      const rect = mount.getBoundingClientRect()
      tx = ((e.clientX - rect.left) / rect.width) * 2 - 1
      ty = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      ptr.active = true
    }
    const onLeave = () => {
      ptr.active = false
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)

    let raf = 0
    let visible = true
    let first = true
    let photoEl = null

    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      const t = now / 1000

      ptr.x += ((ptr.active ? MathUtils.clamp(tx, -1.6, 1.6) : 0) - ptr.x) * 0.08
      ptr.y += ((ptr.active ? MathUtils.clamp(ty, -1.6, 1.6) : 0) - ptr.y) * 0.08
      const px = ptr.x * halfW
      const py = ptr.y * halfH

      // Where the photo is on screen right now (it floats, shifts and tilts)
      if (!photoEl && obstacle) photoEl = document.querySelector(obstacle)
      const sceneRect = mount.getBoundingClientRect()
      const photoRect = photoEl ? photoEl.getBoundingClientRect() : null
      const hasPhoto = photoRect && photoRect.width > 0 && sceneRect.height > 0

      for (const b of balls) {
        // Gentle floating
        let x = b.x + Math.cos(t * b.speed + b.phase) * b.amp * 0.6
        let y = b.y + Math.sin(t * b.speed * 1.1 + b.phase) * b.amp

        // Parallax: balls closer to the camera move more
        const depth = 0.5 + b.z * 0.4
        x += ptr.x * 0.28 * depth
        y += ptr.y * 0.28 * depth

        // Push away from the cursor
        if (ptr.active) {
          const dx = x - px
          const dy = y - py
          const dist = Math.hypot(dx, dy) || 0.001
          const reach = 1.5 + b.r
          if (dist < reach) {
            const f = 1 - dist / reach
            x += (dx / dist) * f * 1.1
            y += (dy / dist) * f * 1.1
          }
        }

        // The photo pushes balls aside (applied last so it always wins)
        if (hasPhoto) {
          const view = {
            u: (2 * TAN * (camera.position.z - b.z)) / sceneRect.height,
            ccx: sceneRect.left + sceneRect.width / 2,
            ccy: sceneRect.top + sceneRect.height / 2,
            photo: photoRect,
          }
          ;[x, y] = pushFromPhoto(b, x, y, view)
        }

        // Never leave the visible area, so no ball is ever cut off at the edge
        const viewH = TAN * (camera.position.z - b.z)
        const limitX = viewH * camera.aspect - b.r * 1.35
        const limitY = viewH - b.r * 1.35
        x = clamp(x, -limitX, limitX)
        y = clamp(y, -limitY, limitY)

        b.cx += (x - b.cx) * 0.08
        b.cy += (y - b.cy) * 0.08
        b.mesh.position.set(b.cx, b.cy, b.z)
      }

      renderer.render(scene, camera)
      if (first) {
        first = false
        onReady?.()
      }
    }

    // Only animate while the scene is on screen and the tab is visible
    const start = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      visible ? start() : stop()
    })
    io.observe(mount)
    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVisibility)
    start()

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
      geometry.dispose()
      materials.forEach((m) => m.dispose())
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={mountRef} className="scene-mount" />
}
