import axios from "axios";
import { auth } from "../firebase/firebase";

const API_BASE_URL = "https://noma-back.onrender.com";

let lastWakeUp = 0;
const WAKE_UP_INTERVAL = 60 * 1000;

async function wakeUpBackend() {
  const now = Date.now();
  const diferenca = now - lastWakeUp;

  if (diferenca < WAKE_UP_INTERVAL) return;

  lastWakeUp = now;

  try {
    await fetch(`${API_BASE_URL}/health`, { method: "GET" });
  } catch (err) {
    console.log("Render ainda acordando...");
  }
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    await wakeUpBackend();

    const user = auth.currentUser;
    if (user) {
      const idToken = await user.getIdToken();
      config.headers.Authorization = `Bearer ${idToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
