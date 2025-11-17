# Frontend environment variables (Expo)

Use Expo public env variables (available at runtime):

- EXPO_PUBLIC_API_URL: Base URL of your API (e.g., https://api-yourapp.fly.dev)

How to set:
- Local dev: create a `.env` file in this folder and set `EXPO_PUBLIC_API_URL=http://localhost:3000`, then run `npx expo start`.
- EAS Build: set `EXPO_PUBLIC_API_URL` in your EAS project variables.


