# IT4490 Backend

## Getting Started

1. Install dependencies
   ```bash
   cd backend
   npm install
   ```
2. Copy `.env.example` to `.env` (create the file if it does not exist yet) and provide the variables listed below.
3. Start the development server
   ```bash
   npm run dev
   ```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the backend in watch mode (`nodemon`). |
| `npm run dev:server` | Alias for `npm run dev` (useful in multi-workspace repos). |
| `npm test` | Run the backend smoke tests (delegates to `test:server`). |
| `npm run test:server` | Execute the Node test runner + Supertest suite in `backend/tests`. |

## Environment Variables

All variables are validated at boot via Zod (see `backend/config/env.js`). Missing or malformed values will stop the server and print a detailed error list.  
Place the following keys inside `backend/.env`:

| Key | Description |
| --- | --- |
| `NODE_ENV` | `development`, `test`, or `production`. Defaults to `development`. |
| `PORT` | HTTP port for Express. Defaults to `3000`. |
| `FRONTEND_URL` | Base URL of the client app, used for CORS + OAuth redirects. |
| `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` | Postgres connection details. |
| `DB_SSL` | `"true"` to enable SSL (required for Supabase/Neon), otherwise omit/`"false"`. |
| `JWT_SECRET`, `JWT_REFRESH_SECRET`, `JWT_RESET_SECRET` | Secrets for issuing/verifying tokens. |
| `SESSION_SECRET` | Secret used by `express-session`. |
| `EMAIL_USER`, `EMAIL_PASS` | SMTP credentials (Gmail or custom provider). |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Cloudinary uploads. |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL` | Google OAuth configuration. |
| `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`, `FACEBOOK_CALLBACK_URL` | Facebook OAuth configuration. |
| `SHOP_PROVINCE_ID`, `SHOP_CITY` | Shipping fee heuristics (optional, fallback to Hà Nội). |
| `VNP_TMN_CODE`, `VNP_HASH_SECRET`, `VNP_URL`, `VNP_RETURN_URL` | VNPay integration (optional, leave blank to disable). |

> Tip: run `npm run dev` after editing `.env` to validate that the new values satisfy the schema.
