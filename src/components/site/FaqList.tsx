import type { FaqPage } from '../../payload-types'
import type { Locale } from '../../lib/i18n'
import { CmsLink } from './CmsLink'
import { SectionHead } from './SectionHead'

/** The body of the questions page. */
export const FaqList = ({
  locale,
  page,
}: {
  locale: Locale
  page: Pick<FaqPage, 'kicker' | 'title' | 'lead' | 'items'>
}) => {
  const items = page.items ?? []

  return (
    <section className="section section--tight-top">
      <div className="wrap" data-reveal>
        <SectionHead as="h1" kicker={page.kicker} heading={page.title} intro={page.lead} />

        {items.length > 0 ? (
          <div className="faq__grid">
            {items.map((item) => (
              <div key={item.id ?? item.question} className="faq__item">
                <h2 className="faq__q">{item.question}</h2>
                <p className="faq__a">{item.answer}</p>
                <CmsLink link={item.link ?? null} locale={locale}>
                  {item.link?.label ? `${item.link.label} →` : null}
                </CmsLink>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
