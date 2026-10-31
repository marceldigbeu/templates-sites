import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

const ease = [0.2, 0.7, 0.2, 1]

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-14%'])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.1])

  return (
    <section className="hero" ref={ref}>
      <motion.h1 aria-label="Sillage" style={{ x, opacity }}>
        <span aria-hidden="true">
          {[...'Sillage'].map((ch, i) => (
            <motion.span
              className="l"
              key={i}
              initial={{ opacity: 0, y: '45%', filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: '0%', filter: 'blur(0px)' }}
              transition={{ duration: 1, ease, delay: 0.1 + i * 0.07 }}
            >
              {ch}
            </motion.span>
          ))}
        </span>
      </motion.h1>
      <motion.p className="facts" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.9 }}>
        Un menu en cinq temps.<br />Dix-huit couverts.<br />Du mercredi au samedi, le soir.
      </motion.p>
      <motion.p className="addr" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 1.0 }}>
        14 quai des Chalands<br />00000 La Ville
      </motion.p>
    </section>
  )
}
