# Software Study Scripts — Frontend

React + Vite frontend for the Software Study Scripts app — browse topics and concepts, register/log in, take personal notes, bookmark topics, and (for admins) manage users.

## Stack

- React + Vite
- TypeScript
- Mantine UI
- wouter (routing)

## Running locally

Requires the backend running on `http://localhost:8080` first (see the backend repo's README for setup — `docker compose up -d db` then `./mvnw spring-boot:run`, or `docker compose up --build` for the whole stack).

```bash
npm install
npm run dev
```

Vite proxies any `/api/*` request to `http://localhost:8080` (see `vite.config.ts`), so the app and backend can run on separate ports in dev without CORS issues.

## Pages

| Route | Page | Notes |
|---|---|---|
| `/` | Main | Landing page |
| `/login` | Login | Register / sign in / forgot password |
| `/topics` | Topics | Public topic browsing |
| `/user-topics` | User Topics | Topic browsing with bookmarking |
| `/concepts/:topicSlug` | Concepts List | Concepts for a topic, plus personal notes |
| `/concept/:slug` | Concept | Single concept detail (**requires login**) |
| `/account` | Account Home | Logged-in dashboard (**requires login**) |
| `/admin` | Admin | User management — list/promote/delete (**requires login + admin role**) |

## Auth

Session-cookie based — `AuthContext` calls `GET /api/auth/me` on load to check if a session is active, and `Protected` wraps routes that require login, redirecting to `/login` if there's no user. No tokens are stored client-side; the browser's session cookie handles everything.

## User Stories (Manual Test Scenarios)

- As a visitor, I can browse `/topics` and view concepts without an account.
- As a new user, I can register from `/login` and see a confirmation message.
- As a registered user, I can log in and land on `/account`.
- As a logged-in user, I can open a topic's concepts, write a note, and see it saved.
- As a logged-in user, I can edit or delete my own notes from the concepts list page.
- As a logged-in user, I can bookmark a topic from `/user-topics` and see it reflected on `/account`.
- As a logged-out user, navigating to `/concept/:slug`, `/account`, or `/admin` redirects me to `/login`.
- As an admin, I see an "Admin" link on `/account` and can view/promote/delete users at `/admin`.
- As a non-admin, I don't see the admin link and am redirected away from `/admin` if I try to visit it directly.
- As a logged-in user, clicking logout ends my session and returns me to a logged-out state.

## Building for production

```bash
npm run build
```
Outputs to `dist/`.


