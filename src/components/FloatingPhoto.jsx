import { useEffect, useRef } from 'react'

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

/*
  The hero photo behaves like the red balls around it:
  - it floats gently on its own (CSS animation)
  - it drifts toward the pointer (parallax) and tilts in 3D toward it,
    smoothed the same way as the balls, with a soft light glare
  - it settles back to centre when the pointer leaves
  Only the moving parts run in JS, and only while the photo is on screen.
*/
export default function FloatingPhoto({ src, alt, width, height }) {
  const float = useRef(null) // outer: float animation + parallax shift
  const card = useRef(null) // inner: 3D tilt + glare

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const floatEl = float.current
    const cardEl = card.current

    let tx = 0 // target, -1..1
    let ty = 0
    let cx = 0 // current, smoothed
    let cy = 0
    let active = false
    let visible = true
    let raf = 0

    const frame = () => {
      raf = 0
      const targetX = active ? tx : 0
      const targetY = active ? ty : 0
      cx += (targetX - cx) * 0.08
      cy += (targetY - cy) * 0.08

      floatEl.style.translate = `${(cx * 16).toFixed(2)}px ${(cy * 12).toFixed(2)}px`
      cardEl.style.transform = `perspective(900px) rotateX(${(-cy * 8).toFixed(2)}deg) rotateY(${(cx * 10).toFixed(2)}deg)`
      cardEl.style.setProperty('--gx', `${(50 + cx * 38).toFixed(1)}%`)
      cardEl.style.setProperty('--gy', `${(30 + cy * 38).toFixed(1)}%`)

      // Keep animating until it has settled back to rest
      const moving = Math.abs(targetX - cx) + Math.abs(targetY - cy) > 0.002
      if (moving && visible) raf = requestAnimationFrame(frame)
    }
    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(frame)
    }

    const onMove = (e) => {
      tx = clamp((e.clientX / window.innerWidth) * 2 - 1, -1, 1)
      ty = clamp((e.clientY / window.innerHeight) * 2 - 1, -1, 1)
      active = true
      kick()
    }
    const onLeave = () => {
      active = false
      kick()
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) kick()
    })
    io.observe(floatEl)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div ref={float} className="photo-float">
      <div ref={card} className="photo-wrap">
        <img src={src} alt={alt} width={width} height={height} fetchPriority="high" decoding="async" />
        <span className="photo-glare" aria-hidden="true" />
      </div>
    </div>
  )
}
