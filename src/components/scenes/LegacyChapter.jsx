import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { apolloEarthrise } from '../../data/media.js'
import { missionGroups } from '../../data/missions.js'
import './LegacyChapter.css'
import './LegacyChapter.css'

gsap.registerPlugin(ScrollTrigger)

const lunarModuleRecord = missionGroups.Moon.find(
  (mission) => mission.id === 'apollo-lunar-module-descent-stages',
)
const alsepRecord = missionGroups.Moon.find(
  (mission) => mission.id === 'apollo-lunar-surface-experiments-package',
)
const pathfinderRecord = missionGroups.Mars.find(
  (mission) => mission.id === 'sojourner-mars-pathfinder',
)
const roverRecord = missionGroups.Mars.find((mission) => mission.id === 'spirit-opportunity')
const insightRecord = missionGroups.Mars.find((mission) => mission.id === 'insight')

function parseDate(date) {
  return new Date(`${date}T00:00:00Z`)
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parseDate(date))
}

function createTimeline() {
  const lunarLandings = lunarModuleRecord.associatedMissions
    .map(({ landingDate }) => landingDate)
    .sort()
  const firstAlsepDeployment = alsepRecord.associatedMissions
    .map(({ deploymentDate }) => deploymentDate)
    .filter(Boolean)
    .sort()[0]
  const spiritLanding = roverRecord.associatedMissions.find(({ name }) => name.startsWith('Spirit'))
  const opportunityLanding = roverRecord.associatedMissions.find(({ name }) => name.startsWith('Opportunity'))
  const pathfinderMission = pathfinderRecord.associatedMissions[0]
  const insightMission = insightRecord.associatedMissions[0]

  return [
    {
      date: lunarLandings[0],
      dateLabel: `${formatDate(lunarLandings[0])} – ${formatDate(lunarLandings.at(-1))}`,
      title: 'Apollo lunar exploration',
      detail: 'Apollo 11 through Apollo 17 landing dates mark the crewed lunar surface record. The Lunar Module descent stages remained as the ascent-stage launch platforms.',
      source: lunarModuleRecord.sources[0],
      marker: 'MOON',
    },
    {
      date: firstAlsepDeployment,
      dateLabel: formatDate(firstAlsepDeployment),
      title: 'Apollo surface experiments',
      detail: `Apollo 12 deployed the first of the five mission ALSEP stations. ${alsepRecord.scientificContributions[0]}`,
      source: alsepRecord.sources[0],
      marker: 'MOON / ALSEP',
    },
    {
      date: pathfinderMission.landingDate,
      dateLabel: `${formatDate(pathfinderMission.landingDate)} / rover deployed ${formatDate(pathfinderMission.deploymentDate)}`,
      title: 'Mars Pathfinder and Sojourner',
      detail: `${pathfinderRecord.purpose} ${pathfinderRecord.scientificContributions[2]}`,
      source: pathfinderRecord.sources[0],
      marker: 'MARS',
    },
    {
      date: spiritLanding.landingDate,
      dateLabel: `${formatDate(spiritLanding.landingDate)} / ${formatDate(opportunityLanding.landingDate)}`,
      title: 'Spirit and Opportunity',
      detail: `${spiritLanding.name} landed at Gusev Crater; ${opportunityLanding.name} landed at Meridiani Planum. ${roverRecord.scientificContributions[0]}`,
      source: roverRecord.sources[0],
      marker: 'MARS / MER',
    },
    {
      date: insightMission.landingDate,
      dateLabel: formatDate(insightMission.landingDate),
      title: 'InSight',
      detail: `${insightRecord.purpose} ${insightRecord.scientificContributions[0]}`,
      source: insightRecord.sources[1],
      marker: 'MARS',
    },
  ].sort((first, second) => first.date.localeCompare(second.date))
}

const timeline = createTimeline()

const legacyThemes = [
  {
    number: '01',
    title: 'Reading the Moon',
    text: 'ALSEP stations recorded moonquakes, impacts, heat flow, magnetic fields, and the solar-wind environment. Those long-running measurements helped constrain the Moon’s interior and surface environment.',
    source: alsepRecord.sources[2],
  },
  {
    number: '02',
    title: 'A watery Mars',
    text: 'Pathfinder observations and the Spirit and Opportunity geological record supported evidence that liquid water once shaped parts of Mars. The paired rovers examined two different regions.',
    source: roverRecord.sources[2],
  },
  {
    number: '03',
    title: 'Robots as field scientists',
    text: 'Sojourner demonstrated rover deployment on Mars; Spirit and Opportunity extended mobile surface geology. InSight added a stationary geophysical station that measured marsquakes and impacts.',
    source: pathfinderRecord.sources[1],
  },
  {
    number: '04',
    title: 'Knowledge carried forward',
    text: 'Pathfinder’s airbag landing and rover deployment techniques became engineering heritage for later Mars exploration. The measurements from the Moon and Mars also remain part of the evidence used to understand rocky worlds.',
    source: pathfinderRecord.sources[1],
  },
]

function LegacyChapter() {
  const chapterRef = useRef(null)

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const motion = gsap.matchMedia()

      motion.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray('.legacy-reveal', chapterRef.current).forEach((element) => {
          gsap.fromTo(
            element,
            { y: 22, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.75,
              ease: 'power2.out',
              immediateRender: false,
              scrollTrigger: {
                trigger: element,
                start: 'top 82%',
                toggleActions: 'play none none reverse',
              },
            },
          )
        })
      })

      return () => motion.revert()
    }, chapterRef)

    return () => context.revert()
  }, [])

  return (
    <section className="legacy-chapter" ref={chapterRef} aria-labelledby="legacy-title">
      <header
        className="legacy-transition"
        id="legacy"
        style={roverRecord.image?.src && roverRecord.image.localAvailable
          ? { '--legacy-transition-image': `url("${roverRecord.image.src}")` }
          : undefined}
      >
        <div className="legacy-transition-copy legacy-reveal">
          <p className="legacy-eyebrow">CHAPTER 04 / THE RECORD CONTINUES</p>
          <h2 id="legacy-title">The <em>Legacy</em></h2>
          <p>
            The rovers fell silent. The landers stopped transmitting. What remains is more
            than hardware: a record of worlds measured at the surface.
          </p>
          <a className="legacy-transition-link" href="#legacy-timeline">
            FOLLOW THE RECORD <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div className="legacy-transition-credit">
          <span>{roverRecord.image.title}</span>
          <span>{roverRecord.image.credit}</span>
          <a href={roverRecord.image.source} target="_blank" rel="noreferrer">
            NASA IMAGE CATALOGUE
          </a>
        </div>
      </header>

      <section className="legacy-timeline-section" id="legacy-timeline" aria-labelledby="timeline-title">
        <div className="legacy-section-heading legacy-reveal">
          <p className="legacy-eyebrow">A CHRONOLOGY OF ARRIVAL</p>
          <h3 id="timeline-title">A record written<br /><em>on other worlds.</em></h3>
        </div>

        <ol className="legacy-timeline">
          {timeline.map((event) => (
            <li className="legacy-timeline-entry legacy-reveal" key={`${event.title}-${event.date}`}>
              <span className="legacy-timeline-date">{event.dateLabel}</span>
              <span className="legacy-timeline-marker" aria-hidden="true" />
              <div className="legacy-timeline-copy">
                <span className="legacy-timeline-world">{event.marker}</span>
                <h4>{event.title}</h4>
                <p>{event.detail}</p>
                <a href={event.source.url} target="_blank" rel="noreferrer">
                  {event.source.label} <span aria-hidden="true">↗</span>
                </a>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="legacy-science-section" aria-labelledby="legacy-science-title">
        <div className="legacy-section-heading legacy-reveal">
          <p className="legacy-eyebrow">WHAT THE RECORD GAVE US</p>
          <h3 id="legacy-science-title">The science<br /><em>doesn’t stay behind.</em></h3>
        </div>
        <div className="legacy-themes">
          {legacyThemes.map((theme) => (
            <article className="legacy-theme legacy-reveal" key={theme.number}>
              <span className="legacy-theme-number">{theme.number}</span>
              <h4>{theme.title}</h4>
              <p>{theme.text}</p>
              <a href={theme.source.url} target="_blank" rel="noreferrer">
                {theme.source.label} <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <footer className="legacy-ending" aria-labelledby="legacy-quote">
        <img
          className="legacy-ending-image"
          src={apolloEarthrise.src}
          alt={apolloEarthrise.alt}
          loading="lazy"
        />
        <div className="legacy-ending-shade" aria-hidden="true" />
        <div className="legacy-ending-content legacy-reveal">
          <p className="legacy-eyebrow">THE MACHINES WE LEFT BEHIND</p>
          <h3 id="legacy-quote">Some machines<br />stop working.<br /><em>Their discoveries don't.</em></h3>
          <p className="legacy-ending-tagline">Beyond the Mission — The machines we left behind.</p>
        </div>
        <a
          className="legacy-ending-credit"
          href={apolloEarthrise.source}
          target="_blank"
          rel="noreferrer"
        >
          {apolloEarthrise.title} / {apolloEarthrise.credit} / NASA IMAGE CATALOGUE
        </a>
      </footer>
    </section>
  )
}

export default LegacyChapter