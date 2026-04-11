import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { api } from '@/services/api';
import {
  Player, NewsItem, NewsCategory, Fixture, Program, ProgramTitle,
  Partner, PartnerTier, GalleryItem, GalleryCategory, ClubStat,
  MissionVisionItem, Milestone, Management, SocialInfo,
} from '@/data/dummyData';

export interface NewsView { id: number; newsId: number; views: number; }

interface AdminData {
  players: Player[]; news: NewsItem[]; newsCategories: NewsCategory[];
  fixtures: Fixture[]; programs: Program[]; programTitles: ProgramTitle[];
  partners: Partner[]; partnerTiers: PartnerTier[];
  gallery: GalleryItem[]; galleryCategories: GalleryCategory[];
  stats: ClubStat[]; missionVision: MissionVisionItem[];
  milestones: Milestone[]; management: Management[]; socials: SocialInfo;
  newsViews: NewsView[];
  teamname: string;
  logo: { image: string; blur_image: string } | null;
  loading: boolean;
}

interface AdminDataContextType extends AdminData {
  refresh: () => void;
  setPlayers: (v: Player[]) => void;
  setNews: (v: NewsItem[]) => void;
  setNewsCategories: (v: NewsCategory[]) => void;
  setFixtures: (v: Fixture[]) => void;
  setPrograms: (v: Program[]) => void;
  setPartners: (v: Partner[]) => void;
  setProgramTitles: (v: ProgramTitle[]) => void;
  setPartnerTiers: (v: PartnerTier[]) => void;
  setGallery: (v: GalleryItem[]) => void;
  setGalleryCategories: (v: GalleryCategory[]) => void;
  setStats: (v: ClubStat[]) => void;
  setMissionVision: (v: MissionVisionItem[]) => void;
  setMilestones: (v: Milestone[]) => void;
  setManagement: (v: Management[]) => void;
  setSocials: (v: SocialInfo) => void;
  setNewsViews: (v: NewsView[]) => void;
  setTeamname: (v: string) => void;
  setLogo: (v: { image: string; blur_image: string } | null) => void;
}

const AdminDataContext = createContext<AdminDataContextType>({} as AdminDataContextType);

export const AdminDataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<AdminData>({
    players: [], news: [], newsCategories: [],
    fixtures: [], programs: [], programTitles: [],
    partners: [], partnerTiers: [],
    gallery: [], galleryCategories: [],
    stats: [], missionVision: [],
    milestones: [], management: [], socials: { social_links: [] } as any,
    newsViews: [], teamname: 'Uncle T FC', logo: null, loading: true,
  });

  const fetchAll = useCallback(async () => {
    setData(p => ({ ...p, loading: true }));
    const [
      players, news, newsCategories, fixtures, programs, programTitles,
      partners, partnerTiers, gallery, galleryCategories,
      stats, missionVision, milestones, management, socials, newsViews, teamnameRes, logoRes,
    ] = await Promise.all([
      api.get.players(), api.get.news(), api.get.newsCategories(),
      api.get.fixtures(), api.get.programs(), api.get.programTitles(),
      api.get.partners(), api.get.partnerTiers(),
      api.get.gallery(), api.get.galleryCategories(),
      api.get.stats(), api.get.missionVision(), api.get.milestones(),
      api.get.management(), api.get.socials(), api.get.newsViews(), api.get.teamname(), api.get.logo(),
    ]);
    setData({
      players, news, newsCategories, fixtures, programs, programTitles,
      partners, partnerTiers, gallery, galleryCategories,
      stats, missionVision, milestones, management, socials,
      newsViews: newsViews as NewsView[],
      teamname: (teamnameRes as any)?.name || 'Uncle T FC',
      logo: logoRes ? { image: (logoRes as any).image || '', blur_image: (logoRes as any).blur_image || '' } : null,
      loading: false,
    });
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const make = <K extends keyof AdminData>(key: K) =>
    (v: AdminData[K]) => setData(p => ({ ...p, [key]: v }));

  return (
    <AdminDataContext.Provider value={{
      ...data, refresh: fetchAll,
      setPlayers: make('players'), setNews: make('news'),
      setNewsCategories: make('newsCategories'), setFixtures: make('fixtures'),
      setPrograms: make('programs'), setPartners: make('partners'),
      setProgramTitles: make('programTitles'),
      setPartnerTiers: make('partnerTiers'), setGallery: make('gallery'),
      setGalleryCategories: make('galleryCategories'), setStats: make('stats'),
      setMissionVision: make('missionVision'), setMilestones: make('milestones'),
      setManagement: make('management'), setSocials: make('socials'),
      setNewsViews: make('newsViews'),
      setTeamname: (v: string) => setData(p => ({ ...p, teamname: v })),
      setLogo: (v) => setData(p => ({ ...p, logo: v })),
    }}>
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => useContext(AdminDataContext);
