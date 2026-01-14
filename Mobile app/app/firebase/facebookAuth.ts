import * as Facebook from "expo-facebook";
import { FacebookAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "./firebase.config";

export async function signInWithFacebook() {
  await Facebook.initializeAsync({
    appId: "<FACEBOOK_APP_ID>",
  });

  const result = await Facebook.logInWithReadPermissionsAsync({
    permissions: ["public_profile", "email"],
  });

  if (result.type === "success") {
    const credential = FacebookAuthProvider.credential(result.token);
    await signInWithCredential(auth, credential);
  }
}
