import { Fragment, useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'

// Révélation par découpe : chaque mot (ou lettre) monte depuis un masque.
// Écrit pour Sillage, d'après le principe du « vertical cut reveal » : mots insécables,
// départ décalé, ressort sans rebond. Le texte complet reste lu par les lecteurs d'écran.
// On observe le conteneur, pas les mots : un mot caché sous son masque n'est jamais « visible ».
export default function CutReveal({ text, splitBy = 'words', stagger = 0.06, delay = 0, amount = 0.6 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount })
  const reduce = useReducedMotion()
  if (reduce) return <>{text}</>

  const words = text.split(' ')
  const pieces = words.map(w => (splitBy === 'characters' ? [...w] : [w]))
  let n = 0
  const idx = pieces.map(ws => ws.map(() => n++))

  return (
    <span aria-label={text} ref={ref}>
      {pieces.map((ws, wi) => (
        <Fragment key={wi}>
          <span className="cut-word" aria-hidden="true">
            {ws.map((p, pi) => (
              <span className="cut-clip" key={pi}>
                <motion.span
                  className="cut-in"
                  initial={{ y: '115%' }}
                  animate={{ y: inView ? '0%' : '115%' }}
                  transition={{ type: 'spring', bounce: 0, visualDuration: 0.7, delay: delay + idx[wi][pi] * stagger }}
                >
                  {p}
                </motion.span>
              </span>
            ))}
          </span>
          {wi < pieces.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </span>
  )
}
