import { useEffect } from 'react'

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

/*
  Magnetic buttons: any element with the data-magnetic attribute is gently
  pulled toward the mouse when the cursor gets close. One shared listener,
  mouse users only, and switched off for reduced motion.
  Uses the CSS `translate` property so it never clashes with hover transforms.
*/
export default function Magnetic() {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    let raf = 0
    let px = 0
    let py = 0

    const update = () => {
      raf = 0
      document.querySelectorAll('[data-magnetic]').forEach((el) => {
        const r = el.getBoundingClientRect()
        if (!r.width) return // hidden (for example the desktop button on mobile)

        // Work from the element's resting position, not where it is pulled to now
        const tx = Number(el.dataset.tx || 0)
        const ty = Number(el.dataset.ty || 0)
        const cx = r.left + r.width / 2 - tx
        const cy = r.top + r.height / 2 - ty
        const dx = px - cx
        const dy = py - cy
        const reach = Math.max(r.width, r.height) / 2 + 70

        const nx = Math.hypot(dx, dy) < reach ? clamp(dx * 0.3, -10, 10) : 0
        const ny = Math.hypot(dx, dy) < reach ? clamp(dy * 0.4, -10, 10) : 0
        if (nx !== tx || ny !== ty) {
          el.dataset.tx = nx
          el.dataset.ty = ny
          el.style.translate = nx || ny ? `${nx}px ${ny}px` : ''
        }
      })
    }

    const onMove = (e) => {
      px = e.clientX
      py = e.clientY
      if (!raf) raf = requestAnimationFrame(update)
    }
    const reset = () => {
      px = -9999
      py = -9999
      if (!raf) raf = requestAnimationFrame(update)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', reset)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('mouseleave', reset)
    }
  }, [])

  return null
}
