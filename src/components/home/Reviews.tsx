import type { HomePage, Review } from '../../payload-types'
import type { Locale } from '../../lib/i18n'
import { CmsLink } from '../site/CmsLink'
import { SectionHead } from '../site/SectionHead'

/** Empty slots shown until real Google reviews are pasted in. */
const PLACEHOLDER_COUNT = 3

export const Reviews = ({
  locale,
  reviews,
  items,
}: {
  locale: Locale
  reviews: HomePage['reviews']
  items: Review[]
}) => {
  if (reviews?.enabled === false) return null

  const hasReal = items.length > 0
  const slots = hasReal ? items : Array.from({ length: PLACEHOLDER_COUNT }, () => null)

  return (
    <section className="section" id="reviews">
      <div className="wrap" data-reveal>
        <SectionHead kicker={reviews?.kicker} heading={reviews?.heading} />

        <div className="grid grid--auto-280">
          {slots.map((review, i) => (
            <div
              key={review?.id ?? `placeholder-${i}`}
              className={review ? 'review' : 'review review--placeholder'}
            >
              <span className="review__mark" aria-hidden="true">
                &ldquo;
              </span>
              <p className="review__quote">
                {review?.quote ?? reviews?.placeholderNote ?? ''}
              </p>
              <div className="review__author">
                {review ? (
                  <>
                    —{' '}
                    {review.sourceUrl ? (
                      <a href={review.sourceUrl} target="_blank" rel="noopener noreferrer">
                        {review.author}
                      </a>
                    ) : (
                      review.author
                    )}
                    {review.source ? `, ${review.source}` : ''}
                  </>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <CmsLink link={reviews?.allLink ?? null} locale={locale} className="btn btn-secondary reviews__all" />
      </div>
    </section>
  )
}
