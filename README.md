# Vibecheck

**Figure out what to do instantly.** Vibecheck helps you discover experiences based on your vibe, budget, distance, time, and who you're with — without the planning headache.

> Not an "AI travel planner." It's an app for answering: *What should we do tonight?* *Where should I go this weekend?* *What's fun nearby?*

## What it does

Users pick a mood and a few filters; the app returns a curated mini-itinerary — bars, restaurants, neighborhoods, hidden gems, and suggested stops — tailored to the moment.

**MVP flow (mobile):**

1. **Vibe** — chill, social, romantic, adventurous, foodie, nightlife, outdoorsy, productive
2. **Filters** — budget, time available, group (solo / date / friends), distance
3. **Loading** — generates your plan
4. **Itinerary** — stops, estimated cost, regenerate or start over

**Product strategy:** Start with discovery, recommendations, and itineraries. Social features (open invites, groups, meeting people) come later — the app should be useful even with few users.

## Repo structure

Monorepo layout for mobile, future API/web, and shared packages:

```
.
├── apps/
│   ├── mobile/          # Expo React Native app (MVP — start here)
│   ├── api/             # Backend placeholder (itinerary proxy, auth, etc.)
│   └── web/             # Web app placeholder
├── packages/
│   ├── shared-types/    # Domain types (VibeQuery, Itinerary, Activity, …)
│   ├── api-client/      # Typed API client (for when apps/api exists)
│   ├── ui-kit/          # Shared design tokens
│   └── shared-utils/    # Shared helpers
├── infra/
│   └── docker/          # Local Postgres + Redis for backend development
└── .github/workflows/   # CI (typecheck, lint)
```

## Tech stack

| Area | Stack |
|------|--------|
| Mobile | Expo 52, React Native 0.76, TypeScript (strict) |
| Navigation | React Navigation (native stack) |
| State | Zustand |
| Recommendations (dev) | Claude API via `itineraryService` — **must move behind `apps/api` before production** |
| Future API | Node service + Postgres/Redis (see `infra/docker`) |

## Prerequisites

- **Node.js 20+** ([`.nvmrc`](.nvmrc): `nvm use`)
- **npm** (repo uses `package-lock.json` and npm workspaces)
- **Expo Go** on your phone, or Android Studio / Xcode simulator
- **Anthropic API key** (optional for local dev — needed to generate itineraries)

## Getting started

### 1. Install dependencies

```bash
git clone <your-repo-url>
cd TouchGrass   # or your clone directory name

npm install
```

### 2. Configure environment (mobile)

```bash
cp apps/mobile/.env.example apps/mobile/.env
```

Edit `apps/mobile/.env` and set:

```env
EXPO_PUBLIC_ANTHROPIC_API_KEY=sk-ant-...
```

Get a key at [console.anthropic.com](https://console.anthropic.com).

> **Security:** This key is only for local development. Before shipping to real users, proxy Claude through `apps/api` so the key never lives in the client.

### 3. Run the mobile app

```bash
cd apps/mobile
npx expo start --clear
```

Then press `i` (iOS simulator), `a` (Android emulator), or scan the QR code with **Expo Go**.

Always run Expo from `apps/mobile` (or ensure Metro’s project root is that folder). If you see `"main" has not been registered`, stop Metro and restart with `--clear` from `apps/mobile`.

### 4. Optional — local database (for future API work)

When you start building `apps/api`:

```bash
docker compose -f infra/docker/docker-compose.yml up -d
```

- Postgres: `localhost:5432` (db `vibecheck`, user `postgres`, password `password`)
- Redis: `localhost:6379`

## Scripts

From the **repo root**:

| Command | Description |
|---------|-------------|
| `npm run typecheck` | Typecheck all workspaces |
| `npm run lint` | Lint all workspaces |
| `npm run test` | Run tests in all workspaces |

From **`apps/mobile`**:

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run android` | Expo + Android |
| `npm run ios` | Expo + iOS |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Jest (jest-expo) |

`apps/api` and `apps/web` are stubs today — scripts print a placeholder until those apps are implemented.

## Mobile app architecture

- **`index.js`** — registers the root component with Expo (`registerRootComponent`)
- **`App.tsx`** — `NavigationContainer` + stack navigator
- **`src/store/vibeStore.ts`** — global query + itinerary state (Zustand)
- **`src/hooks/useItinerary.ts`** — orchestrates generate/regenerate
- **`src/services/itineraryService.ts`** — Claude prompt + JSON parsing (dev only)
- **`src/constants/`** — theme tokens, vibe/filter options, TypeScript types

Design: dark UI (`#0D0D0F` background, `#FF5C35` coral primary, `#FFD166` accent).

## Roadmap

**Near term**

- [ ] Move Claude calls behind `apps/api` (`POST /recommendations/itinerary`)
- [ ] Real location via `expo-location` in the prompt
- [ ] Save itineraries (`@react-native-async-storage/async-storage`)
- [ ] Home / onboarding screen before vibe picker
- [ ] Safe area handling on itinerary footer

**Later**

- Event/activity aggregation (maps, Yelp, Eventbrite, etc.)
- Open invites / lightweight social layer
- Affiliate & sponsored placements

## Contributing

1. Create a branch from `main`
2. Make changes; run `npm run typecheck` and `npm run lint`
3. Open a PR — CI runs on push/PR

Use the shared packages (`@vibecheck/shared-types`, etc.) for types and clients that cross mobile, web, and API.

## License

Private — all rights reserved unless otherwise specified by the repo owners.
