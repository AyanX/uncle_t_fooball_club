import React, {
  createContext, useContext, useEffect, useState,
  useCallback, useRef, ReactNode,
} from 'react';
import { api } from '@/services/api';
import {
  Player, NewsItem, Fixture, Program, Partner, GalleryItem, ClubStat,
  MissionVisionItem, Milestone, Management, SocialInfo,
  NewsCategory, ProgramTitle, PartnerTier, GalleryCategory,
  dummyPlayers, dummyNews, dummyFixtures, dummyPrograms, dummyPartners,
  dummyGallery, dummyClubStats, dummyMissionVision, dummyMilestones,
  dummyManagement, dummySocials, dummyNewsCategories,
  dummyProgramTitles, dummyPartnerTiers, dummyGalleryCategories,
} from '@/data/dummyData';

interface LoadingState {
  players: boolean; news: boolean; fixtures: boolean; programs: boolean;
  partners: boolean; gallery: boolean; clubInfo: boolean; meta: boolean;
}

interface AppState {
  players: Player[]; news: NewsItem[]; fixtures: Fixture[];
  programs: Program[]; partners: Partner[]; gallery: GalleryItem[];
  stats: ClubStat[]; missionVision: MissionVisionItem[];
  milestones: Milestone[]; management: Management[]; socials: SocialInfo;
  newsCategories: NewsCategory[]; programTitles: ProgramTitle[];
  partnerTiers: PartnerTier[]; galleryCategories: GalleryCategory[];
  loading: LoadingState;
}

interface AppContextType extends AppState {
  refreshData: () => void;
  trackClick: (id: number) => void;
}

const defaultLoading: LoadingState = {
  players: true, news: true, fixtures: true, programs: true,
  partners: true, gallery: true, clubInfo: true, meta: true,
};

const AppContext = createContext<AppContextType>({
  players: dummyPlayers, news: dummyNews, fixtures: dummyFixtures,
  programs: dummyPrograms, partners: dummyPartners, gallery: dummyGallery,
  stats: dummyClubStats, missionVision: dummyMissionVision,
  milestones: dummyMilestones, management: dummyManagement, socials: dummySocials,
  newsCategories: dummyNewsCategories, programTitles: dummyProgramTitles,
  partnerTiers: dummyPartnerTiers, galleryCategories: dummyGalleryCategories,
  loading: defaultLoading,
  refreshData: () => {},
  trackClick: () => {},
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>({
    players: dummyPlayers, news: dummyNews, fixtures: dummyFixtures,
    programs: dummyPrograms, partners: dummyPartners, gallery: dummyGallery,
    stats: dummyClubStats, missionVision: dummyMissionVision,
    milestones: dummyMilestones, management: dummyManagement, socials: dummySocials,
    newsCategories: dummyNewsCategories, programTitles: dummyProgramTitles,
    partnerTiers: dummyPartnerTiers, galleryCategories: dummyGalleryCategories,
    loading: defaultLoading,
  });

  const clickedIdsRef = useRef<Set<number>>(new Set());
  const cooldownRef = useRef<Map<number, number>>(new Map());

  const trackClick = useCallback((id: number) => {
    const now = Date.now();

    if (clickedIdsRef.current.has(id)) return;

    const expiry = cooldownRef.current.get(id);
    if (expiry && now < expiry) return;

    cooldownRef.current.set(id, now + 10_000);

    api.post.trackClick(id);

    setTimeout(() => {
      clickedIdsRef.current.add(id);
      cooldownRef.current.delete(id);
    }, 10_000);
  }, []);

  const fetchAll = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: defaultLoading }));

    const [
      players, news, fixtures, programs, partners, gallery,
      stats, missionVision, milestones, management, socials,
      newsCategories, programTitles, partnerTiers, galleryCategories,
    ] = await Promise.all([
      api.get.players(),
      api.get.news(),
      api.get.fixtures(),
      api.get.programs(),
      api.get.partners(),
      api.get.gallery(),
      api.get.stats(),
      api.get.missionVision(),
      api.get.milestones(),
      api.get.management(),
      api.get.socials(),
      api.get.newsCategories(),
      api.get.programTitles(),
      api.get.partnerTiers(),
      api.get.galleryCategories(),
    ]);

    setState({
      players, news, fixtures, programs, partners, gallery,
      stats, missionVision, milestones, management, socials,
      newsCategories, programTitles, partnerTiers, galleryCategories,
      loading: {
        players: false, news: false, fixtures: false, programs: false,
        partners: false, gallery: false, clubInfo: false, meta: false,
      },
    });
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return (
    <AppContext.Provider value={{ ...state, refreshData: fetchAll, trackClick }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
