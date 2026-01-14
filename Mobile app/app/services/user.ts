// services/user.ts
import { getFirebaseIdToken } from "../firebase/getIdToken";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

async function authHeaders() {
  const token = await getFirebaseIdToken();
  if (!token) throw new Error("No auth token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function syncUser(payload: {
  
  email: string;
  fullName?: string;
}) {
  const res = await fetch(`${API_URL}/users/sync`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
}

export async function savePushToken(uid: string, token: string) {
  await fetch(`${API_URL}/users/push-token`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({ uid, token }),
  });
}

export async function acceptTerms() {
  const res =await fetch(`${API_URL}/users/accept-terms`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({ accepted: true }),
  });
    if (!res.ok) {
    throw new Error("Failed to accept terms");
  }
}

export async function getMe() {
  const res = await fetch(`${API_URL}/users/me`, {
    headers: await authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch user");

  return res.json();
}