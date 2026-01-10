

import { authHeaders } from '../app/utils/authHeaders';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function fetchRecentLookups() {
  const res = await fetch(`${API_URL}/recent-lookups`, {
    headers: await authHeaders(),
  });
  return res.json();
}
