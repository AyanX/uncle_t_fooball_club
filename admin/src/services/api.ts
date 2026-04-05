// services/api.ts — Admin API service
// All responses: { data: T, message: string }
// withCredentials: true ensures cookies are sent/received
import axios from 'axios';
import {
  dummyPlayers, dummyNews, dummyNewsCategories, dummyFixtures,
  dummyPrograms, dummyProgramTitles, dummyPartners, dummyPartnerTiers,
  dummyGallery, dummyGalleryCategories, dummyClubStats, dummyMissionVision,
  dummyMilestones, dummyManagement, dummySocials,
} from '@/data/dummyData';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9000/api';

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
  withCredentials: true,   // ← sends & stores cookies cross-origin
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 403) window.dispatchEvent(new CustomEvent('admin:forbidden'));
    return Promise.reject(err);
  }
);

async function safe<T>(fetcher: () => Promise<any>, fallback: T): Promise<T> {
  try { const r = await fetcher(); return r.data?.data ?? fallback; }
  catch { return fallback; }
}

// Dummy views for fallback only
const dummyViews = [
  { id: 1, newsId: 1, views: 1540 }, { id: 2, newsId: 2, views: 892 },
  { id: 3, newsId: 3, views: 643 },  { id: 4, newsId: 4, views: 412 },
  { id: 5, newsId: 5, views: 310 },  { id: 6, newsId: 6, views: 198 },
];

const dummyAdminProfile = { username: 'admin', email: 'admin@kilimanjaro-fc.com' };

export const api = {
  auth: {
    // Verify session via GET /auth — 200+ or 300+ = logged in, else not
    verify: async (): Promise<any> => {
      try {
        const r = await http.get('/auth', { validateStatus: () => true });
        if (r.status >= 200) return r.data?.data ?? null;
        return null;
      }
      catch { return null; }
    },
    login: (email: string, password: string) =>
      http.post('/admin/login', { email, password }),
    loginWithPin: (email: string, pin: string) =>
      http.post('/login-with-pin', { email, pin }),
    logout: () => http.post('/admin/logout').catch(() => {}),

    getProfile: () => safe(() => http.get('/admin/profile'), dummyAdminProfile),

    updateUsername: (username: string) =>
      http.put('/admin/username', { username }),

    updateEmail: (email: string) =>
      http.put('/admin/email', { email }),

    updatePassword: (payload: { current_password: string; new_password: string }) =>
      http.put('/admin/password', payload),

    updatePin: (payload: { pin: string; confirm_pin: string }) =>
      http.post('/admin/pin', payload),
  },

  get: {
    players:           () => safe(() => http.get('/players'), dummyPlayers),
    news:              () => safe(() => http.get('/news'), dummyNews),
    newsCategories:    () => safe(() => http.get('/news/categories'), dummyNewsCategories),
    newsItem:          (title: string) => safe(() => http.get(`/news/title/${encodeURIComponent(title)}`), dummyNews.find(n => n.title === title)),
    newsViews:         () => safe(() => http.get('/views'), dummyViews),
    fixtures:          () => safe(() => http.get('/fixtures'), dummyFixtures),
    programs:          () => safe(() => http.get('/programs'), dummyPrograms),
    programTitles:     () => safe(() => http.get('/programmes/titles'), dummyProgramTitles),
    partners:          () => safe(() => http.get('/partners'), dummyPartners),
    partnerTiers:      () => safe(() => http.get('/partners/tiers'), dummyPartnerTiers),
    gallery:           () => safe(() => http.get('/gallery'), dummyGallery),
    galleryCategories: () => safe(() => http.get('/gallery/titles'), dummyGalleryCategories),
    stats:             () => safe(() => http.get('/club/stats'), dummyClubStats),
    missionVision:     () => safe(() => http.get('/club/mission'), dummyMissionVision),
    milestones:        () => safe(() => http.get('/club/milestones'), dummyMilestones),
    management:        () => safe(() => http.get('/club/management'), dummyManagement),
    socials:           () => safe(() => http.get('/socials'), dummySocials),
  },

  post: {
    player:          (data: FormData | Record<string, any>) => http.post('/players', data),
    news:            (data: FormData | Record<string, any>) => http.post('/news', data),
    newsCategory:    (data: FormData | Record<string, any>) => http.post('/news/categories', data),
    toggleFeatured:  (id: number) => http.post(`/news/features/${id}`),
    toggleFirstTeam: (id: number) => http.post(`/players/first-team/${id}`),
    fixture:         (data: Record<string, any>) => http.post('/fixtures', JSON.stringify(data)),
    program:         (data: FormData | Record<string, any>) => http.post('/programs', data),
    partner:         (data: FormData | Record<string, any>) => http.post('/partners', data),
    gallery:         (data: FormData | Record<string, any>) => http.post('/gallery', data),
    stat:            (data: Record<string, any>) => http.post('/club/stats', JSON.stringify(data)),
    milestone:       (data: Record<string, any>) => http.post('/club/milestones', JSON.stringify(data)),
    management:      (data: FormData | Record<string, any>) => http.post('/club/management', data),
    partnerTier:     (data: Record<string, any>) => http.post('/partners/tiers', JSON.stringify(data)),
    galleryCat:      (data: Record<string, any>) => http.post('/gallery/titles', JSON.stringify(data)),
    programTitle:    (data: Record<string, any>) => http.post('/programmes/titles', JSON.stringify(data)),
    missionVision:   (data: Record<string, any>) => http.post('/club/mission', JSON.stringify(data)),
  },

  put: {
    player:        (id: number, data: FormData | Record<string, any>) => http.put(`/players/${id}`, data),
    news:          (id: number, data: FormData | Record<string, any>) => http.put(`/news/${id}`, data),
    newsCategory:  (id: number, data: any) => http.put(`/news/categories/${id}`, data),
    fixture:       (id: number, data: Record<string, any>) => http.put(`/fixtures/${id}`, JSON.stringify(data)),
    program:       (id: number, data: FormData | Record<string, any>) => http.put(`/programs/${id}`, data),
    partner:       (id: number, data: FormData | Record<string, any>) => http.put(`/partners/${id}`, data),
    partnerTier:   (id: number, data: Record<string, any>) => http.put(`/partners/tiers/${id}`, JSON.stringify(data)),
    gallery:       (id: number, data: FormData | Record<string, any>) => http.put(`/gallery/${id}`, data),
    galleryCat:    (id: number, data: Record<string, any>) => http.put(`/gallery/titles/${id}`, JSON.stringify(data)),
    stat:          (id: number, data: Record<string, any>) => http.put(`/club/stats/${id}`, JSON.stringify(data)),
    milestone:     (id: number, data: Record<string, any>) => http.put(`/club/milestones/${id}`, JSON.stringify(data)),
    missionVision: (id: number, data: Record<string, any>) => http.put(`/club/mission/${id}`, JSON.stringify(data)),
    management:    (id: number, data: FormData | Record<string, any>) => http.put(`/club/management/${id}`, data),
    socials:       (data: Record<string, any>) => http.put('/socials', JSON.stringify(data)),
    programTitle:  (id: number, data: Record<string, any>) => http.put(`/programmes/titles/${id}`, JSON.stringify(data)),
  },

  delete: {
    player:       (id: number) => http.delete(`/players/${id}`),
    news:         (id: number) => http.delete(`/news/${id}`),
    newsCategory: (id: number) => http.delete(`/news/categories/${id}`),
    fixture:      (id: number) => http.delete(`/fixtures/${id}`),
    program:      (id: number) => http.delete(`/programs/${id}`),
    partner:      (id: number) => http.delete(`/partners/${id}`),
    partnerTier:  (id: number) => http.delete(`/partners/tiers/${id}`),
    gallery:      (id: number) => http.delete(`/gallery/${id}`),
    galleryCat:   (id: number) => http.delete(`/gallery/titles/${id}`),
    stat:         (id: number) => http.delete(`/club/stats/${id}`),
    milestone:    (id: number) => http.delete(`/club/milestones/${id}`),
    management:   (id: number) => http.delete(`/club/management/${id}`),
    missionVision:(id: number) => http.delete(`/club/mission/${id}`),
    programTitle: (id: number) => http.delete(`/programmes/titles/${id}`),
  },
};

export function buildFormData(payload: Record<string, any>, imageFile?: File | null, imageKey = 'image'): FormData | Record<string, any> {
  if (!imageFile) return payload;
  const fd = new FormData();
  Object.entries(payload).forEach(([k, v]) => {
    if (v !== undefined && v !== null && k !== 'image' && k !== 'blur_image') {
      fd.append(k, typeof v === 'boolean' ? String(v) : v instanceof File ? v : String(v));
    }
  });
  fd.append(imageKey, imageFile);
  return fd;
}
