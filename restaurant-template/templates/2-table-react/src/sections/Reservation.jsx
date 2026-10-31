import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { OPEN_DAYS, HORIZON, SERVICES, ENDPOINT } from '../data.js'

const DAY = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.']
const MONTH = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
const ease = [0.2, 0.7, 0.2, 1]
const press = { scale: 0.94 }
const spring = { type: 'spring', bounce: 0, visualDuration: 0.2 }

function buildDays() {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const out = []
  for (let i = 1; i <= HORIZON; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    if (!OPEN_DAYS.includes(d.getDay())) continue
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    out.push({ iso, wd: DAY[d.getDay()], d: d.getDate(), m: MONTH[d.getMonth()] })
  }
  return out
}

export default function Reservation() {
  const days = useMemo(buildDays, [])
  const [form, setForm] = useState({ date: '', service: '', couverts: '2', nom: '', email: '', tel: '', note: '' })
  const [bad, setBad] = useState({})
  const [msg, setMsg] = useState(null)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const chosen = days.find(d => d.iso === form.date)
  const recap = !chosen && !form.service
    ? 'Aucune soirée choisie.'
    : [chosen ? `${chosen.wd} ${chosen.d} ${chosen.m}` : '…', form.service || '…', form.couverts + (form.couverts === '1' ? ' couvert' : ' couverts')].join(' · ')

  async function submit(e) {
    e.preventDefault()
    const miss = []
    const nb = {}
    if (!form.date) miss.push('le jour')
    if (!form.service) miss.push('le service')
    if (!form.nom.trim()) { nb.nom = true; miss.push('votre nom') }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) { nb.email = true; miss.push('un courriel valide') }
    if (!form.tel.trim()) { nb.tel = true; miss.push('votre téléphone') }
    setBad(nb)
    if (miss.length) return setMsg({ ok: false, text: 'Il manque : ' + miss.join(', ') + '.' })

    if (!ENDPOINT) {
      console.log('Demande (démo)', form)
      return setMsg({ ok: true, text: 'Mode démo : rien n’a été envoyé. Renseignez ENDPOINT dans src/data.js.' })
    }
    try {
      const r = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(form) })
      if (!r.ok) throw new Error(r.status)
      setMsg({ ok: true, text: 'Demande reçue. Confirmation par courriel sous 24 h.' })
      setForm({ date: '', service: '', couverts: '2', nom: '', email: '', tel: '', note: '' })
    } catch {
      setMsg({ ok: false, text: 'L’envoi a échoué. Écrivez-nous : bonjour@example.fr.' })
    }
  }

  return (
    <section className="book" id="reserver">
      <p className="cap">Réserver</p>
      <h2>Choisissez une soirée.</h2>

      <form onSubmit={submit} noValidate>
        <fieldset>
          <legend>1 · Le jour</legend>
          <div className="days">
            {days.map(d => (
              <label key={d.iso}>
                <input type="radio" name="date" value={d.iso} checked={form.date === d.iso} onChange={() => set('date', d.iso)} />
                <motion.span whileTap={press} transition={spring}><small>{d.wd}</small><b>{d.d}</b><small>{d.m}</small></motion.span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>2 · Le service</legend>
          <div className="choices">
            {SERVICES.map(s => (
              <label key={s}>
                <input type="radio" name="service" value={s} checked={form.service === s} onChange={() => set('service', s)} />
                <motion.span whileTap={press} transition={spring}>{s}</motion.span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>3 · Les couverts</legend>
          <div className="choices">
            {['1', '2', '3', '4', '5', '6'].map(n => (
              <label key={n}>
                <input type="radio" name="couverts" value={n} checked={form.couverts === n} onChange={() => set('couverts', n)} />
                <motion.span whileTap={press} transition={spring}>{n}</motion.span>
              </label>
            ))}
          </div>
          <p className="hint">Au-delà de six : écrivez-nous.</p>
        </fieldset>

        <fieldset>
          <legend>4 · Vous</legend>
          <div className="fields">
            <label>Nom<input name="nom" autoComplete="name" className={bad.nom ? 'bad' : ''} value={form.nom} onChange={e => set('nom', e.target.value)} /></label>
            <label>Courriel<input name="email" type="email" autoComplete="email" className={bad.email ? 'bad' : ''} value={form.email} onChange={e => set('email', e.target.value)} /></label>
            <label>Téléphone<input name="tel" type="tel" autoComplete="tel" className={bad.tel ? 'bad' : ''} value={form.tel} onChange={e => set('tel', e.target.value)} /></label>
            <label className="wide">Allergies, régime, occasion<input name="note" value={form.note} onChange={e => set('note', e.target.value)} /></label>
          </div>
        </fieldset>

        <motion.p key={recap} className="recap" aria-live="polite" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease }}>
          {recap}
        </motion.p>
        <motion.button type="submit" data-cursor="Envoyer" whileTap={{ scale: 0.97 }} transition={spring}>Envoyer la demande</motion.button>
        {msg && (
          <motion.p key={msg.text} className={'msg ' + (msg.ok ? 'ok' : 'err')} role="status" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease }}>
            {msg.text}
          </motion.p>
        )}
        <p className="hint">Confirmation par courriel sous 24 h. Annulation gratuite jusqu'à 48 h avant.</p>
      </form>
    </section>
  )
}
