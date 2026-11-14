import { useState } from 'react'
import './MissionImage.css'

function MissionImage({ image }) {
  const [failedSource, setFailedSource] = useState(null)

  if (!image) return null

  const unavailable = !image.src || image.localAvailable === false || failedSource === image.src

  return (
    <figure className="mission-image">
      <div className="mission-image-frame">
        {unavailable ? (
          <div className="mission-image-unavailable" role="img" aria-label={`${image.title} is unavailable locally`}>
            <span>Local image unavailable</span>
            <span>{image.title}</span>
          </div>
        ) : (
          <img
            src={image.src}
            alt={image.title}
            loading="lazy"
            onError={() => setFailedSource(image.src)}
          />
        )}
        <span className="mission-image-type">{image.type}</span>
      </div>
      <figcaption className="mission-image-caption">
        <div className="mission-image-meta">
          <span>{image.mission} / {image.nasaId}</span>
          {image.source && (
            <a href={image.source} target="_blank" rel="noreferrer">
              NASA catalogue
            </a>
          )}
        </div>
        <p className="mission-image-title">{image.title}</p>
        <p className="mission-image-credit">Image credit: {image.credit}</p>
      </figcaption>
    </figure>
  )
}

export default MissionImage