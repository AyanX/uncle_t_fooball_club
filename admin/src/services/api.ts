// services/api.ts — Admin API service
import axios from 'axios';
import {
  dummyPlayers, dummyNews, dummyNewsCategories, dummyFixtures,
  dummyPrograms, dummyProgramTitles, dummyPartners, dummyPartnerTiers,
  dummyGallery, dummyGalleryCategories, dummyClubStats, dummyMissionVision,
  dummyMilestones, dummyManagement, dummySocials,
} from '@/data/dummyData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.kilimanjaro-fc.com/v1';

const http = axios.create({ baseURL: BASE_URL, timeout: 10000, headers: { 'Content-Type': 'application/json' } });

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 403 interceptor — handled in AuthContext via event
http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 403) {
      window.dispatchEvent(new CustomEvent('admin:forbidden'));
    }
    return Promise.reject(err);
  }
);

async function safe<T>(fetcher: () => Promise<any>, fallback: T): Promise<T> {
  try { const r = await fetcher(); return r.data?.data ?? fallback; }
  catch { return fallback; }
}

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      // REAL API: return http.post('/admin/login', { email, password });
      // DUMMY: always succeed
      await new Promise(r => setTimeout(r, 600));
      return { data: { data: { token: 'dummy-token-' + Date.now(), email }, message: 'ok' } };
    },
    logout: async () => {
      // return http.post('/admin/logout');
      await new Promise(r => setTimeout(r, 200));
    },
    changeCredentials: async (payload: { current_password: string; new_password: string; email: string }) => {
      // return http.put('/admin/credentials', payload);
      await new Promise(r => setTimeout(r, 500));
      return { ok: true };
    },
  },
  get: {
    players:          () => safe(() => http.get('/players'), dummyPlayers),
    news:             () => safe(() => http.get('/news'), dummyNews),
    newsCategories:   () => safe(() => http.get('/news/categories'), dummyNewsCategories),
    newsItem:         (slug: string) => safe(() => http.get(`/news/${slug}`), dummyNews.find(n => n.slug === slug)),
    fixtures:         () => safe(() => http.get('/fixtures'), dummyFixtures),
    programs:         () => safe(() => http.get('/programs'), dummyPrograms),
    programTitles:    () => safe(() => http.get('/programmes/titles'), dummyProgramTitles),
    partners:         () => safe(() => http.get('/partners'), dummyPartners),
    partnerTiers:     () => safe(() => http.get('/partners/tiers'), dummyPartnerTiers),
    gallery:          () => safe(() => http.get('/gallery'), dummyGallery),
    galleryCategories:() => safe(() => http.get('/gallery/titles'), dummyGalleryCategories),
    stats:            () => safe(() => http.get('/club/stats'), dummyClubStats),
    missionVision:    () => safe(() => http.get('/club/mission'), dummyMissionVision),
    milestones:       () => safe(() => http.get('/club/milestones'), dummyMilestones),
    management:       () => safe(() => http.get('/club/management'), dummyManagement),
    socials:          () => safe(() => http.get('/socials'), dummySocials),
  },
  post: {
    player:   (data: any) => http.post('/players', data),
    news:     (data: any) => http.post('/news', data),
    newsCategory: (data: any) => http.post('/news/categories', data),
    fixture:  (data: any) => http.post('/fixtures', data),
    program:  (data: any) => http.post('/programs', data),
    partner:  (data: any) => http.post('/partners', data),
    gallery:  (data: any) => http.post('/gallery', data),
    stat:     (data: any) => http.post('/club/stats', data),
    milestone:(data: any) => http.post('/club/milestones', data),
    management:(data: any) => http.post('/club/management', data),
    missionVision:(data: any) => http.post('/club/mission', data),
  },
  put: {
    player:   (id: number, data: any) => http.put(`/players/${id}`, data),
    news:     (id: number, data: any) => http.put(`/news/${id}`, data),
    newsCategory:(id: number, data: any) => http.put(`/news/categories/${id}`, data),
    fixture:  (id: number, data: any) => http.put(`/fixtures/${id}`, data),
    program:  (id: number, data: any) => http.put(`/programs/${id}`, data),
    partner:  (id: number, data: any) => http.put(`/partners/${id}`, data),
    gallery:  (id: number, data: any) => http.put(`/gallery/${id}`, data),
    stat:     (id: number, data: any) => http.put(`/club/stats/${id}`, data),
    milestone:(id: number, data: any) => http.put(`/club/milestones/${id}`, data),
    management:(id: number, data: any) => http.put(`/club/management/${id}`, data),
    missionVision:(id: number, data: any) => http.put(`/club/mission/${id}`, data),
    socials:  (data: any) => http.put('/socials', data),
  },
  delete: {
    player:   (id: number) => http.delete(`/players/${id}`),
    news:     (id: number) => http.delete(`/news/${id}`),
    newsCategory:(id: number) => http.delete(`/news/categories/${id}`),
    fixture:  (id: number) => http.delete(`/fixtures/${id}`),
    program:  (id: number) => http.delete(`/programs/${id}`),
    partner:  (id: number) => http.delete(`/partners/${id}`),
    gallery:  (id: number) => http.delete(`/gallery/${id}`),
    stat:     (id: number) => http.delete(`/club/stats/${id}`),
    milestone:(id: number) => http.delete(`/club/milestones/${id}`),
    management:(id: number) => http.delete(`/club/management/${id}`),
    missionVision:(id: number) => http.delete(`/club/mission/${id}`),
  },
};
