import { auth } from "@/firebase/firebase.config";

export async function authHeaders() {
  const token = await auth.currentUser?.getIdToken();

  if (!token) {
    throw new Error("User not authenticated");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}
