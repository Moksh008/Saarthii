import { AboutHero } from '../components/about/AboutHero';
import { VisionMission } from '../components/about/VisionMission';
import { AboutApproach } from '../components/about/AboutApproach';
import { AboutTeam } from '../components/about/AboutTeam';
import { AboutRoadmap } from '../components/about/AboutRoadmap';

export function AboutUs() {
  return (
    <div className="bg-white">
      <AboutHero />
      <VisionMission />
      <AboutApproach />
      <AboutTeam />
      <AboutRoadmap />
    </div>
  );
}
