import React from 'react';
import Hero             from '@/components/home/Hero/Hero';
import MissionVision    from '@/components/home/MissionVision/MissionVision';
import HomePrograms     from '@/components/home/HomePrograms/HomePrograms';
import FeaturedNews     from '@/components/home/FeaturedNews/FeaturedNews';
import UpcomingFixtures from '@/components/home/UpcomingFixtures/UpcomingFixtures';
import HomeGallery      from '@/components/home/HomeGallery/HomeGallery';
import HomePartners     from '@/components/home/HomePartners/HomePartners';
import HomeCallToAction from '@/components/home/HomeCallToAction/HomeCallToAction';
import { useAppContext } from '@/context/AppContext';

const Home: React.FC = () => {
  const { news, fixtures, programs, gallery, partners, loading } = useAppContext();

  return (
    <main>
      <Hero />
      <MissionVision />
      <HomePrograms  programs={programs} loading={loading.programs} />
      <FeaturedNews  news={news}         loading={loading.news}     />
      <UpcomingFixtures fixtures={fixtures} loading={loading.fixtures} />
      <HomeGallery   gallery={gallery}   loading={loading.gallery}  />
      <HomePartners  partners={partners} loading={loading.partners} />
      <HomeCallToAction />
    </main>
  );
};

export default Home;
