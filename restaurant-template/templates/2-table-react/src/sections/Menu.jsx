import { useEffect, useRef, useState } from 'react'
import { motion, useScroll } from 'motion/react'
import CutReveal from '../components/CutReveal.jsx'
import Stage3D from '../components/Stage3D.jsx'
import { COURSES, PRICES } from '../data.js'

const ease = [0.2, 0.7, 0.2, 1]
const pad = n => String(n).padStart(2, '0')

export default function Menu() {
  const list = useRef(null)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 75%', 'end 60%'] })

  // Le plat actif = celui qui traverse la bande centrale de l'écran.
  useEffect(() => {
    const items = [...list.current.querySelectorAll('li')]
    const io = new IntersectionObserver(
      es => es.forEach(e => e.isIntersecting && setActive(items.indexOf(e.target))),
      { rootMargin: '-45% 0px -45% 0px' }
    )
    items.forEach(li => io.observe(li))
    return () => io.disconnect()
  }, [])

  return (
    <section className="menu" id="menu">
      <p className="cap">Le menu · automne</p>
      <div className="menu-grid">
      <Stage3D active={active} label={`Plat ${active + 1} sur ${COURSES.length} : ${COURSES[active].title}`} />
      <ol className="courses" ref={list}>
        {COURSES.map((c, i) => (
          <motion.li
            key={c.title}
            data-cursor={`${pad(i + 1)} / ${pad(COURSES.length)}`}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease }}
          >
            <motion.span className="n" aria-hidden="true" initial={{ x: -24 }} whileInView={{ x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.9, ease }}>
              {pad(i + 1)}
            </motion.span>
            <div>
              <h2><CutReveal text={c.title} stagger={0.07} delay={0.15} /></h2>
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.8, delay: 0.5 }}>
                {c.text}
              </motion.p>
            </div>
          </motion.li>
        ))}
        <motion.span className="rail" aria-hidden="true" style={{ scaleY: scrollYProgress }} />
      </ol>
      </div>

      <dl className="prices">
        {PRICES.map(([k, v]) => (
          <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
        ))}
      </dl>
      <p className="note">Le menu change avec les arrivages. Prix nets, service compris. Allergies et régimes : à signaler à la réservation.</p>
    </section>
  )
}
