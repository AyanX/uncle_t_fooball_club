
import React, {
  createContext, useContext, useEffect, useState,
  useCallback, useRef, ReactNode,
} from 'react';
import { api } from '@/services/api';
import {
  Player, NewsItem, Fixture, Program, Partner, GalleryItem, ClubStat,
  MissionVisionItem, Milestone, Management, SocialInfo,
  NewsCategory, ProgramTitle, PartnerTier, GalleryCategory, TeamName,
  dummyPlayers, dummyNews, dummyFixtures, dummyPrograms, dummyPartners,
  dummyGallery, dummyClubStats, dummyMissionVision, dummyMilestones,
  dummyManagement, dummySocials, dummyNewsCategories,
  dummyProgramTitles, dummyPartnerTiers, dummyGalleryCategories, dummyTeamName,
} from '@/data/dummyData';

// Types
interface LoadingState {
  players: boolean; news: boolean; fixtures: boolean; programs: boolean;
  partners: boolean; gallery: boolean; clubInfo: boolean; meta: boolean;
}

interface AppState {
  // Core data
  players: Player[]; news: NewsItem[]; fixtures: Fixture[];
  programs: Program[]; partners: Partner[]; gallery: GalleryItem[];
  // Club info
  stats: ClubStat[]; missionVision: MissionVisionItem[];
  milestones: Milestone[]; management: Management[]; socials: SocialInfo;
  // Meta / filter data
  newsCategories: NewsCategory[]; programTitles: ProgramTitle[];
  logo: { image: string; blur_image: string } | null;
  partnerTiers: PartnerTier[]; galleryCategories: GalleryCategory[];
  teamName: TeamName;
  loading: LoadingState;
}

interface AppContextType extends AppState {
  refreshData: () => void;
  /** Track a news/gallery click. Idempotent: same id silently ignored for 10s
   *  AND ignored permanently if already in the session-clicked set. */
  trackClick: (id: number) => void;
}

// Defaults
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
  logo: null,
  partnerTiers: dummyPartnerTiers, galleryCategories: dummyGalleryCategories,
  teamName: dummyTeamName,
  loading: defaultLoading,
  refreshData: () => {},
  trackClick: () => {},
});

// Provider
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>({
    players: dummyPlayers, news: dummyNews, fixtures: dummyFixtures,
    programs: dummyPrograms, partners: dummyPartners, gallery: dummyGallery,
    stats: dummyClubStats, missionVision: dummyMissionVision,
    milestones: dummyMilestones, management: dummyManagement, socials: dummySocials,
    newsCategories: dummyNewsCategories, programTitles: dummyProgramTitles,
  logo: null,
    partnerTiers: dummyPartnerTiers, galleryCategories: dummyGalleryCategories,
    teamName: dummyTeamName,
    loading: defaultLoading,
  });

  // Click-tracking state
  // Permanently clicked IDs in this session (never re-sent)
  const clickedIdsRef = useRef<Set<number>>(new Set());
  // Cooldown: ids locked for 10s after first click
  const cooldownRef = useRef<Map<number, number>>(new Map());  // id → expiry timestamp

  const trackClick = useCallback((id: number) => {
    const now = Date.now();

    // Already in permanent session set → skip
    if (clickedIdsRef.current.has(id)) return;

    // In 10-second cooldown → skip
    const expiry = cooldownRef.current.get(id);
    if (expiry && now < expiry) return;

    // Lock for 10s
    cooldownRef.current.set(id, now + 10_000);

    // Fire and forget: no need to block UI
    api.post.trackClick(id);

    // After 10s, add to permanent set so we never re-send
    setTimeout(() => {
      clickedIdsRef.current.add(id);
      cooldownRef.current.delete(id);
    }, 10_000);
  }, []);

  // Fetch all data in ONE Promise.all
  const fetchAll = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: defaultLoading }));

    const [
      players, news, fixtures, programs, partners, gallery,
      stats, missionVision, milestones, management, socials,
      newsCategories, programTitles, partnerTiers, galleryCategories, logoRes, teamName,
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
      api.get.logo(),
      api.get.teamName(),
    ]);

    setState({
      players, news, fixtures, programs, partners, gallery,
      stats, missionVision, milestones, management, socials,
      newsCategories, programTitles, partnerTiers, galleryCategories,
      logo: logoRes ? { image: (logoRes as any).image || '', blur_image: (logoRes as any).blur_image || '' } : null,
      teamName,
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
