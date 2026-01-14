import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyACvncCQqdAtlwpt-vT3yXFpMT5bn0x5dE",
  authDomain: "visatrack-31522.firebaseapp.com",
  projectId: "visatrack-31522",
  storageBucket: "visatrack-31522.firebasestorage.app",
  messagingSenderId: "475463461518",
  appId: "1:475463461518:web:415df4c65e0aee35dbf7df",
};

const app = initializeApp(firebaseConfig);

export const auth =
  getAuth(app) ??
  initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
