// context/AdminDataContext.tsx — fetches ALL data in one Promise.all
import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { api } from '@/services/api';
import {
  Player, NewsItem, NewsCategory, Fixture, Program, ProgramTitle,
  Partner, PartnerTier, GalleryItem, GalleryCategory, ClubStat,
  MissionVisionItem, Milestone, Management, SocialInfo,
  dummyPlayers, dummyNews, dummyNewsCategories, dummyFixtures,
  dummyPrograms, dummyProgramTitles, dummyPartners, dummyPartnerTiers,
  dummyGallery, dummyGalleryCategories, dummyClubStats, dummyMissionVision,
  dummyMilestones, dummyManagement, dummySocials,
} from '@/data/dummyData';

interface AdminData {
  players: Player[]; news: NewsItem[]; newsCategories: NewsCategory[];
  fixtures: Fixture[]; programs: Program[]; programTitles: ProgramTitle[];
  partners: Partner[]; partnerTiers: PartnerTier[];
  gallery: GalleryItem[]; galleryCategories: GalleryCategory[];
  stats: ClubStat[]; missionVision: MissionVisionItem[];
  milestones: Milestone[]; management: Management[]; socials: SocialInfo;
  loading: boolean;
}

interface AdminDataContextType extends AdminData {
  refresh: () => void;
  // local optimistic updaters
  setPlayers: (v: Player[]) => void;
  setNews: (v: NewsItem[]) => void;
  setNewsCategories: (v: NewsCategory[]) => void;
  setFixtures: (v: Fixture[]) => void;
  setPrograms: (v: Program[]) => void;
  setPartners: (v: Partner[]) => void;
  setPartnerTiers: (v: PartnerTier[]) => void;
  setGallery: (v: GalleryItem[]) => void;
  setGalleryCategories: (v: GalleryCategory[]) => void;
  setStats: (v: ClubStat[]) => void;
  setMissionVision: (v: MissionVisionItem[]) => void;
  setMilestones: (v: Milestone[]) => void;
  setManagement: (v: Management[]) => void;
  setSocials: (v: SocialInfo) => void;
}

const AdminDataContext = createContext<AdminDataContextType>({} as AdminDataContextType);

export const AdminDataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<AdminData>({
    players: dummyPlayers, news: dummyNews, newsCategories: dummyNewsCategories,
    fixtures: dummyFixtures, programs: dummyPrograms, programTitles: dummyProgramTitles,
    partners: dummyPartners, partnerTiers: dummyPartnerTiers,
    gallery: dummyGallery, galleryCategories: dummyGalleryCategories,
    stats: dummyClubStats, missionVision: dummyMissionVision,
    milestones: dummyMilestones, management: dummyManagement, socials: dummySocials,
    loading: true,
  });

  const fetchAll = useCallback(async () => {
    setData(p => ({ ...p, loading: true }));
    const [
      players, news, newsCategories, fixtures, programs, programTitles,
      partners, partnerTiers, gallery, galleryCategories,
      stats, missionVision, milestones, management, socials,
    ] = await Promise.all([
      api.get.players(), api.get.news(), api.get.newsCategories(),
      api.get.fixtures(), api.get.programs(), api.get.programTitles(),
      api.get.partners(), api.get.partnerTiers(),
      api.get.gallery(), api.get.galleryCategories(),
      api.get.stats(), api.get.missionVision(), api.get.milestones(),
      api.get.management(), api.get.socials(),
    ]);
    setData({
      players, news, newsCategories, fixtures, programs, programTitles,
      partners, partnerTiers, gallery, galleryCategories,
      stats, missionVision, milestones, management, socials, loading: false,
    });
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const make = <K extends keyof AdminData>(key: K) =>
    (v: AdminData[K]) => setData(p => ({ ...p, [key]: v }));

  return (
    <AdminDataContext.Provider value={{
      ...data,
      refresh: fetchAll,
      setPlayers: make('players'),
      setNews: make('news'),
      setNewsCategories: make('newsCategories'),
      setFixtures: make('fixtures'),
      setPrograms: make('programs'),
      setPartners: make('partners'),
      setPartnerTiers: make('partnerTiers'),
      setGallery: make('gallery'),
      setGalleryCategories: make('galleryCategories'),
      setStats: make('stats'),
      setMissionVision: make('missionVision'),
      setMilestones: make('milestones'),
      setManagement: make('management'),
      setSocials: make('socials'),
    }}>
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => useContext(AdminDataContext);
