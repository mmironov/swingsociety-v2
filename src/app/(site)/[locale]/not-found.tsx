import Link from 'next/link'
import { DEFAULT_LOCALE, t } from '../../../lib/i18n'

/**
 * Rendered for any unknown path under a locale. It can't read the route params
 * (Next renders not-found outside the params scope), so it speaks the default
 * locale and links home in that language.
 */
const NotFound = () => (
  <div className="shell">
    <div className="notfound">
      <div className="kicker">404</div>
      <h1>{t('notFoundTitle', DEFAULT_LOCALE)}</h1>
      <p>{t('notFoundBody', DEFAULT_LOCALE)}</p>
      <Link className="btn btn-primary" href={`/${DEFAULT_LOCALE}`} style={{ padding: '14px 28px', fontSize: 16 }}>
        {t('home', DEFAULT_LOCALE)}
      </Link>
    </div>
  </div>
)

export default NotFound
