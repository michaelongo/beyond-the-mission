import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MissionImage from '../MissionImage.jsx'
import { missionGroups } from '../../data/missions.js'
import './MoonChapter.css'

gsap.registerPlugin(ScrollTrigger)

const storyOrder = [
  'apollo-lunar-module-descent-stages',
  'apollo-lunar-surface-experiments-package',
  'lunar-roving-vehicles',
]

const stories = storyOrder
  .map((id) => missionGroups.Moon.find((mission) => mission.id === id))
  .filter(Boolean)

const storyNavigation = [
  { id: 'apollo-lunar-module-descent-stages', label: 'Descent stage' },
  { id: 'apollo-lunar-surface-experiments-package', label: 'ALSEP' },
  { id: 'lunar-roving-vehicles', label: 'Lunar rover' },
]

function MoonStory({ mission, index }) {
  return (
    <article
      className={`moon-story${index % 2 === 1 ? ' moon-story--reverse' : ''}`}
      id={`moon-story-${mission.id}`}
      aria-labelledby={`moon-story-title-${mission.id}`}
    >
      <div className="moon-story-copy">
        <p className="moon-story-kicker">SURFACE RECORD / 0{index + 1}</p>
        <h3 id={`moon-story-title-${mission.id}`}>{mission.equipmentName}</h3>
        <p className="moon-story-importance">{mission.historicalImportance}</p>

        <div className="moon-story-detail">
          <span className="moon-story-label">Purpose</span>
          <p>{mission.purpose}</p>
        </div>

        <div className="moon-story-detail">
          <span className="moon-story-label">Built for the surface</span>
          <p>{mission.designedFunction}</p>
        </div>

        {mission.scientificContributions?.length > 0 && (
          <div className="moon-story-detail moon-story-field-notes">
            <span className="moon-story-label">Field notes</span>
            <ul>
              {mission.scientificContributions.map((contribution) => (
                <li key={contribution}>{contribution}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="moon-story-disposition">
          <span className="moon-story-label">Disposition</span>
          <p>{mission.missionEnd}</p>
        </div>

        <p className="moon-story-missions">
          <span className="moon-story-label">Associated missions</span>
          {mission.associatedMissions.map(({ name }) => name).join(' / ')}
        </p>
      </div>

      <div className="moon-story-image">
        <MissionImage image={mission.image} />
      </div>
    </article>
  )
}

function MoonChapter() {
  const chapterRef = useRef(null)
  const roverStory = stories.find((mission) => mission.id === 'lunar-roving-vehicles')
  const heroImage = roverStory?.image

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const motion = gsap.matchMedia()

      motion.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.moon-chapter-hero-copy',
          { y: 22, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: 'power2.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: '.moon-chapter-opening',
              start: 'top 68%',
              toggleActions: 'play none none reverse',
            },
          },
        )

        gsap.utils.toArray('.moon-story').forEach((story) => {
          gsap.fromTo(
            story.querySelector('.moon-story-copy'),
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
    <section className="moon-chapter" ref={chapterRef} aria-labelledby="moon-chapter-title">
      <div
        className="moon-chapter-opening"
        id="moon"
        style={heroImage?.src && heroImage.localAvailable
          ? { '--moon-hero-image': `url("${heroImage.src}")` }
          : undefined}
      >
        <div className="moon-chapter-hero-copy">
          <p className="moon-chapter-index">CHAPTER 02 <span>/</span> FIELD RECORD</p>
          <h2 id="moon-chapter-title">The <em>Moon</em></h2>
          <p className="moon-chapter-intro">
            Landing hardware, long-running experiments, and the vehicles that carried crews
            across the lunar surface.
          </p>

          <nav className="moon-story-navigation" aria-label="Moon chapter stories">
            {storyNavigation.map(({ id, label }, index) => (
              <a key={id} href={`#moon-story-${id}`}>
                <span>0{index + 1}</span>
                {label}
              </a>
            ))}
          </nav>
        </div>
        <a className="moon-chapter-scroll" href="#moon-stories">
          ENTER THE LUNAR RECORD <span aria-hidden="true">↓</span>
        </a>
      </div>

      <div className="moon-stories" id="moon-stories">
        {stories.map((mission, index) => (
          <MoonStory key={mission.id} mission={mission} index={index} />
        ))}
      </div>

      <footer className="moon-chapter-footer">
        <span>END OF CHAPTER 02 / THE MOON</span>
        <a href="#top">RETURN TO THE OPENING ↑</a>
      </footer>
    </section>
  )
}

export default MoonChapter