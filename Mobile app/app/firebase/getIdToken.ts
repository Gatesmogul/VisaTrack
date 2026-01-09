import { auth } from "./firebase.config";

export async function getFirebaseIdToken() {
  const user = auth.currentUser;
  if (!user) return null;

  return await user.getIdToken();
}
