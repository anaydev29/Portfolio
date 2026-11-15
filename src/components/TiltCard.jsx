import { useRef } from 'react'

/*
  Card that tilts in 3D toward the mouse and shows a soft light glare.
  Only active for mouse users who haven't asked for reduced motion,
  so phones and tablets just get a normal card.
*/
export default function TiltCard({ children, className = '', max = 7 }) {
  const ref = useRef(null)
  const enabled = useRef(null)

  const isEnabled = () => {
    if (enabled.current === null) {
      enabled.current =
        window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
    return enabled.current
  }

  const onMove = (e) => {
    const el = ref.current
    if (!el || !isEnabled()) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.setProperty('--rx', `${(0.5 - y) * max * 2}deg`)
    el.style.setProperty('--ry', `${(x - 0.5) * max * 2}deg`)
    el.style.setProperty('--gx', `${x * 100}%`)
    el.style.setProperty('--gy', `${y * 100}%`)
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <div ref={ref} className={`tilt ${className}`} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </div>
  )
}
