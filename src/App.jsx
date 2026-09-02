import { useMemo, useState } from 'react'
import { ArrowLeft, Check, Clock3, HeartHandshake, MapPin, Phone, Search, ShieldCheck, Sparkles, Users } from 'lucide-react'
import './App.css'

const providers = [
  { name: 'מטב', type: 'שירותי סיעוד', area: 'כל הארץ', rating: '4.9', response: 'עד 24 שעות', phone: '1-700-700-114', tone: 'mint' },
  { name: 'דנאל סיעוד', type: 'מטפלים בבית', area: 'מרכז והשרון', rating: '4.8', response: 'עד 12 שעות', phone: '1-800-400-500', tone: 'peach' },
  { name: 'עמל ומעבר', type: 'דיור מוגן וסיעוד', area: 'כל הארץ', rating: '4.7', response: 'עד 48 שעות', phone: '1-800-800-810', tone: 'blue' },
  { name: 'עזר מציון', type: 'סיוע רפואי בבית', area: 'גוש דן וירושלים', rating: '4.9', response: 'עד 24 שעות', phone: '*2236', tone: 'yellow' },
]

function ProviderCard({ provider }) {
  const [open, setOpen] = useState(false)
  return <article className="provider-card">
    <div className={`provider-logo ${provider.tone}`}>{provider.name.slice(0, 1)}</div>
    <div className="provider-info"><h3>{provider.name}<span className="verified"><Check size={11} /></span></h3><p>{provider.type} · {provider.area}</p><div className="provider-meta"><b>★ {provider.rating}</b><span><Clock3 size={13} /> {provider.response}</span></div>{open && <a className="provider-phone" href={`tel:${provider.phone}`}><Phone size={13} /> {provider.phone}</a>}</div>
    <button className="icon-button" title={`פרטים על ${provider.name}`} aria-expanded={open} onClick={() => setOpen(!open)} type="button"><ArrowLeft size={17} /></button>
  </article>
}

function App() {
  const [query, setQuery] = useState('')
  const [area, setArea] = useState('כל האזורים')
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', need: 'טיפול סיעודי בבית', consent: false })
  const filteredProviders = useMemo(() => providers.filter((provider) => {
    const matchesQuery = `${provider.name} ${provider.type}`.includes(query)
    const matchesArea = area === 'כל האזורים' || provider.area === 'כל הארץ' || provider.area.includes(area)
    return matchesQuery && matchesArea
  }), [query, area])
  const updateForm = (field, value) => setForm((current) => ({ ...current, [field]: value }))
  const handleSubmit = (event) => { event.preventDefault(); if (form.name && form.phone && form.consent) setSubmitted(true) }
  const scrollToIntake = () => document.getElementById('intake').scrollIntoView({ behavior: 'smooth' })

  return <div className="app-shell" dir="rtl">
    <header className="topbar"><a className="brand" href="#top"><span className="brand-mark"><HeartHandshake size={20} /></span><span><strong>לב בבית</strong><small>חיבור אנושי, פשוט יותר</small></span></a><nav><a href="#how">איך זה עובד</a><a href="#providers">חברות סיעוד</a><a href="#about">אודותינו</a></nav><button className="text-button" type="button" onClick={scrollToIntake}><Phone size={16} /> דברו איתנו</button></header>
    <main id="top">
      <section className="hero-section"><div className="hero-copy"><div className="eyebrow"><Sparkles size={14} /> מוצאים את העזרה הנכונה</div><h1>לא צריך לחפש<br /><em>לבד.</em></h1><p>השאירו פרטים פעם אחת, ואנחנו נחבר אתכם לחברות הסיעוד המתאימות ביותר עבורכם.</p><div className="hero-actions"><button className="primary-button" type="button" onClick={scrollToIntake}>מצאו לי עזרה <ArrowLeft size={18} /></button><span className="trust-note"><ShieldCheck size={17} /> הפרטים שלכם נשמרים אצלנו</span></div></div><div className="hero-art"><div className="sun" /><div className="paper-shape" /><div className="person person-one"><div className="hair" /><div className="head" /><div className="body" /></div><div className="person person-two"><div className="hair" /><div className="head" /><div className="body" /></div><div className="plant"><span /><span /><i /></div><div className="art-caption"><span>01</span><b>חיבור שמתחיל<br />בהקשבה</b></div></div></section>
      <section className="stats-strip" id="about"><div><strong>10,000+</strong><span>משפחות שכבר מצאו מענה</span></div><div><strong>24 שעות</strong><span>זמן תגובה ממוצע</span></div><div><strong>100%</strong><span>ללא עלות למשפחות</span></div></section>
      <section className="workflow" id="how"><div className="section-heading"><span className="section-number">02 / הדרך שלנו</span><h2>שלושה צעדים<br /><em>לשקט נפשי.</em></h2></div><div className="steps"><div><span>01</span><Users size={25} /><h3>משתפים אותנו</h3><p>כמה פרטים עליכם ועל העזרה שאתם מחפשים.</p></div><div><span>02</span><MapPin size={25} /><h3>אנחנו מתאימים</h3><p>המערכת שלנו מוצאת חברות לפי האזור והצורך.</p></div><div><span>03</span><HeartHandshake size={25} /><h3>מתחברים</h3><p>החברות חוזרות אליכם. אתם בוחרים מה נכון.</p></div></div></section>
      <section className="workspace" id="intake"><div className="intake-panel"><div className="panel-kicker">01 / מתחילים כאן</div>{submitted ? <div className="success-state"><span className="success-icon"><Check size={28} /></span><h2>הפרטים התקבלו.</h2><p>שלחנו את הבקשה לחברות המתאימות. נציגים יחזרו אליכם בקרוב.</p><button className="secondary-button" type="button" onClick={() => setSubmitted(false)}>שליחת בקשה חדשה</button></div> : <form onSubmit={handleSubmit}><h2>ספרו לנו<br /><em>מה אתם צריכים.</em></h2><p className="panel-intro">מלאו את הפרטים ונחזור אליכם עם האפשרויות המתאימות.</p><label>שם מלא<input value={form.name} onChange={(event) => updateForm('name', event.target.value)} placeholder="איך קוראים לכם?" required /></label><label>מספר טלפון<input type="tel" value={form.phone} onChange={(event) => updateForm('phone', event.target.value)} placeholder="050-0000000" required /></label><label>מה אתם מחפשים?<select value={form.need} onChange={(event) => updateForm('need', event.target.value)}><option>טיפול סיעודי בבית</option><option>עובד/ת זר/ה</option><option>ליווי והשגחה</option><option>דיור מוגן</option></select></label><label className="check-label"><input type="checkbox" checked={form.consent} onChange={(event) => updateForm('consent', event.target.checked)} required /><span>אני מאשר/ת להעביר את הפרטים לחברות סיעוד רלוונטיות</span></label><button className="primary-button full" type="submit">שלחו לי אפשרויות <ArrowLeft size={18} /></button></form>}</div><div className="directory-panel" id="providers"><div className="directory-header"><div><div className="panel-kicker">03 / החברות שלנו</div><h2>מי יכול<br /><em>לעזור לכם?</em></h2></div><span className="result-count">{filteredProviders.length} חברות</span></div><div className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="חיפוש לפי שם או שירות" /></div><div className="filter-row"><select value={area} onChange={(event) => setArea(event.target.value)}><option>כל האזורים</option><option>מרכז</option><option>ירושלים</option><option>השרון</option></select><span><span className="live-dot" /> זמינות מעודכנת</span></div><div className="provider-list">{filteredProviders.map((provider) => <ProviderCard provider={provider} key={provider.name} />)}{filteredProviders.length === 0 && <p className="empty-result">לא מצאנו חברות לפי החיפוש הזה.</p>}</div><a className="directory-link" href="#intake">רוצים לקבל הצעות מכל החברות? <ArrowLeft size={16} /></a></div></section>
    </main><footer><span>© 2026 לב בבית</span><span>המרחב הבטוח שלכם למציאת טיפול</span><span>נגישות · פרטיות</span></footer>
  </div>
}

export default App
