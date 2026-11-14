import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { earthGlobe } from '../data/media.js'
import './PlanetaryJourney.css'

gsap.registerPlugin(ScrollTrigger)

function PlanetaryJourney() {
  const journeyRef = useRef(null)

  useLayoutEffect(() => {
    const journey = journeyRef.current
    const context = gsap.context(() => {
      const moonChapter = document.querySelector('.moon-chapter')
      const marsChapter = document.querySelector('.mars-chapter')
      const legacyChapter = document.querySelector('.legacy-chapter')

      const setPhase = (phase) => {
        gsap.set(journey, { attr: { 'data-phase': phase } })
      }

      ScrollTrigger.create({
        trigger: moonChapter,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => setPhase('moon'),
        onEnterBack: () => setPhase('moon'),
        onLeave: () => setPhase('mars'),
        onLeaveBack: () => setPhase('deep-space'),
      })

      ScrollTrigger.create({
        trigger: marsChapter,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => setPhase('mars'),
        onEnterBack: () => setPhase('mars'),
        onLeave: () => setPhase('legacy'),
        onLeaveBack: () => setPhase('moon'),
      })

      ScrollTrigger.create({
        trigger: legacyChapter,
        start: 'top bottom',
        end: 'bottom top',
        onEnter: () => setPhase('legacy'),
        onEnterBack: () => setPhase('legacy'),
        onLeaveBack: () => setPhase('mars'),
      })
    }, journey)

    return () => context.revert()
  }, [])

  return (
    <div className="planetary-journey" ref={journeyRef} data-phase="deep-space" aria-hidden="true">
      <div className="journey-moon" />
      <div className="journey-mars" />
      <div className="journey-earth-indicator">
        <img src={earthGlobe.src} alt="" />
      </div>
    </div>
  )
}

export default PlanetaryJourney
