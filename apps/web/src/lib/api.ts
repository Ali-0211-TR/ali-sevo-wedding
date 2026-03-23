const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function fetchApi(endpoint: string) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getSettings() {
  return fetchApi('/settings');
}

export async function getPublicPages() {
  return fetchApi('/pages/public');
}

export async function getPublicPage(slug: string) {
  return fetchApi(`/pages/public/${slug}`);
}

export async function getPublicEvents() {
  return fetchApi('/events/public');
}

export async function getInvitationBySlug(slug: string) {
  return fetchApi(`/invitations/public/${slug}`);
}

export async function getPublicBlogPosts() {
  return fetchApi('/blog/public');
}

export async function getPublicBlogPost(slug: string) {
  return fetchApi(`/blog/public/${slug}`);
}

export async function submitRsvp(invitationSlug: string, data: {
  guestId: string;
  status: string;
  message?: string;
  dietaryNeeds?: string;
}) {
  const res = await fetch(`${API_URL}/invitations/public/${invitationSlug}/rsvp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}
