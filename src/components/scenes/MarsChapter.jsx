import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MissionImage from '../MissionImage.jsx'
import { missionGroups } from '../../data/missions.js'
import './MarsChapter.css'

gsap.registerPlugin(ScrollTrigger)

const storyOrder = [
  'sojourner-mars-pathfinder',
  'spirit-opportunity',
  'insight',
]

const stories = storyOrder
  .map((id) => missionGroups.Mars.find((mission) => mission.id === id))
  .filter(Boolean)

const storyNavigation = [
  { id: 'sojourner-mars-pathfinder', label: 'Pathfinder' },
  { id: 'spirit-opportunity', label: 'Spirit + Opportunity' },
  { id: 'insight', label: 'InSight' },
]

const storyHeadings = {
  'sojourner-mars-pathfinder': 'Sojourner — Mars Pathfinder',
  'spirit-opportunity': 'Spirit and Opportunity — Mars Exploration Rovers',
  insight: 'InSight — Mars interior exploration',
}

function landingYears(mission) {
  return [...new Set(
    mission.associatedMissions
      .map(({ landingDate }) => landingDate?.slice(0, 4))
      .filter(Boolean),
  )].join(' / ')
}

function storyImageNote(mission) {
  return mission.verificationNotes?.find((note) => /image|photo|photograph|illustration/i.test(note))
}

function MarsStory({ mission, index }) {
  const imageNote = storyImageNote(mission)

  return (
    <article
      className={`mars-story${index % 2 === 1 ? ' mars-story--reverse' : ''}`}
      id={`mars-story-${mission.id}`}
      aria-labelledby={`mars-story-title-${mission.id}`}
    >
      <div className="mars-story-copy">
        <p className="mars-story-kicker">SURFACE RECORD / 0{index + 1} <span>{landingYears(mission)}</span></p>
        <h3 id={`mars-story-title-${mission.id}`}>{storyHeadings[mission.id] ?? mission.equipmentName}</h3>
        <p className="mars-story-importance">{mission.historicalImportance}</p>

        <div className="mars-story-detail">
          <span className="mars-story-label">Why it went</span>
          <p>{mission.purpose}</p>
        </div>

        <div className="mars-story-detail">
          <span className="mars-story-label">The instrument and vehicle</span>
          <p>{mission.designedFunction}</p>
        </div>

        {mission.scientificContributions?.length > 0 && (
          <div className="mars-story-detail mars-story-science">
            <span className="mars-story-label">Science enabled</span>
            <ul>
              {mission.scientificContributions.map((contribution) => (
                <li key={contribution}>{contribution}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mars-story-outcome">
          <div>
            <span className="mars-story-label">Mission outcome</span>
            <p>{mission.missionEnd}</p>
          </div>
          <div>
            <span className="mars-story-label">Operational status</span>
            <p>{mission.currentOperationalStatus}</p>
          </div>
        </div>

        <ul className="mars-story-sites" aria-label="Associated mission landing sites">
          {mission.associatedMissions.map(({ name, landingSite }) => (
            <li key={name}>
              <span>{name}</span>
              <span>{landingSite}</span>
            </li>
          ))}
        </ul>

        <div className="mars-story-sources">
          <span className="mars-story-label">NASA sources</span>
          <div>
            {mission.sources.map(({ url, label }) => (
              <a key={url} href={url} target="_blank" rel="noreferrer">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mars-story-image">
        <MissionImage image={mission.image} />
        {imageNote && <p className="mars-story-image-note">{imageNote}</p>}
      </div>
    </article>
  )
}

function MarsChapter() {
  const chapterRef = useRef(null)
  const roverStory = stories.find((mission) => mission.id === 'spirit-opportunity')
  const heroImage = roverStory?.image

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const motion = gsap.matchMedia()

      motion.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.mars-chapter-hero-copy',
          { y: 22, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: 'power2.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: '.mars-chapter-opening',
              start: 'top 68%',
              toggleActions: 'play none none reverse',
            },
          },
        )

        gsap.utils.toArray('.mars-story').forEach((story) => {
          gsap.fromTo(
            story.querySelector('.mars-story-copy'),
            { y: 24, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.75,
              ease: 'power2.out',
              immediateRender: false,
              scrollTrigger: {
                trigger: story,
                start: 'top 76%',
                toggleActions: 'play none none reverse',
              },
            },
          )

          const photograph = story.querySelector('.mission-image-frame img')
          if (photograph) {
            gsap.fromTo(
              photograph,
              { scale: 1.035 },
              {
                scale: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger: story,
                  start: 'top bottom',
                  end: 'center center',
                  scrub: 0.6,
                },
              },
            )
          }
        })
      })

      return () => motion.revert()
    }, chapterRef)

    return () => context.revert()
  }, [])

  return (
    <section className="mars-chapter" ref={chapterRef} aria-labelledby="mars-chapter-title">
      <div
        className="mars-chapter-opening"
        id="mars"
        style={heroImage?.src && heroImage.localAvailable
          ? { '--mars-hero-image': `url("${heroImage.src}")` }
          : undefined}
      >
        <div className="mars-chapter-hero-copy">
          <p className="mars-chapter-index">CHAPTER 03 <span>/</span> FIELD RECORD</p>
          <h2 id="mars-chapter-title">The <em>Mars</em> record</h2>
          <p className="mars-chapter-intro">
            From a first rover on Mars to mobile geologists and a lander built to listen
            beneath the surface.
          </p>

          <nav className="mars-story-navigation" aria-label="Mars chapter stories">
            {storyNavigation.map(({ id, label }, index) => (
              <a key={id} href={`#mars-story-${id}`}>
                <span>0{index + 1}</span>
                {label}
              </a>
            ))}
          </nav>
        </div>
        <a className="mars-chapter-scroll" href="#mars-stories">
          ENTER THE MARS RECORD <span aria-hidden="true">↓</span>
        </a>
      </div>

      <div className="mars-stories" id="mars-stories">
        {stories.map((mission, index) => (
          <MarsStory key={mission.id} mission={mission} index={index} />
        ))}
      </div>

      <footer className="mars-chapter-footer">
        <a href="#moon">← RETURN TO THE MOON</a>
        <span>END OF CHAPTER 03 / MARS</span>
      </footer>
    </section>
  )
}

export default MarsChapter