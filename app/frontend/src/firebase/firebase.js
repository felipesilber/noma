import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
  browserLocalPersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyDPiAjDKBciL_gNVEP7vc4_dsmbQIXgOb4",
  authDomain: "noma-65c5e.firebaseapp.com",
  projectId: "noma-65c5e",
  storageBucket: "noma-65c5e.firebasestorage.app",
  messagingSenderId: "865775715096",
  appId: "1:865775715096:web:58a2a7915b594fb223546d",
};

const app = initializeApp(firebaseConfig);

let auth;

if (Platform.OS === "web") {
  auth = getAuth(app);
  auth.setPersistence(browserLocalPersistence);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export { app, auth };
