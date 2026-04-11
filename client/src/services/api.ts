
import axios, { AxiosResponse } from 'axios';
import {
  Player, NewsItem, NewsCategory, Fixture, Program, ProgramTitle,
  Partner, PartnerTier, GalleryItem, GalleryCategory, ClubStat,
  MissionVisionItem, Milestone, Management, SocialInfo, TeamName,
} from '@/data/dummyData';

const BASE_URL ="https://api.uncletfootballclub.com/api";

interface ApiResponse<T> { data: T; message: string; }

const http = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

async function safeFetch<T>(
  fetcher: () => Promise<AxiosResponse<ApiResponse<T>>>,
  fallback: T,
): Promise<T> {
  try {
    const res = await fetcher();
    return res.data?.data ?? fallback;
  } catch {
    return null;
  }
}

export const api = {
  get: {
    // Players: fetch by numeric id for individual profile
    players: (): Promise<Player[]> =>
      safeFetch(() => http.get<ApiResponse<Player[]>>('/players'), []),
    player: (id: number): Promise<Player | undefined> =>
      safeFetch(
        () => http.get<ApiResponse<Player>>(`/players/${id}`),
        undefined,
      ),

    // News
    news: (): Promise<NewsItem[]> =>
      safeFetch(() => http.get<ApiResponse<NewsItem[]>>('/news'), []),
    newsItem: (slug: string): Promise<NewsItem | undefined> =>
      safeFetch(
        () => http.get<ApiResponse<NewsItem>>(`/news/${slug}`),
        undefined,
      ),
    newsCategories: (): Promise<NewsCategory[]> =>
      safeFetch(() => http.get<ApiResponse<NewsCategory[]>>('/news/categories'), []),

    // Fixtures
    fixtures: (): Promise<Fixture[]> =>
      safeFetch(() => http.get<ApiResponse<Fixture[]>>('/fixtures'), null),

    // Programs
    programs: (): Promise<Program[]> =>
      safeFetch(() => http.get<ApiResponse<Program[]>>('/programs'), []),
    program: (slug: string): Promise<Program | undefined> =>
      safeFetch(
        () => http.get<ApiResponse<Program>>(`/programs/${slug}`),
        undefined,
      ),
    programTitles: (): Promise<ProgramTitle[]> =>
      safeFetch(() => http.get<ApiResponse<ProgramTitle[]>>('/programmes/titles/unused'), []),

    // Partners
    partners: (): Promise<Partner[]> =>
      safeFetch(() => http.get<ApiResponse<Partner[]>>('/partners'), []),
    partnerTiers: (): Promise<PartnerTier[]> =>
      safeFetch(() => http.get<ApiResponse<PartnerTier[]>>('/partners/tiers'), []),

    // Gallery
    gallery: (): Promise<GalleryItem[]> =>
      safeFetch(() => http.get<ApiResponse<GalleryItem[]>>('/gallery'), []),
    galleryCategories: (): Promise<GalleryCategory[]> =>
      safeFetch(() => http.get<ApiResponse<GalleryCategory[]>>('/gallery/titles'), []),

    // Club info
    stats: (): Promise<ClubStat[]> =>
      safeFetch(() => http.get<ApiResponse<ClubStat[]>>('/club/stats'), []),
    missionVision: (): Promise<MissionVisionItem[]> =>
      safeFetch(() => http.get<ApiResponse<MissionVisionItem[]>>('/club/mission'), []),
    milestones: (): Promise<Milestone[]> =>
      safeFetch(() => http.get<ApiResponse<Milestone[]>>('/club/milestones'), []),
    management: (): Promise<Management[]> =>
      safeFetch(() => http.get<ApiResponse<Management[]>>('/club/management'), []),
    logo:     (): Promise<{ image: string; blur_image: string } | null> =>
      safeFetch(() => http.get('/logo'), null),
    socials: (): Promise<SocialInfo> =>
      safeFetch(() => http.get<ApiResponse<SocialInfo>>('/socials'), {} as SocialInfo),
    teamName: (): Promise<TeamName> =>
      safeFetch(() => http.get<ApiResponse<TeamName>>('/teamname'), {} as TeamName),
  },

  post: {
    /** Track news/gallery click — POST /click/:id */
    trackClick: (id: number): Promise<void> =>
      http.post(`/views/${id}`).then(() => undefined).catch(() => undefined),

    /** Submit contact form */
    contact: (formData: {
      name: string; phone_number: string; email: string;
      message: string; location: string; subject: string;
    }) => http.post<ApiResponse<{ id: number }>>("/messages", formData),

    /** Submit volunteer application */
    volunteerApplication: (data: {
      name: string; email: string; phone_number: string;
      area: string; message?: string;
    }) => http.post<ApiResponse<{ id: number }>>('/volunteer/apply', data),

    /** Submit membership application */
    joinApplication: (data: {
      name: string; email: string; phone_number: string;
      membership_type: string; message: string;
    }) => http.post<ApiResponse<{ id: number }>>('/join', data),
  },
};
