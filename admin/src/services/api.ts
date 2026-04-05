// services/api.ts — Admin API: all responses { data: T, message: string }
import axios from 'axios';
import {
  dummyPlayers, dummyNews, dummyNewsCategories, dummyFixtures,
  dummyPrograms, dummyProgramTitles, dummyPartners, dummyPartnerTiers,
  dummyGallery, dummyGalleryCategories, dummyClubStats, dummyMissionVision,
  dummyMilestones, dummyManagement, dummySocials,
} from '@/data/dummyData';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9000/api';

// multipart helper for file uploads
function toFormData(payload: Record<string, any>): FormData {
  const fd = new FormData();
  Object.entries(payload).forEach(([k, v]) => {
    if (v !== undefined && v !== null) fd.append(k, v instanceof File ? v : String(v));
  });
  return fd;
}

const http = axios.create({ baseURL: BASE_URL, timeout: 12000 });

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // Set content-type only for non-FormData
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

// Safe GET — returns data array/object with fallback
async function safe<T>(fetcher: () => Promise<any>, fallback: T): Promise<T> {
  try { const r = await fetcher(); return r.data?.data ?? fallback; }
  catch { return fallback; }
}

// Dummy views data
const dummyViews = [
  { id: 1, newsId: 1, views: 1540 },
  { id: 2, newsId: 2, views: 892 },
  { id: 3, newsId: 3, views: 643 },
  { id: 4, newsId: 4, views: 412 },
  { id: 5, newsId: 5, views: 310 },
  { id: 6, newsId: 6, views: 198 },
];

const dummyAdminProfile = {
  username: 'admin',
  email: 'admin@kilimanjaro-fc.com',
};

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      // REAL: return http.post('/admin/login', { email, password });
      await new Promise(r => setTimeout(r, 600));
      return { data: { data: { token: 'dummy-' + Date.now(), email, username: 'admin' }, message: 'Login successful' } };
    },
    logout: async () => {
      // REAL: return http.post('/admin/logout');
      await new Promise(r => setTimeout(r, 200));
    },
    getProfile: () => safe(() => http.get('/admin/profile'), dummyAdminProfile),
    updateUsername: async (username: string) => {
      return http.put('/admin/username', { username });
      await new Promise(r => setTimeout(r, 400));
      return { data: { data: { username }, message: 'Username updated successfully' } };
    },
    updateEmail: async (email: string) => {
     return http.put('/admin/email', { email });
      await new Promise(r => setTimeout(r, 400));
      return { data: { data: { email }, message: 'Email updated successfully' } };
    },
    updatePassword: async (payload: { current_password: string; new_password: string }) => {
      return http.put('/admin/password', payload);
      await new Promise(r => setTimeout(r, 500));
      return { data: { data: {}, message: 'Password updated successfully' } };
    },
    updatePin: async (payload: { pin: string; confirm_pin: string }) => {
       return http.post('/admin/pin', payload);
      await new Promise(r => setTimeout(r, 400));
      return { data: { data: {}, message: 'PIN updated successfully' } };
    },
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
    player:        (data: FormData | Record<string, any>) => http.post('/players', data instanceof FormData ? data : JSON.stringify(data)),
    news:          (data: FormData | Record<string, any>) => http.post('/news', data instanceof FormData ? data : JSON.stringify(data)),
    newsCategory:  (data: FormData | Record<string, any>) => http.post('/news/categories', data instanceof FormData ? data : JSON.stringify(data)),
    toggleFeatured:(id: number) => http.post(`/news/features/${id}`),
    toggleFirstTeam:(id: number) => http.post(`/players/first-team/${id}`),
    fixture:       (data: Record<string, any>) => http.post('/fixtures', JSON.stringify(data)),
    program:       (data: FormData | Record<string, any>) => http.post('/programs', data instanceof FormData ? data : JSON.stringify(data)),
    partner:       (data: FormData | Record<string, any>) => http.post('/partners', data instanceof FormData ? data : JSON.stringify(data)),
    gallery:       (data: FormData | Record<string, any>) => http.post('/gallery', data instanceof FormData ? data : JSON.stringify(data)),
    stat:          (data: Record<string, any>) => http.post('/club/stats', JSON.stringify(data)),
    milestone:     (data: Record<string, any>) => http.post('/club/milestones', JSON.stringify(data)),
    management:    (data: FormData | Record<string, any>) => http.post('/club/management', data instanceof FormData ? data : JSON.stringify(data)),
    partnerTier:   (data: Record<string, any>) => http.post('/partners/tiers', JSON.stringify(data)),
    galleryCat:    (data: Record<string, any>) => http.post('/gallery/titles', JSON.stringify(data)),
    programTitle:  (data: Record<string, any>) => http.post('/programmes/titles', JSON.stringify(data)),
  },

  put: {
    player:        (id: number, data: FormData | Record<string, any>) => http.put(`/players/${id}`, data instanceof FormData ? data : JSON.stringify(data)),
    news:          (id: number, data: FormData | Record<string, any>) => http.put(`/news/${id}`, data instanceof FormData ? data : JSON.stringify(data)),
    newsCategory:  (id: number, data: Record<string, any>) => http.put(`/news/categories/${id}`, JSON.stringify(data)),
    fixture:       (id: number, data: Record<string, any>) => http.put(`/fixtures/${id}`, JSON.stringify(data)),
    program:       (id: number, data: FormData | Record<string, any>) => http.put(`/programs/${id}`, data instanceof FormData ? data : JSON.stringify(data)),
    partner:       (id: number, data: FormData | Record<string, any>) => http.put(`/partners/${id}`, data instanceof FormData ? data : JSON.stringify(data)),
    partnerTier:   (id: number, data: Record<string, any>) => http.put(`/partners/tiers/${id}`, JSON.stringify(data)),
    gallery:       (id: number, data: FormData | Record<string, any>) => http.put(`/gallery/${id}`, data instanceof FormData ? data : JSON.stringify(data)),
    galleryCat:    (id: number, data: Record<string, any>) => http.put(`/gallery/titles/${id}`, JSON.stringify(data)),
    programTitle:  (id: number, data: Record<string, any>) => http.put(`/programmes/titles/${id}`, JSON.stringify(data)),
    stat:          (id: number, data: Record<string, any>) => http.put(`/club/stats/${id}`, JSON.stringify(data)),
    milestone:     (id: number, data: Record<string, any>) => http.put(`/club/milestones/${id}`, JSON.stringify(data)),
    missionVision: (id: number, data: Record<string, any>) => http.put(`/club/mission/${id}`, JSON.stringify(data)),
    management:    (id: number, data: FormData | Record<string, any>) => http.put(`/club/management/${id}`, data instanceof FormData ? data : JSON.stringify(data)),
    socials:       (data: Record<string, any>) => http.put('/socials', JSON.stringify(data)),
  },

  delete: {
    player:      (id: number) => http.delete(`/players/${id}`),
    news:        (id: number) => http.delete(`/news/${id}`),
    newsCategory:(id: number) => http.delete(`/news/categories/${id}`),
    fixture:     (id: number) => http.delete(`/fixtures/${id}`),
    program:     (id: number) => http.delete(`/programs/${id}`),
    partner:     (id: number) => http.delete(`/partners/${id}`),
    partnerTier: (id: number) => http.delete(`/partners/tiers/${id}`),
    gallery:     (id: number) => http.delete(`/gallery/${id}`),
    galleryCat:  (id: number) => http.delete(`/gallery/titles/${id}`),
    programTitle:(id: number) => http.delete(`/programmes/titles/${id}`),
    stat:        (id: number) => http.delete(`/club/stats/${id}`),
    milestone:   (id: number) => http.delete(`/club/milestones/${id}`),
    management:  (id: number) => http.delete(`/club/management/${id}`),
  },
};

// Helper to build FormData for image uploads
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

// Append additional methods for programTitle (added post-build)
