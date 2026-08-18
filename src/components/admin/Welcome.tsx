import React from 'react'

/**
 * Rendered above the admin dashboard's collection list. Two links, because the
 * school edits the home page and the schedule far more often than anything else.
 */
export const Welcome: React.FC = () => (
  <div
    style={{
      marginBottom: '2rem',
      padding: '1.25rem 1.5rem',
      borderRadius: '8px',
      background: 'var(--theme-elevation-50)',
      border: '1px solid var(--theme-elevation-100)',
    }}
  >
    <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem' }}>Здравей 👋</h2>
    <p style={{ margin: '0 0 0.75rem', lineHeight: 1.6, color: 'var(--theme-elevation-700)' }}>
      Всичко на сайта се променя оттук. Най-често ще ти трябват{' '}
      <a href="/admin/globals/home-page">Начална страница</a> (текстовете по секции) и{' '}
      <a href="/admin/collections/courses">Курсове и групи</a> (дати, часове, цени — те се показват
      и в графика).
    </p>
    <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--theme-elevation-700)' }}>
      Горе вдясно на всяка страница има превключвател <strong>Български / English</strong>. Празно
      английско поле показва българския текст, така че може да превеждаш постепенно.
    </p>
  </div>
)
