import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import { contact, formConfigured } from '../data/contact'

const EMPTY = { name: '', email: '', message: '' }
const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

const icons = {
  mail: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 8 8 6 8-6" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 10.5V16M8 7.8v.1M11.5 16v-3.2c0-1.4 1-2.3 2.2-2.3s1.8.9 1.8 2.2V16M11.5 10.5V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
}

const links = [
  { key: 'mail', label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
  { key: 'github', label: 'GitHub', value: 'github.com/anaydev29', href: contact.github, external: true },
  { key: 'linkedin', label: 'LinkedIn', value: 'Anay Shivhare', href: contact.linkedin, external: true },
]

export default function Contact() {
  const formRef = useRef(null)
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [notice, setNotice] = useState('')

  const onChange = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((er) => ({ ...er, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (values.name.trim().length < 2) errs.name = 'Please enter your name.'
    if (!emailOk(values.email.trim())) errs.email = 'Please enter a valid email address.'
    if (values.message.trim().length < 10) errs.message = 'Please write a few words (at least 10 characters).'
    return errs
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return

    const errs = validate()
    setErrors(errs)
    const firstBad = Object.keys(errs)[0]
    if (firstBad) {
      formRef.current.elements[firstBad]?.focus()
      return
    }

    // Hidden field that only bots fill in: pretend it worked and drop it
    if (formRef.current.elements._gotcha.value) {
      setStatus('success')
      return
    }

    // Form service not set up yet: open the visitor's email app instead
    if (!formConfigured) {
      const subject = encodeURIComponent(`Portfolio message from ${values.name.trim()}`)
      const body = encodeURIComponent(`${values.message.trim()}\n\n${values.name.trim()}\n${values.email.trim()}`)
      window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`
      setNotice('Your email app should open with the message ready to send.')
      return
    }

    setStatus('sending')
    setNotice('')
    try {
      const res = await fetch(contact.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
        }),
      })
      if (!res.ok) throw new Error('bad response')
      setValues(EMPTY)
      setStatus('success')
    } catch {
      setStatus('error')
      setNotice(`Sorry, that didn't send. Please try again, or email me directly at ${contact.email}.`)
    }
  }

  return (
    <PageTransition>
      <span className="eyebrow">Let's talk</span>
      <h1 className="page-title">Contact</h1>
      <p className="page-sub">
        Have a project in mind, or want to work together? Send a message and I'll get back to you
        soon. I'm open to freelance work and remote opportunities.
      </p>

      <div className="contact-layout">
        <motion.ul
          className="contact-links"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        >
          {links.map((l) => (
            <li key={l.key}>
              <a
                className="contact-link glass"
                href={l.href}
                {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                aria-label={l.external ? `${l.label}: ${l.value} (opens in a new tab)` : `${l.label}: ${l.value}`}
              >
                <span className="contact-icon">{icons[l.key]}</span>
                <span className="contact-text">
                  <small>{l.label}</small>
                  <strong>{l.value}</strong>
                </span>
              </a>
            </li>
          ))}
        </motion.ul>

        <motion.div
          className="contact-form-wrap glass"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
        >
          {status === 'success' ? (
            <div className="form-success" role="status">
              <span className="success-mark" aria-hidden="true">
                ✓
              </span>
              <h2>Message sent</h2>
              <p>Thanks for reaching out. I'll reply to your email soon.</p>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setStatus('idle')
                  setNotice('')
                }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={onSubmit} noValidate>
              <div className="field">
                <label htmlFor="name">Your name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={values.name}
                  onChange={onChange}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <p className="field-error" id="name-error">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="field">
                <label htmlFor="email">Your email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={onChange}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p className="field-error" id="email-error">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={values.message}
                  onChange={onChange}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                />
                {errors.message && (
                  <p className="field-error" id="message-error">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Honeypot: hidden from people, bots tend to fill it in */}
              <div className="hp" aria-hidden="true">
                <label htmlFor="_gotcha">Leave this empty</label>
                <input id="_gotcha" name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <button type="submit" className="btn btn-primary form-submit" data-magnetic disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </button>

              <p className={`form-notice ${status === 'error' ? 'is-error' : ''}`} role="status" aria-live="polite">
                {notice}
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </PageTransition>
  )
}
