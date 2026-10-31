import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react'

const RED = '#d4472b', INK = '#e9e3d6', BG = '#0f0e0c'

// Curseur contextuel : point, anneau sur ce qui se clique, étiquette sur les éléments [data-cursor],
// absent sur les champs de saisie. Souris précise uniquement.
export default function Cursor() {
  const reduce = useReducedMotion()
  const [fine, setFine] = useState(false)
  const [shown, setShown] = useState(false)
  const [mode, setMode] = useState({ k: 'base', label: '' })
  const [down, setDown] = useState(false)
  const x = useMotionValue(0), y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 700, damping: 50, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 700, damping: 50, mass: 0.4 })
  const first = useRef(true)

  useEffect(() => { setFine(matchMedia('(hover: hover) and (pointer: fine)').matches) }, [])
  const on = fine && !reduce
  useEffect(() => {
    document.documentElement.classList.toggle('has-cursor', on)
    return () => document.documentElement.classList.remove('has-cursor')
  }, [on])

  useEffect(() => {
    if (!on) return
    const move = e => {
      if (e.pointerType !== 'mouse') return
      x.set(e.clientX); y.set(e.clientY)
      if (first.current) { sx.jump(e.clientX); sy.jump(e.clientY); first.current = false }
      setShown(true)
    }
    const over = e => {
      if (e.pointerType !== 'mouse') return
      const t = e.target
      if (t.closest('.fields')) return setMode({ k: 'hidden', label: '' })
      const c = t.closest('[data-cursor]')
      if (c) return setMode({ k: c.matches('.courses li') ? 'row' : 'cta', label: c.dataset.cursor })
      if (t.closest('a[href], button, .days label, .choices label')) return setMode({ k: 'ring', label: '' })
      setMode({ k: 'base', label: '' })
    }
    const leave = () => setShown(false)
    const dn = () => setDown(true), up = () => setDown(false)
    addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over)
    document.addEventListener('pointerdown', dn)
    document.addEventListener('pointerup', up)
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      document.removeEventListener('pointerdown', dn)
      document.removeEventListener('pointerup', up)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [on, x, y, sx, sy])

  if (!on) return null

  const S = {
    base: { scale: 1, opacity: 1, backgroundColor: RED, color: BG },
    ring: { scale: 3.4, opacity: 0.28, backgroundColor: RED, color: BG },
    hidden: { scale: 0, opacity: 0, backgroundColor: RED, color: BG },
    cta: { scale: 5.6, opacity: 1, backgroundColor: RED, color: INK },
    row: { scale: 6, opacity: 1, backgroundColor: INK, color: BG }
  }[mode.k]

  return (
    <motion.div className="cur" aria-hidden="true" style={{ x: sx, y: sy }} animate={{ opacity: shown ? 1 : 0 }} transition={{ duration: 0.2 }}>
      <motion.i
        className="dot"
        animate={{ scale: S.scale * (down ? 0.85 : 1), opacity: S.opacity, backgroundColor: S.backgroundColor }}
        transition={{ type: 'spring', bounce: 0, visualDuration: 0.3 }}
      />
      <motion.b className="txt" animate={{ opacity: mode.label ? 1 : 0, color: S.color }} transition={{ duration: 0.15 }}>
        {mode.label}
      </motion.b>
    </motion.div>
  )
}
