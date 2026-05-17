# Vibecheck

**Figure out what to do instantly.** Vibecheck helps you discover experiences based on your vibe, budget, distance, time, and who you're with — without the planning headache.

> Not an "AI travel planner." It's an app for answering: *What should we do tonight?* *Where should I go this weekend?* *What's fun nearby?*

## What it does

Users pick a mood and a few filters; the app returns a curated mini-itinerary — bars, restaurants, neighborhoods, hidden gems, and suggested stops — tailored to the moment.

### Auth

- **Welcome** — create account, sign in, or continue as guest
- **Sessions persist** — tokens and profile are saved in `expo-secure-store` and restored when you reopen the app
- **Account** — tap your name (top-right on the vibe picker) to view profile or sign out

### MVP flow

1. **Vibe** — chill, social, romantic, adventurous, foodie, nightlife, outdoorsy, productive
2. **Filters** — budget, time available, group (solo / date / friends), distance
3. **Loading** — generates your plan
4. **Itinerary** — stops, estimated cost, regenerate or start over

**Product strategy:** Start with discovery, recommendations, and itineraries. Social features come later — the app should stay useful even with few users.

---

## Quick start

You need **two terminals**: one for the API, one for the mobile app.

### Terminal 1 — API

```bash
git clone <your-repo-url>
cd TouchGrass

npm install
cp apps/api/.env.example apps/api/.env   # first time only
npm run api
```

Leave this running. You should see:

```text
Vibecheck API listening on http://localhost:3001
  Database: .../apps/api/data/vibecheck.db
```

Verify on your Mac:

```bash
curl http://localhost:3001/health
# {"ok":true,"service":"vibecheck-api"}
```

> **No Docker required.** Auth uses a local SQLite file (`apps/api/data/vibecheck.db`), created automatically.

### Terminal 2 — Mobile app

```bash
cp apps/mobile/.env.example apps/mobile/.env   # first time only (for itinerary AI key)
npm run mobile
```

Or equivalently:

```bash
cd apps/mobile
npx expo start --clear
```

You can also run `npx expo start --clear` from the **repo root** — the root `app.config.js` and `metro.config.js` point at the mobile app.

Then press **`a`** (Android emulator), **`i`** (iOS simulator), or scan the QR code with **Expo Go**.

---

## Prerequisites

| Requirement | Notes |
|-------------|--------|
| **Node.js 20+** | Run `nvm use` (see [`.nvmrc`](.nvmrc)) |
| **npm** | Workspaces via `package-lock.json` |
| **Expo Go** or a simulator | Android Studio / Xcode optional |
| **Anthropic API key** | Optional — only needed to **generate itineraries** (not for sign-up) |
| **Docker** | Optional — only for `infra/docker` Postgres/Redis if you add that later |

---

## Environment variables

### Mobile (`apps/mobile/.env`)

```bash
cp apps/mobile/.env.example apps/mobile/.env
```

| Variable | Required | Description |
|----------|----------|-------------|
| `EXPO_PUBLIC_ANTHROPIC_API_KEY` | For itineraries | Claude API key — [console.anthropic.com](https://console.anthropic.com) |
| `EXPO_PUBLIC_API_URL` | Usually **no** | Override auth API URL (see below) |

**Auth API URL (auto-detected by default):**

| Device | URL used |
|--------|----------|
| iOS Simulator | `http://localhost:3001` |
| Android Emulator | `http://10.0.2.2:3001` (maps to your Mac’s localhost) |
| Physical phone (Expo Go) | Same Wi‑Fi IP as Metro (e.g. `http://192.168.x.x:3001`) |

Set `EXPO_PUBLIC_API_URL` manually only if auto-detect fails, for example:

```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:3001
```

Restart Expo after changing `.env` (`npx expo start --clear`).

> **Security:** Never ship `EXPO_PUBLIC_ANTHROPIC_API_KEY` in production. Proxy Claude through `apps/api` before real users.

### API (`apps/api/.env`)

```bash
cp apps/api/.env.example apps/api/.env
```

Defaults work out of the box (SQLite path, dev JWT secrets). Optional: `PORT`, `DATABASE_PATH`, JWT secrets for production.

---

## Auth API

| Endpoint | Method | Body / headers |
|----------|--------|----------------|
| `/health` | GET | — |
| `/auth/register` | POST | `{ email, password, displayName }` — password ≥ 8 chars |
| `/auth/login` | POST | `{ email, password }` |
| `/auth/refresh` | POST | `{ refreshToken }` |
| `/auth/me` | GET | `Authorization: Bearer <accessToken>` |
| `/auth/logout` | POST | `{ refreshToken }` + Bearer token |

---

## Repo structure

```
.
├── apps/
│   ├── mobile/              # Expo React Native app
│   │   ├── App.tsx
│   │   ├── index.js         # Expo entry (registerRootComponent)
│   │   ├── expo.config.base.js
│   │   └── src/
│   ├── api/                 # Express + SQLite auth API
│   │   └── data/            # vibecheck.db (gitignored, auto-created)
│   └── web/                 # placeholder
├── packages/
│   ├── shared-types/
│   ├── api-client/          # Typed auth HTTP client
│   ├── ui-kit/
│   └── shared-utils/
├── app.config.js            # Expo config when starting from repo root
├── metro.config.js            # Metro monorepo config (→ apps/mobile)
├── babel.config.js
└── infra/docker/            # optional Postgres/Redis (not required for auth)
```

---

## Tech stack

| Area | Stack |
|------|--------|
| Mobile | Expo 52, React Native 0.76, TypeScript (strict) |
| Navigation | React Navigation (native stack) |
| State | Zustand (`authStore`, `vibeStore`) |
| Session storage | `expo-secure-store` (tokens + user profile) |
| Auth API | Express, **SQLite**, bcrypt, JWT |
| Itineraries (dev) | Claude via `itineraryService` in the client — move behind API before production |

---

## Scripts

From the **repo root**:

| Command | Description |
|---------|-------------|
| `npm run api` | Start auth API on port **3001** |
| `npm run mobile` | Start Expo (with cache clear) |
| `npm run typecheck` | Typecheck all workspaces |
| `npm run lint` | Lint all workspaces |
| `npm run test` | Test all workspaces |
| `npm run db:up` | Optional: Docker Postgres + Redis |

From **`apps/mobile`**:

| Command | Description |
|---------|-------------|
| `npm start` | `expo start` |
| `npm run android` | Open Android |
| `npm run ios` | Open iOS |
| `npm run typecheck` | `tsc --noEmit` |

---

## Troubleshooting

### `EADDRINUSE` on port 3001

The API is **already running**. Check with:

```bash
curl http://localhost:3001/health
```

To restart, stop the old process then run `npm run api` again:

```bash
kill $(lsof -t -i :3001)
npm run api
```

### `Cannot reach the API at http://…`

1. Confirm Terminal 1 shows `Vibecheck API listening on http://localhost:3001`
2. Confirm `curl http://localhost:3001/health` works on your Mac
3. On **Android emulator**, the app should use `http://10.0.2.2:3001` (automatic). Do **not** use `http://10.0.0.2:3001`
4. Restart Expo with `npx expo start --clear` after changing `.env`

### `"main" has not been registered`

Stop Metro and restart from `apps/mobile` (or repo root) with a clean cache:

```bash
npx expo start --clear
```

### Expo config error (`Cannot find module './apps/mobile/app.config'`)

Use the current repo layout (`app.config.js` at root → `apps/mobile/expo.config.base.js`). Pull latest and run from root or `apps/mobile` as shown above.

### `docker: command not found`

You do **not** need Docker for auth. Use `npm run api` only.

### Sign-up works but I’m not signed in after restart

Ensure you used **Create account** or **Sign in** (not only guest mode). Guest sessions are not persisted. Authenticated sessions are stored in SecureStore and restored on launch.

---

## Mobile architecture

| Path | Role |
|------|------|
| `index.js` | Registers root component with Expo |
| `App.tsx` | `SafeAreaProvider` + `NavigationContainer` |
| `src/navigation/RootNavigator.tsx` | Auth vs main flow based on session |
| `src/store/authStore.ts` | Sign-in/up, bootstrap, secure persistence |
| `src/store/vibeStore.ts` | Vibe query + itinerary state |
| `src/services/itineraryService.ts` | Claude itinerary generation (dev) |
| `src/constants/theme.ts` | Design tokens |

Design: dark UI — `#0D0D0F` background, `#FF5C35` coral primary, `#FFD166` accent.

---

## Roadmap

**Near term**

- [x] Email/password auth with JWT + SQLite
- [x] Persistent sessions (secure store)
- [ ] Move Claude behind `apps/api` (`POST /recommendations/itinerary`)
- [ ] OAuth (Apple / Google)
- [ ] Real location via `expo-location`
- [ ] Save itineraries locally
- [ ] Home / onboarding screen

**Later**

- Event/activity aggregation
- Open invites / social layer
- Affiliate & sponsored placements

---

## Contributing

1. Branch from `main`
2. Run `npm run typecheck` and `npm run lint`
3. Open a PR — CI runs on push/PR

Share types and clients via `@vibecheck/shared-types` and `@vibecheck/api-client`.

---

## License

Private — all rights reserved unless otherwise specified by the repo owners.
