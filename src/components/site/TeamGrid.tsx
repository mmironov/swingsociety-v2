import type { TeamPage, Teacher } from '../../payload-types'
import { focalPosition, mediaAlt, mediaUrl } from '../../lib/media'
import { SectionHead } from './SectionHead'

/** First letter of the name, for a teacher whose photo isn't in yet. */
const initial = (name: string) => Array.from(name.trim())[0]?.toUpperCase() ?? '·'

/**
 * The body of the team page. The people come from the Teachers collection, so
 * adding someone never means editing this page.
 */
export const TeamGrid = ({
  page,
  members,
}: {
  page: Pick<TeamPage, 'kicker' | 'title' | 'lead'>
  members: Teacher[]
}) => (
  <section className="section team">
    <div className="wrap" data-reveal>
      <SectionHead
        as="h1"
        kicker={page.kicker}
        heading={page.title}
        intro={page.lead}
        goldKicker
        introClass="team__intro"
      />

      {members.length > 0 ? (
        <div className="team__grid">
          {members.map((member) => {
            const photo = mediaUrl(member.photo, 600)
            return (
              <div key={member.id} className="teacher">
                <div className="teacher__tile">
                  {photo ? (
                    <img
                      src={photo}
                      alt={mediaAlt(member.photo, member.name)}
                      style={{ objectPosition: focalPosition(member.photo) }}
                    />
                  ) : (
                    <span className="teacher__initial" aria-hidden="true">
                      {initial(member.name)}
                    </span>
                  )}
                </div>
                <div>
                  <div className="teacher__name">{member.name}</div>
                  {member.disciplines ? (
                    <div className="teacher__role">{member.disciplines}</div>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  </section>
)
