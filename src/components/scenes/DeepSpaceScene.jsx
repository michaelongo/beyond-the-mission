import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { apolloEarthrise, earthGlobe } from '../../data/media.js'

gsap.registerPlugin(ScrollTrigger)

function DeepSpaceScene() {
  const sceneRef = useRef(null)
  const frameRef = useRef(null)
  const imageRef = useRef(null)
  const openingRef = useRef(null)
  const continuationRef = useRef(null)
  const scrollCueRef = useRef(null)

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const motion = gsap.matchMedia()

      motion.add('(prefers-reduced-motion: no-preference)', () => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: sceneRef.current,
            start: 'top top',
            end: '+=115%',
            scrub: 0.8,
            pin: frameRef.current,
            anticipatePin: 1,
          },
        })

        timeline
          .to(imageRef.current, { scale: 1.14, xPercent: -2, ease: 'none' }, 0)
          .to(openingRef.current, { y: -34, autoAlpha: 0, ease: 'power1.in' }, 0.08)
          .to(scrollCueRef.current, { autoAlpha: 0, ease: 'none' }, 0)
          .fromTo(
            continuationRef.current,
            { y: 30, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, ease: 'power2.out' },
            0.42,
          )

        return () => timeline.scrollTrigger?.kill()
      })

      motion.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(continuationRef.current, { autoAlpha: 1 })
      })

      return () => motion.revert()
    }, sceneRef)

    return () => context.revert()
  }, [])

  return (
    <section id="top" className="deep-space-scene" ref={sceneRef} aria-labelledby="scene-title">
      <div className="deep-space-frame" ref={frameRef}>
        <img
          className="deep-space-image"
          ref={imageRef}
          src={apolloEarthrise.src}
          alt={apolloEarthrise.alt}
          fetchPriority="high"
        />
        <div className="earth-globe" aria-hidden="true">
          <img src={earthGlobe.src} alt="" />
        </div>
        <div className="scene-shade" aria-hidden="true" />
        <div className="scene-stars" aria-hidden="true" />
        <div className="scene-grain" aria-hidden="true" />

        <header className="scene-header">
          <a className="wordmark" href="#top" aria-label="Beyond the Mission, home">
            <span className="wordmark-mark" aria-hidden="true">B</span>
            <span>BEYOND THE MISSION</span>
          </a>
          <span className="event-label">NASA SPACE APPS CHALLENGE <span>2026</span></span>
        </header>

        <div className="scene-index">
          <span className="index-rule" />
          <span>FIELD NOTE 01</span>
          <span className="index-divider">/</span>
          <span>DEEP SPACE</span>
        </div>

        <div className="scene-copy scene-copy-opening" ref={openingRef}>
          <p className="scene-kicker">A record of what we leave behind</p>
          <h1 id="scene-title">Beyond<br />the <em>Mission</em></h1>
          <p className="scene-intro">
            The signal fades. The hardware stays.
          </p>
        </div>

        <div className="scene-copy scene-copy-continuation" ref={continuationRef}>
          <p className="scene-kicker">The story does not end at touchdown</p>
          <p className="continuation-line">
            Across the quiet, human-made traces remain.
          </p>
          <span className="continuation-note">A journey through the artifacts of exploration.</span>
        </div>

        <div className="scene-footer">
          <a
            className="image-credit"
            href={apolloEarthrise.source}
            target="_blank"
            rel="noreferrer"
          >
            <span>{apolloEarthrise.credit}</span>
            <span className="credit-title">{apolloEarthrise.title}</span>
          </a>
          <div className="scroll-cue" ref={scrollCueRef} aria-hidden="true">
            <span>SCROLL TO ENTER</span>
            <span className="scroll-line" />
          </div>
          <div className="scene-archive">
            <span className="scene-coordinate">ARCHIVE 1968&nbsp;&nbsp; / &nbsp;&nbsp;APOLLO 8</span>
            <a className="earth-texture-credit" href={earthGlobe.source} target="_blank" rel="noreferrer">
              EARTH GLOBE / NASA / PIA18033
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DeepSpaceScene