import type { HomePage, SiteSetting } from '../../payload-types'
import type { Locale } from '../../lib/i18n'
import { MailIcon, PhoneIcon, SOCIAL_ICONS, GlobeIcon } from '../site/Icons'
import { SectionHead } from '../site/SectionHead'

export const Contact = ({
  contact,
  settings,
}: {
  locale: Locale
  contact: HomePage['contact']
  settings: SiteSetting
}) => {
  if (contact?.enabled === false) return null

  const socials = settings.socials ?? []

  return (
    <section className="section section--tight-top" id="contact">
      <div className="wrap" data-reveal>
        <SectionHead kicker={contact?.kicker} heading={contact?.heading} intro={contact?.intro} />

        <div className="grid grid--auto-280">
          {settings.phone ? (
            <a className="contact__card" href={`tel:${settings.phone.replace(/\s/g, '')}`}>
              <PhoneIcon />
              <span className="contact__value">{settings.phone}</span>
            </a>
          ) : null}

          {settings.email ? (
            <a className="contact__card" href={`mailto:${settings.email}`}>
              <MailIcon />
              <span className="contact__value contact__value--email">{settings.email}</span>
            </a>
          ) : null}

          {socials.length ? (
            <div className="contact__socials">
              {socials.map((social) => {
                const Icon = SOCIAL_ICONS[social.platform] ?? GlobeIcon
                return (
                  <a
                    key={social.id ?? social.url}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon />
                    {social.label}
                  </a>
                )
              })}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
