import { AboutHero } from '../components/AboutHero';
import { VisionMission } from '../components/VisionMission';
import { AboutApproach } from '../components/AboutApproach';
import { AboutTeam } from '../components/AboutTeam';
import { AboutRoadmap } from '../components/AboutRoadmap';

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
