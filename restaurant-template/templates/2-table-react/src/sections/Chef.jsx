import { motion } from 'motion/react'
import CutReveal from '../components/CutReveal.jsx'
import { CHEF } from '../data.js'

export default function Chef() {
  return (
    <section className="chef">
      <div className="photo" style={{ '--img': "url('images/cheffe.jpg')" }} role="img" aria-label={`${CHEF.name}, cheffe`} />
      <div>
        <p className="cap">La cheffe</p>
        <p className="quote"><CutReveal text={CHEF.quote} stagger={0.045} amount={0.4} /></p>
        <p className="sign">
          {CHEF.name}
          <motion.span
            className="sign-line"
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 1 }}
            transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1], delay: 1.6 }}
          />
        </p>
      </div>
    </section>
  )
}
