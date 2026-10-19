import { MotionConfig, useReducedMotion } from 'motion/react';
import { ReactLenis } from 'lenis/react';
import { Loader, MeowEasterEgg, PawTrail, ScrollCat } from './components/Effects';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Marquee } from './components/Marquee';
import { MeetBlaze } from './components/MeetBlaze';
import { Gallery } from './components/Gallery';
import { DayInLife } from './components/DayInLife';
import { Purrsonality } from './components/Purrsonality';
import { PetBlaze } from './components/PetBlaze';
import { Footer } from './components/Footer';

export default function App() {
  const reduce = useReducedMotion();
  return (
    <MotionConfig reducedMotion="user">
      {!reduce && <ReactLenis root options={{ lerp: 0.1, wheelMultiplier: 1 }} />}
      <div className="paw-cursor">
        <Loader />
        <PawTrail />
        <ScrollCat />
        <Nav />
        <main>
          <Hero />
          <Marquee />
          <MeetBlaze />
          <Gallery />
          <DayInLife />
          <Purrsonality />
          <PetBlaze />
        </main>
        <Footer />
        <MeowEasterEgg />
      </div>
    </MotionConfig>
  );
}
