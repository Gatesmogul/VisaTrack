import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase.config";

export async function signUp(email: string, password: string) {
  const userCred = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await sendEmailVerification(userCred.user);

  return userCred.user;
}

export async function signIn(email: string, password: string) {
  const userCred = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCred.user;
}

export function logout() {
  return signOut(auth);
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}