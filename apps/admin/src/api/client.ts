import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;

// ─── Auth ───────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
};

// ─── Users ──────────────────────────────────────────────
export const usersApi = {
  getAll: () => api.get('/users'),
  getOne: (id: string) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: string, data: any) => api.patch(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};

// ─── Guests ─────────────────────────────────────────────
export const guestsApi = {
  getAll: (params?: any) => api.get('/guests', { params }),
  getOne: (id: string) => api.get(`/guests/${id}`),
  create: (data: any) => api.post('/guests', data),
  update: (id: string, data: any) => api.patch(`/guests/${id}`, data),
  delete: (id: string) => api.delete(`/guests/${id}`),
};

// ─── Invitations ────────────────────────────────────────
export const invitationsApi = {
  getAll: () => api.get('/invitations'),
  getOne: (id: string) => api.get(`/invitations/${id}`),
  create: (data: any) => api.post('/invitations', data),
  update: (id: string, data: any) => api.patch(`/invitations/${id}`, data),
  delete: (id: string) => api.delete(`/invitations/${id}`),
  getPublic: (slug: string) => api.get(`/invitations/public/${slug}`),
};

// ─── Events ─────────────────────────────────────────────
export const eventsApi = {
  getAll: () => api.get('/events'),
  getOne: (id: string) => api.get(`/events/${id}`),
  create: (data: any) => api.post('/events', data),
  update: (id: string, data: any) => api.patch(`/events/${id}`, data),
  delete: (id: string) => api.delete(`/events/${id}`),
};

// ─── Pages ──────────────────────────────────────────────
export const pagesApi = {
  getAll: () => api.get('/pages'),
  getOne: (id: string) => api.get(`/pages/${id}`),
  create: (data: any) => api.post('/pages', data),
  update: (id: string, data: any) => api.patch(`/pages/${id}`, data),
  delete: (id: string) => api.delete(`/pages/${id}`),
};

// ─── Blocks ─────────────────────────────────────────────
export const blocksApi = {
  create: (data: any) => api.post('/blocks', data),
  update: (id: string, data: any) => api.patch(`/blocks/${id}`, data),
  delete: (id: string) => api.delete(`/blocks/${id}`),
  reorder: (data: { id: string; sortOrder: number }[]) =>
    api.patch('/blocks/reorder', data),
};

// ─── Blog ───────────────────────────────────────────────
export const blogApi = {
  getAll: () => api.get('/blog'),
  getOne: (id: string) => api.get(`/blog/${id}`),
  create: (data: any) => api.post('/blog', data),
  update: (id: string, data: any) => api.patch(`/blog/${id}`, data),
  delete: (id: string) => api.delete(`/blog/${id}`),
};

// ─── Media ──────────────────────────────────────────────
export const mediaApi = {
  getAll: () => api.get('/media'),
  upload: (file: File, alt?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (alt) formData.append('alt', alt);
    return api.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id: string) => api.delete(`/media/${id}`),
};

// ─── Settings ───────────────────────────────────────────
export const settingsApi = {
  get: () => api.get('/settings'),
  update: (data: any) => api.patch('/settings', data),
};
