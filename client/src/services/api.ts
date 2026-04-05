// =============================================================================
// api.ts — Centralised Axios API service for Kilimanjaro FC
// Every API response shape: { data: T, message: string }
// Player fetched by numeric :id, not by slug/name
// =============================================================================
import axios, { AxiosResponse } from 'axios';
import {
  dummyPlayers, dummyNews, dummyNewsCategories, dummyFixtures,
  dummyPrograms, dummyProgramTitles, dummyPartners, dummyPartnerTiers,
  dummyGallery, dummyGalleryCategories, dummyClubStats, dummyMissionVision,
  dummyMilestones, dummyManagement, dummySocials,
  Player, NewsItem, NewsCategory, Fixture, Program, ProgramTitle,
  Partner, PartnerTier, GalleryItem, GalleryCategory, ClubStat,
  MissionVisionItem, Milestone, Management, SocialInfo,
} from '@/data/dummyData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9000/api';

interface ApiResponse<T> { data: T; message: string; }

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('kfc_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

async function safeFetch<T>(
  fetcher: () => Promise<AxiosResponse<ApiResponse<T>>>,
  fallback: T,
): Promise<T> {
  try {
    const res = await fetcher();
    return res.data?.data ?? fallback;
  } catch {
    return fallback;
  }
}

export const api = {
  get: {
    // Players — fetch by numeric id for individual profile
    players: (): Promise<Player[]> =>
      safeFetch(() => http.get<ApiResponse<Player[]>>('/players'), dummyPlayers),
    player: (id: number): Promise<Player | undefined> =>
      safeFetch(
        () => http.get<ApiResponse<Player>>(`/players/${id}`),
        dummyPlayers.find((p) => p.id === id),
      ),

    // News
    news: (): Promise<NewsItem[]> =>
      safeFetch(() => http.get<ApiResponse<NewsItem[]>>('/news'), dummyNews),

    newsItem: (slug: string): Promise<NewsItem | undefined> =>
      safeFetch(
        () => http.get<ApiResponse<NewsItem>>(`/news/${slug}`),
        dummyNews.find((n) => n.slug === slug),
      ),
    newsCategories: (): Promise<NewsCategory[]> =>
      safeFetch(() => http.get<ApiResponse<NewsCategory[]>>('/news/categories'), dummyNewsCategories),

    // Fixtures
    fixtures: (): Promise<Fixture[]> =>
      safeFetch(() => http.get<ApiResponse<Fixture[]>>('/fixtures'), dummyFixtures),

    // Programs
    programs: (): Promise<Program[]> =>
      safeFetch(() => http.get<ApiResponse<Program[]>>('/programs'), dummyPrograms),
    program: (slug: string): Promise<Program | undefined> =>
      safeFetch(
        () => http.get<ApiResponse<Program>>(`/programs/${slug}`),
        dummyPrograms.find((pr) => pr.slug === slug),
      ),
    programTitles: (): Promise<ProgramTitle[]> =>
      safeFetch(() => http.get<ApiResponse<ProgramTitle[]>>('/programmes/titles'), dummyProgramTitles),

    // Partners
    partners: (): Promise<Partner[]> =>
      safeFetch(() => http.get<ApiResponse<Partner[]>>('/partners'), dummyPartners),
    partnerTiers: (): Promise<PartnerTier[]> =>
      safeFetch(() => http.get<ApiResponse<PartnerTier[]>>('/partners/tiers'), dummyPartnerTiers),

    // Gallery
    gallery: (): Promise<GalleryItem[]> =>
      safeFetch(() => http.get<ApiResponse<GalleryItem[]>>('/gallery'), dummyGallery),
    galleryCategories: (): Promise<GalleryCategory[]> =>
      safeFetch(() => http.get<ApiResponse<GalleryCategory[]>>('/gallery/titles'), dummyGalleryCategories),

    // Club info
    stats: (): Promise<ClubStat[]> =>
      safeFetch(() => http.get<ApiResponse<ClubStat[]>>('/club/stats'), dummyClubStats),
    missionVision: (): Promise<MissionVisionItem[]> =>
      safeFetch(() => http.get<ApiResponse<MissionVisionItem[]>>('/club/mission'), dummyMissionVision),
    milestones: (): Promise<Milestone[]> =>
      safeFetch(() => http.get<ApiResponse<Milestone[]>>('/club/milestones'), dummyMilestones),
    management: (): Promise<Management[]> =>
      safeFetch(() => http.get<ApiResponse<Management[]>>('/club/management'), dummyManagement),
    socials: (): Promise<SocialInfo> =>
      safeFetch(() => http.get<ApiResponse<SocialInfo>>('/socials'), dummySocials),
  },

  post: {
    /** Track news/gallery click — POST /click/:id */
    trackClick: (id: number): Promise<void> =>
      http.post(`/click/${id}`).then(() => undefined).catch(() => undefined),

    /** Submit contact form */
    contact: (formData: {
      name: string; phone_number: string; email: string;
      message: string; location: string; subject: string;
    }) => http.post<ApiResponse<{ id: number }>>('/contact', formData),

    /** Submit volunteer application */
    volunteerApplication: (data: {
      name: string; email: string; phone_number: string;
      area: string; message?: string;
    }) => http.post<ApiResponse<{ id: number }>>('/volunteer/apply', data),
  },
};
