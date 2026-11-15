import { motion } from 'framer-motion'

export default function PageTransition({ children }) {
  return (
    <motion.main
      id="main"
      className="page"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="container">{children}</div>
    </motion.main>
  )
}
