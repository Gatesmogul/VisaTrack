import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "./firebase.config";

export function useGoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "<YOUR_GOOGLE_WEB_CLIENT_ID>",
  });

  async function handleGoogleResponse() {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      await signInWithCredential(auth, credential);
    }
  }

  return { promptAsync, handleGoogleResponse };
}
