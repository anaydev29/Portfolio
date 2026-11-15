import { useEffect, useRef } from 'react'

const INTERACTIVE = 'a, button, [role="button"], [data-cursor]'

/*
  Custom cursor for mouse users only (hidden on touch screens):
  - a red dot that follows the pointer exactly
  - a sage ring that trails behind, grows over links and buttons,
    and squeezes when you click
  - a soft sage glow that follows the ring behind the page content
  Positions are written straight to the elements (no React re-renders).
*/
export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const glow = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const root = document.documentElement
    root.classList.add('has-cursor')

    const els = [dot.current, ring.current, glow.current]
    let mx = -200
    let my = -200
    let rx = -200
    let ry = -200
    let raf = 0
    let seen = false

    const loop = () => {
      rx += (mx - rx) * 0.16
      ry += (my - ry) * 0.16
      const t = `translate3d(${rx}px, ${ry}px, 0)`
      ring.current.style.transform = t
      glow.current.style.transform = t
      // Stop the loop once the ring has caught up
      raf = Math.abs(mx - rx) + Math.abs(my - ry) > 0.2 ? requestAnimationFrame(loop) : 0
    }

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      dot.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`
      if (!seen) {
        seen = true
        rx = mx
        ry = my
        els.forEach((el) => el.classList.add('is-visible'))
      }
      if (!raf) raf = requestAnimationFrame(loop)
    }

    const onOver = (e) => {
      const hit = e.target instanceof Element && !!e.target.closest(INTERACTIVE)
      ring.current.classList.toggle('is-link', hit)
      dot.current.classList.toggle('is-link', hit)
    }
    const onDown = () => ring.current.classList.add('is-down')
    const onUp = () => ring.current.classList.remove('is-down')
    const onLeave = () => els.forEach((el) => el.classList.remove('is-visible'))
    const onEnter = () => seen && els.forEach((el) => el.classList.add('is-visible'))

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)
    root.addEventListener('mouseleave', onLeave)
    root.addEventListener('mouseenter', onEnter)

    return () => {
      cancelAnimationFrame(raf)
      root.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
      root.removeEventListener('mouseleave', onLeave)
      root.removeEventListener('mouseenter', onEnter)
    }
  }, [])

  return (
    <div aria-hidden="true">
      <div ref={glow} className="cursor-glow" />
      <div ref={ring} className="cursor-ring">
        <i />
      </div>
      <div ref={dot} className="cursor-dot">
        <i />
      </div>
    </div>
  )
}
