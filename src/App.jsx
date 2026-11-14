import DeepSpaceScene from './components/scenes/DeepSpaceScene.jsx'
import MoonChapter from './components/scenes/MoonChapter.jsx'
import MarsChapter from './components/scenes/MarsChapter.jsx'
import LegacyChapter from './components/scenes/LegacyChapter.jsx'
import PlanetaryJourney from './components/PlanetaryJourney.jsx'
import './App.css'

function App() {
  return (
    <main className="story-shell">
      <DeepSpaceScene />
      <MoonChapter />
      <MarsChapter />
      <LegacyChapter />
      <PlanetaryJourney />
    </main>
  )
}

export default App
