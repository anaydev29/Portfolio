import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'

/*
  A sage curtain that sweeps up over the screen when you change page, then
  lifts away. Timed to match the page exit (0.3s) so the swap happens while
  the screen is covered. It does not run on first load or for reduced motion.
*/
export default function PageWipe() {
  const { pathname } = useLocation()
  const reduced = useReducedMotion()
  const first = useRef(true)
  const [run, setRun] = useState(0)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setRun((n) => n + 1)
  }, [pathname])

  if (!run || reduced) return null

  return (
    <motion.div
      key={run}
      className="page-wipe"
      aria-hidden="true"
      initial={{ y: '100%' }}
      animate={{ y: ['100%', '0%', '0%', '-100%'] }}
      transition={{ duration: 0.85, times: [0, 0.35, 0.45, 1], ease: ['easeIn', 'linear', 'easeOut'] }}
    />
  )
}
