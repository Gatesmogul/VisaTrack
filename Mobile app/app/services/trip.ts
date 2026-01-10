import { getFirebaseIdToken } from "../firebase/getIdToken";

const API_URL = "http://localhost:3000";

async function authHeaders() {
  const token = await getFirebaseIdToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function createTrip(data: {
  country: string;
  entryDate: string;
  exitDate: string;
  purpose: string;
}) {
  const res = await fetch(`${API_URL}/trips`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create trip");

  return res.json();
}


export async function getTrips() {
  const res = await fetch(`${API_URL}/trips`, {
    headers: await authHeaders(),
  });
  return res.json();
}
