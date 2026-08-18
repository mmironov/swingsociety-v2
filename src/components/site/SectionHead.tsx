import React from 'react'
import { toLines } from '../../lib/format'

/** The kicker + heading + intro trio every home-page section opens with. */
export const SectionHead = ({
  kicker,
  heading,
  intro,
  goldKicker = false,
  headingClass = 'section__heading',
  introClass = 'section__intro',
  children,
}: {
  kicker?: string | null
  heading?: string | null
  intro?: string | null
  goldKicker?: boolean
  headingClass?: string
  introClass?: string
  /** Appended inside the intro paragraph — used for the trailing "see all" link. */
  children?: React.ReactNode
}) => (
  <>
    {kicker ? <div className={goldKicker ? 'kicker kicker--gold' : 'kicker'}>{kicker}</div> : null}
    {heading ? (
      <h2 className={headingClass}>
        {toLines(heading).map((line, i) => (
          <React.Fragment key={i}>
            {i > 0 ? <br /> : null}
            {line}
          </React.Fragment>
        ))}
      </h2>
    ) : null}
    {intro || children ? (
      <p className={introClass}>
        {intro}
        {children ? <> {children}</> : null}
      </p>
    ) : null}
  </>
)
