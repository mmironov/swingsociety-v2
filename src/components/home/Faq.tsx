import type { HomePage } from '../../payload-types'
import type { Locale } from '../../lib/i18n'
import { CmsLink } from '../site/CmsLink'
import { SectionHead } from '../site/SectionHead'

export const Faq = ({ locale, faq }: { locale: Locale; faq: HomePage['faq'] }) => {
  if (faq?.enabled === false) return null
  const items = faq?.items ?? []
  if (items.length === 0) return null

  return (
    <section className="section section--tight-top" id="faq">
      <div className="wrap" data-reveal>
        <SectionHead kicker={faq?.kicker} heading={faq?.heading} />

        <div className="faq__grid">
          {items.map((item) => (
            <div key={item.id ?? item.question} className="faq__item">
              <h3 className="faq__q">{item.question}</h3>
              <p className="faq__a">{item.answer}</p>
              <CmsLink link={item.link ?? null} locale={locale}>
                {item.link?.label ? `${item.link.label} →` : null}
              </CmsLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
