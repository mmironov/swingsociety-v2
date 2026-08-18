import type { HomePage, Teacher } from '../../payload-types'
import type { Locale } from '../../lib/i18n'
import { focalPosition, mediaAlt, mediaUrl } from '../../lib/media'
import { SectionHead } from '../site/SectionHead'

/** First letter of the name, for a teacher whose photo isn't in yet. */
const initial = (name: string) => Array.from(name.trim())[0]?.toUpperCase() ?? '·'

export const Team = ({
  team,
  members,
}: {
  locale: Locale
  team: HomePage['team']
  members: Teacher[]
}) => {
  if (team?.enabled === false || members.length === 0) return null

  return (
    <section className="section team" id="team">
      <div className="wrap" data-reveal>
        <SectionHead
          kicker={team?.kicker}
          heading={team?.heading}
          intro={team?.intro}
          goldKicker
          introClass="team__intro"
        />

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
      </div>
    </section>
  )
}
