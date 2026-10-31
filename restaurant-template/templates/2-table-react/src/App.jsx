import { motion } from 'motion/react'
import Cursor from './components/Cursor.jsx'
import Hero from './sections/Hero.jsx'
import Menu from './sections/Menu.jsx'
import Chef from './sections/Chef.jsx'
import Reservation from './sections/Reservation.jsx'

export default function App() {
  return (
    <>
      <header className="top">
        <a href="#" className="mark">Sillage<i aria-hidden="true" /></a>
        <motion.a href="#reserver" className="link" data-cursor="Réserver" whileTap={{ scale: 0.97 }}>Réserver</motion.a>
      </header>

      <main>
        <Hero />
        <Menu />
        <Chef />
        <Reservation />
      </main>

      <footer>
        <p>Sillage · 14 quai des Chalands, 00000 La Ville · <a href="mailto:bonjour@example.fr">bonjour@example.fr</a> · <a href="tel:+33100000000">01 00 00 00 00</a></p>
        <p><a href="#">Mentions légales</a> · Liste des allergènes disponible sur demande.</p>
      </footer>

      <Cursor />
    </>
  )
}
